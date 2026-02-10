import { Op } from "sequelize";
import { Message } from "../modals/Message.modal.js";
import User from "../modals/User.modal.js";
import { MessageService } from "../services/Message/index.js";

export const getMessagesController = async (req, res) => {
    const { id: senderId } = req.user;
    const { chatId: receiverId } = req.params;
    try {
        const { messages } = await MessageService.getAllMessages(senderId, receiverId);
        return res.status(200).json({ success: true, messages });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};


export const UpdateMessagesController = async (req, res, next) => {
    const { id: receiverId } = req.user;
    const { chatId: senderId } = req.params;

    try {
        const messages = await Message.findAll({
            where: {
                senderId: senderId,
                receiverId: receiverId,
                isRead: false
            }
        });

        if (messages.length === 0) {
            return res.status(200).json({ success: true, message: "No unread messages found." });
        }
        for (const message of messages) {
            message.isRead = true;
            await message.save();
        }

        return res.status(200).json({ success: true, messages, message: "Messages updated successfully." });
    } catch (error) {
        next(error);
    }
}


export const updateMessageController = async (req, res, next) => {
    const { messageId } = req.body;

    try {
        const message = await Message.findByPk(messageId);
        if (!message) {
            return res.status(404).json({ success: false, message: "Message not found." });
        }

        message.isRead = true;
        await message.save();

        return res.status(200).json({ success: true, message: "Message updated successfully.", updatedMessage: message });
    } catch (error) {
        next(error);
    }


}



export const unReadChatListController = async (req, res, next) => {
    const { id: userId } = req.user;
    try {
        const message = await Message.findAll(
            {
                where:
                {
                    receiverId: userId,
                    isRead: false
                }
            }
        )
        let ListOfUser = []
        for (const messages of message) {
            const user = await User.findByPk(messages.senderId, {
                include: [{ model: Message, as: 'sentMessages', where: { receiverId: userId } }]
            })
            ListOfUser.push(user)
        }
        res.status(200).json({ success: true, message: "Unread chats fetched successfully.", unreadChats: ListOfUser })
    } catch (error) {
        next(error)
    }

}