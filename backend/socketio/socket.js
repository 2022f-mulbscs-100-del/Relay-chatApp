import { Server } from "socket.io";
import { logger } from "../Logger/Logger.js";
import { Message } from "../modals/Message.modal.js";
import Group from "../modals/Group.modal.js";
import AuthService from "../services/Auth/AuthService.js";
import GroupMessage from "../modals/GroupMessage.modal.js";
import { Op, Sequelize } from "sequelize";
import { sequelize } from "../config/dbConfig.js";
import GroupService from "../services/Groups/GroupService.js";
import User from "../modals/User.modal.js";

const connectedUsers = new Map(); // Map to store userId and their corresponding socketId(s)

export const initializeSocket = (server) => {

    const io = new Server(server, {
        cors: {
            origin: true,
            methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
            credentials: true,
        },
    });


    io.on("connection", (socket) => {
        logger.info(`New socket connection: ${socket.id}`);

        socket.on("register", async (userId) => {
            socket.userId = userId;
            socket.join(String(userId));
            logger.info(`User ${userId} registered with socket ${socket.id}`);

            const groups = await Group.findAll({
                where: Sequelize.where(
                    Sequelize.fn(
                        'JSON_CONTAINS',
                        Sequelize.col('memberIds'),
                        JSON.stringify(userId)
                    ),
                    1
                )
            });

            for (const group of groups) {
                socket.join(String(group.id));
            }

            if (!connectedUsers.has(userId)) {
                connectedUsers.set(userId, new Set());
                socket.broadcast.emit("user_online", userId); // Notify others that this user is online
            }
            connectedUsers.get(userId).add(socket.id);
            socket.emit("online_users", { // Send the list of currently online users to the newly connected user mean the current user
                users: Array.from(connectedUsers.keys()),
            });
        });

        socket.on("join_group", async ({ groupId, userId }) => {
            socket.join(String(groupId));
            logger.info(`User ${userId} joined group ${groupId}`);
        });


        socket.on("private_message", async ({ toUserId, content }) => {
            if (!socket.userId) return;
            logger.info(`Private message from ${socket.userId} to ${toUserId}`);



            try {
                //storing message to db
                const message = await Message.create({
                    senderId: socket.userId,
                    receiverId: toUserId,
                    content: content,
                    isRead: false,
                });
                // Send the private_message event to the sockets that are in the room toUserId
                io.to(toUserId).emit("private_message", {
                    messageId: message.id,
                    fromUserId: socket.userId,
                    content,
                    toUserId,
                    timestamp: new Date(),
                });

            } catch (error) {
                logger.error(`Error handling private message: ${error.message}`);
            }

        });




        //here we are receving message the user is sending message threought this event 
        //privatemessage and we sending that message or forwarding that message to 
        //the specific user using toUserId(room)
        //on front end the user is receving that message by listening to the same event name private message
        //and then updating the chat window
        //Group creation and notifying other


        socket.on("create_group", async ({ groupName, memberIds, userId }) => {

            const { user } = await AuthService.FindById(userId)


            const allMembers = [...new Set([...memberIds, userId])];

            const group = await Group.create({
                groupName,
                createdBy: user.username,
                memberIds: allMembers
            })


            for (const memberId of allMembers) {
                io.to(String(memberId)).emit("group_created", group);
            }

        })

        socket.on("group_message", async ({ groupId, content, userId, timestamp }) => {
            if (!socket.userId) return;
            io.to(String(groupId)).emit("group_message", {
                groupId,
                content,
                fromUserId: userId,
            })

            await GroupMessage.create({
                groupId,
                senderId: socket.userId,
                content,
            })
        })

        //add/remove members from group

        socket.on("add_member", async ({ groupId, newMemberIds }) => {
            const { group } = await GroupService.GetGroupByGroupId(groupId);
            if (!group) {
                logger.error(`Group with ID ${groupId} not found`);
                return;
            }
            const memberArray = Array.isArray(group.memberIds)
                ? group.memberIds
                : (group.memberIds ? JSON.parse(group.memberIds) : []);
            
            const addedMembers = [];
            for (const newMemberId of newMemberIds) {
                if (!memberArray.includes(Number(newMemberId))) {
                    memberArray.push(Number(newMemberId));
                    addedMembers.push(Number(newMemberId));
                }
            }
            
            // Update DB ONCE after loop using raw Sequelize update
            await Group.update(
                { memberIds: memberArray },
                { where: { id: groupId } }
            );
            
            // Send only the newly added members
            io.emit("group_updated", {
                groupId,
                newMemberIds: addedMembers,
            });
        });

        //leave group
        socket.on("leave_group", async ({ groupId, userId }) => {
            const { group } = await GroupService.GetGroupByGroupId(groupId);
            const memberArray = Array.isArray(group.memberIds)
                ? group.memberIds
                : (group.memberIds ? JSON.parse(group.memberIds) : []);
            const updatedMembers = memberArray.filter(id => Number(id) !== Number(userId));
            await group.update({ memberIds: updatedMembers });
            socket.leave(String(groupId));
            logger.info(`User ${userId} left group ${groupId}`);
        })

        socket.on("disconnect", async () => {
            logger.info(`Socket disconnected: ${socket.id}`);
            const userId = socket.userId;
            if (!userId || !connectedUsers.has(userId)) return;

            const userSockets = connectedUsers.get(userId);
            userSockets.delete(socket.id);

            if (userSockets.size === 0) {
                connectedUsers.delete(userId);
                await User.update({ lastSeen: new Date().toISOString() }, { where: { id: userId } });
                socket.broadcast.emit("user_offline", userId);
                socket.broadcast.emit("user_last_seen", { userId, lastSeen: new Date().toISOString() });
            }
        });
    });



    return io;
};

export const getConnectedUsers = () => connectedUsers;
