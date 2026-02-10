import { Message } from "../../modals/Message.modal.js";
import { Op } from "sequelize";
import { logger } from "../../Logger/Logger.js";

class MessageService {

    static async getAllMessages(senderId, receiverId) {
        try {
            const messages = await Message.findAll({
                where: {
                    [Op.or]: [
                        { senderId, receiverId },
                        { senderId: receiverId, receiverId: senderId }
                    ]
                },
                order: [['createdAt', 'ASC']]
            });
            return { messages };
        } catch (error) {
            throw error;
        }
    }

    static async getMessages() {}

    static async getMessageById() {}

    static async getUnreadMessagesByUserId() {}
}

export default MessageService;