import GroupService from "../services/Groups/GroupService.js";

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
   
    try {
        const { groupMessage } = await GroupService.GetGroupMessages(groupId);
        res.status(200).json({ groupMessage });
    } catch (error) {
        next(error);
    }
}   


export const markGroupMessageAsReadController = async (req,res,next)=>{
    const {groupId}= req.body;
    const userId = req.user.id;
    try {
        await GroupService.MarkGroupMessageAsRead(groupId,userId);
        res.status(200).json({ message: "Group messages marked as read" });
    } catch (error) {
        next(error);
    }

}