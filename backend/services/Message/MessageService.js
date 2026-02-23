import { Message } from "../../modals/Message.modal.js";
import { Op } from "sequelize";

class MessageService {

    static async getAllMessages(senderId, receiverId) {
        try {
            const messages = await Message.findAll({
                where: {
                    [Op.or]: [
                        {
                            senderId,
                            receiverId,
                            deletedForSender: false,
                            deletedForEveryone: false
                        },
                        {
                            senderId: receiverId,
                            receiverId: senderId,
                            deletedForReceiver: false,
                            deletedForEveryone: false
                        }
                    ]
                },
                order: [['createdAt', 'ASC']]
            });
            return { messages };
        } catch (error) {
            throw error;
        }
    }

    static async getMessages() { }

    static async getMessageById() { }

    static async getUnreadMessagesByUserId() { }
}

export default MessageService;