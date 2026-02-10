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
            include: [{ model: GroupMessage, as: 'groupMessages' }]
        }
        );
        return { groups };
    }

}

export default GroupService;