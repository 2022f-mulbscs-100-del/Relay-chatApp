import { Server } from "socket.io";
import { logger } from "../Logger/Logger.js";
import { Message } from "../modals/Message.modal.js";
import Group from "../modals/Group.modal.js";
import AuthService from "../services/Auth/AuthService.js";
import GroupMessage from "../modals/GroupMessage.modal.js";
import { Op, Sequelize } from "sequelize";
import { sequelize } from "../config/dbConfig.js";

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
            console.log("create_group event received with data: ---------->", { groupName, memberIds, userId });
            const { user } = await AuthService.FindById(userId)

           
            const allMembers = [...new Set([...memberIds, userId])];

            const group = await Group.create({
                groupName,
                createdBy: user.username,
                memberIds: allMembers
            })

           
            for (const memberId of allMembers) {
                io.to(String(memberId)).emit("group_created", group);
                console.log(`Emitted group_created event to user ${memberId} for group ${group.id}`);
            }

        })

        socket.on("group_message", async ({ groupId, content, userId }) => {

            io.to(String(groupId)).emit("group_message", {
                groupId,
                content,
                fromUserId: userId,
                timestamp: new Date(),
            })

            await GroupMessage.create({
                groupId,
                senderId: userId,
                content
            })
        })


        socket.on("disconnect", () => {
            logger.info(`Socket disconnected: ${socket.id}`);
            // for (const [userId, socketId] of Object.entries(connectedUsers)) {
            //     if (socketId === socket.id) {
            //         delete connectedUsers[userId];
            //         logger.info(`User disconnected: ${userId}`);
            //         break;
            //     }
            // }
        });
    });

    return io;
};

export const getConnectedUsers = () => connectedUsers;
