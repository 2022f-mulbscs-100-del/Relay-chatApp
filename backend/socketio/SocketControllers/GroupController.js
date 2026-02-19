import { logger } from "../../Logger/Logger.js";
import Group from "../../modals/Group.modal.js";
import GroupMessage from "../../modals/GroupMessage.modal.js";
import GroupService from "../../services/Groups/GroupService.js";
import AuthService from "../../services/Auth/AuthService.js";
import GroupMember from "../../modals/GroupMember.modal.js";

export const leaveGroup = (socket) => {
    return async ({ groupId, userId }) => {
        const { group } = await GroupService.GetGroupByGroupId(groupId);
        const memberArray = Array.isArray(group.memberIds)
            ? group.memberIds
            : (group.memberIds ? JSON.parse(group.memberIds) : []);
        const updatedMembers = memberArray.filter(async id => {
            if(Number(id) === Number(userId)){
                await GroupMember.destroy({
                    where: {
                        groupId,
                        userId,
                    }
                })
            }
            return (Number(id) !== Number(userId))
        });
        await group.update({ memberIds: updatedMembers });
        socket.leave(String(groupId));
        logger.info(`User ${userId} left group ${groupId}`);
    }
}


export const addMemberToGroup = (io) => {

    return async ({ groupId, newMemberIds }) => {
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
                await GroupMember.create({
                    groupId: groupId,
                    userId: newMemberId
                })
            }
            // await GroupMember.
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
    }
}

export const groupMessage = (io, socket) => {
    return async ({ groupId, content, userId }) => {
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
    }
}


export const createGroup = (io) => {
    return async ({ groupName, memberIds, userId }) => {

        const { user } = await AuthService.FindById(userId);
        const allMembers = [...new Set([...memberIds, userId])];

        const group = await Group.create({
            groupName,
            createdBy: user.username,
            memberIds: allMembers
        })



        for (const memberId of allMembers) {
            io.to(String(memberId)).emit("group_created", group);
            await GroupMember.create({
                groupId: group.id,
                userId: memberId,
            })
        }

    }
}

export const joinGroup = (socket) => {
    return async ({ groupId, userId }) => {
        socket.join(String(groupId));
        logger.info(`User ${userId} joined group ${groupId}`);
    }
}