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