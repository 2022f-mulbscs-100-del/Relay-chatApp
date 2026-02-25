import { logger } from "../../Logger/Logger.js";
import { Message } from "../../modals/Message.modal.js";
import axios from "axios";

export const handlePrivateMessage = (io, socket) => {

    return async ({ toUserId, content, imageUrl }) => {
        if (!socket.userId) return;
        logger.info(`Private message from ${socket.userId} to ${toUserId}`);
        const rawBufferImage = imageUrl;
        let safeURL = null;

        if (rawBufferImage) {
            //converting arraybuffer to blob
            const blob = new Blob(
                [new Uint8Array(rawBufferImage)],
                { type: "image/png" }
            );

            //blob to file
            const file = new File([blob], "image.png", { type: "image/png" });

            //formdata to send file 
            const form = new FormData();
            form.append("file", file);

            //uploading image
            const res = await axios.post("http://localhost:2404/api/images/upload", form);
             safeURL = res.data.imageUrl;
            console.log("Image uploaded successfully, URL:", safeURL);
        }

        try {

            //storing message to db
            const message = await Message.create({
                senderId: socket.userId,
                receiverId: toUserId,
                content: content,
                isRead: false,
                ImageUrl: rawBufferImage ? safeURL : null,
            });
            // Send the private_message event to the sockets that are in the room toUserId
            io.to(toUserId).emit("private_message", {
                messageId: message.id,
                fromUserId: socket.userId,
                content,
                toUserId,
                ImageUrl: rawBufferImage ? rawBufferImage : null,
                timestamp: new Date(),
            });

        } catch (error) {
            logger.error(`Error handling private message: ${error.message}`);
        }

    }
}