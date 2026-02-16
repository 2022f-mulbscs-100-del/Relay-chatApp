import { logger } from "../../Logger/Logger.js";
import { Message } from "../../modals/Message.modal.js";

export const handlePrivateMessage = (io,socket) => {

    return async ({ toUserId, content }) => {
        if (!socket.userId) return;
        logger.info(`Private message from ${socket.userId} to ${toUserId}`);



        try {
            //storing message to db
            const message = await Message.create({
                senderId: socket.userId,
                receiverId: toUserId,
                content: content,
                isRead: false,
            });
            // Send the private_message event to the sockets that are in the room toUserId
            io.to(toUserId).emit("private_message", {
                messageId: message.id,
                fromUserId: socket.userId,
                content,
                toUserId,
                timestamp: new Date(),
            });

        } catch (error) {
            logger.error(`Error handling private message: ${error.message}`);
        }

    }
}