import Group from "../../modals/Group.modal.js";
import { Op, or, Sequelize } from "sequelize";
import GroupMessage from "../../modals/GroupMessage.modal.js";
import GroupMember from "../../modals/GroupMember.modal.js";

class GroupService {

    static async FindGroupByUser(id) {
        const numericId = Number(id);
        const groups = await Group.findAll({
            where: Sequelize.where(
                Sequelize.fn(
                    'JSON_CONTAINS',
                    Sequelize.col('memberIds'),
                    JSON.stringify(numericId)
                ),
                1
            ),
            include: [{
                model: GroupMessage,
                as: 'groupMessages',    
                where: Sequelize.where(
                    Sequelize.fn('JSON_CONTAINS', Sequelize.col('isDeletedBy'), JSON.stringify(Number(id))),
                    Op.eq,
                    0
                ),
                required: false
            }, {
                
                model: GroupMember,
                as: 'members',
                order: [['userId', 'DESC']]
            }],
            order: [[{ model: GroupMessage, as: 'groupMessages' }, 'createdAt', 'ASC']]
        }
        );
        return { groups };
    }

    static async GetGroupMessages(groupId, userId) {
        const groupMessage = await GroupMessage.findAll({
            where: {
                [Op.and]: [
                    { groupId },
                    Sequelize.where(
                        Sequelize.fn('JSON_CONTAINS', Sequelize.col('isDeletedBy'), JSON.stringify(Number(userId))),
                        Op.eq,
                        0
                    )
                ]
            },
            order: [['createdAt', 'ASC']]
        })

        return { groupMessage };
    }

    static async GetGroupByGroupId(groupId) {
        try {
            const group = await Group.findOne({ where: { id: groupId } })
            return { group }

        } catch (error) {
            throw error
        }
    }

    static async MarkGroupMessageAsRead(groupId, userId) {
        try {

            const userIdStr = String(userId);

            const groupMessages = await GroupMessage.findAll({
                where: {
                    groupId,
                }
            });

            let markedCount = 0;

            for (const message of groupMessages) {
                const isReadBy = Array.isArray(message.isReadBy) ? message.isReadBy : JSON.parse(message.isReadBy || "[]");


                if (!isReadBy.includes(userIdStr)) {
                    isReadBy.push(userIdStr);
                    message.isReadBy = JSON.stringify(isReadBy);
                    await message.save();
                    markedCount++;
                }
            }

            return { message: `${markedCount} group messages marked as read` };
        }
        catch (error) {
            console.error("Error marking messages as read:", error);
            throw error;
        }
    }
}


export default GroupService;