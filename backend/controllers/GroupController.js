import { logger } from "../Logger/Logger.js";
import GroupMember from "../modals/GroupMember.modal.js";
import GroupMessage from "../modals/GroupMessage.modal.js";
import HTTP_STATUS from "../services/Constants.js";
import GroupService from "../services/Groups/GroupService.js";
import { ErrorHandler } from "../utlis/ErrorHandler.js";
import { Op, Sequelize } from "sequelize";

export const getUserGroupsController = async (req, res, next) => {
    const userId = req.user.id;
    try {
        const { groups } = await GroupService.FindGroupByUser(userId);
        res.status(200).json({ groups });
    } catch (error) {
        next(error);
    }
}

export const getGroupMessagesController = async (req, res, next) => {
    const groupId = req.params.groupId;
    const userId = req.user.id;

    try {
        const { groupMessage } = await GroupService.GetGroupMessages(groupId, userId);
        res.status(200).json({ groupMessage });
    } catch (error) {
        next(error);
    }
}


export const markGroupMessageAsReadController = async (req, res, next) => {
    const { groupId } = req.body;
    const userId = req.user.id;
    try {
        await GroupService.MarkGroupMessageAsRead(groupId, userId);
        res.status(200).json({ message: "Group messages marked as read" });
    } catch (error) {
        next(error);
    }

}

export const markGroupPinnedController = async (req, res, next) => {
    const { id } = req.user;
    const { groupId } = req.body;
    try {
        const groupMember = await GroupMember.findOne({
            where: {
                groupId,
                userId: id
            }
        })
        if (!groupMember) {
            return ErrorHandler(HTTP_STATUS.NOT_FOUND, "Group member not found");
        }
        groupMember.isPinned = !groupMember.isPinned;
        await groupMember.save();

        res.status(200).json({ message: `Group ${groupMember.isPinned ? 'pinned' : 'unpinned'} successfully` });
    } catch (error) {
        next(error);
    }

}

export const addGroupCategoryController = async (req, res, next) => {
    const { id } = req.user;
    const { groupId, category } = req.body;
    try {
        const groupMember = await GroupMember.findOne({
            where: {
                groupId,
                userId: id
            }
        })
        if (!groupMember) {
            return ErrorHandler(HTTP_STATUS.NOT_FOUND, "Group member not found");
        }
        groupMember.categoroy = category;
        await groupMember.save();

        res.status(200).json({ message: `Group category updated successfully` });
    } catch (error) {
        next(error);
    }
}

export const muteGroupController = async (req, res, next) => {
    const { id } = req.user;
    const { groupId } = req.body;
    try {
        const groupMember = await GroupMember.findOne({
            where: {
                groupId,
                userId: id
            }
        })
        if (!groupMember) {
            return ErrorHandler(HTTP_STATUS.NOT_FOUND, "Group member not found");
        }
        groupMember.isMuted = !groupMember.isMuted;
        await groupMember.save();

        res.status(200).json({ message: `Group ${groupMember.isMuted ? 'muted' : 'unmuted'} successfully` });
    } catch (error) {
        next(error);
    }

}


export const deleteGroupController = async (req, res, next) => {
    const { id } = req.user;
    const { groupId } = req.params;
    try {

        const groupMessage = await GroupMessage.findAll({
            where: {
                groupId,
                // isDeletedBy: {
                //     where: Sequelize.where(
                //         Sequelize.fn('JSON_CONTAINS', Sequelize.col('isDeletedBy'), JSON.stringify(Number(id))),
                //         Op.eq,
                //         0
                //     ),
                // }
            }
        })

        for (const message of groupMessage) {
            const isDeletedArray = message.isDeletedBy || [];
            if (!isDeletedArray.includes(id)) {
                isDeletedArray.push(id);
                message.isDeletedBy = isDeletedArray;
                message.changed('isDeletedBy', true);
            }
            await message.save();
        }

        res.status(200).json({ message: "Group deleted successfully" });
    } catch (error) {
        next(error);
    }
}