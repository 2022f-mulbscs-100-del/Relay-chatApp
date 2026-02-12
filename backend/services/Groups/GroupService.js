import Group from "../../modals/Group.modal.js";
import { or, Sequelize } from "sequelize";
import GroupMessage from "../../modals/GroupMessage.modal.js";

class GroupService {

    static async FindGroupByUser(id) {

        const groups = await Group.findAll({
            where: Sequelize.where(
                Sequelize.fn(
                    'JSON_CONTAINS',
                    Sequelize.col('memberIds'),
                    JSON.stringify(id)
                ),
                1
            ),
            include: [{
                model: GroupMessage,
                as: 'groupMessages'
            }],
            order: [[{ model: GroupMessage, as: 'groupMessages' }, 'createdAt', 'ASC']]
        }
        );
        return { groups };
    }

    static async GetGroupMessages(groupId) {
        const groupMessage = await GroupMessage.findAll({
            where: {
                groupId,
            },
            order: [['createdAt', 'ASC']]
        })

        return { groupMessage };
    }

    static async MarkGroupMessageAsRead(groupId, userId) {
        try {
            console.log("Marking group messages as read for user:", userId, "in group:", groupId);
            // Ensure userId is a string for consistent comparison
            const userIdStr = String(userId);
            
            const groupMessages = await GroupMessage.findAll({
                where: {
                    groupId,
                }
            });
            
            console.log("Total group messages found:", groupMessages.length);
            let markedCount = 0;
            
            for (const message of groupMessages) {
              console.log("Processing message:", message.id, "Current isReadBy:", message.isReadBy);
                const isReadBy = Array.isArray(message.isReadBy) ? message.isReadBy : JSON.parse(message.isReadBy || "[]");
                
                
                if (!isReadBy.includes(userIdStr)) {
                    isReadBy.push(userIdStr);
                    message.isReadBy = JSON.stringify(isReadBy);
                    console.log("Marking as read - Message:", message.id, "New isReadBy:", message.isReadBy);
                    await message.save();
                    markedCount++;
                }
            }
            
            console.log(`Marked ${markedCount} messages as read for user ${userIdStr}`);
            return { message: `${markedCount} group messages marked as read` };
        }
        catch (error) {
            console.error("Error marking messages as read:", error);
            throw error;
        }
    }
}


export default GroupService;