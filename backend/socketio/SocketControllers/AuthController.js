import Group from "../../modals/Group.modal.js";
import User from "../../modals/User.modal.js";
import { connectedUsers } from "../socket.js";
import { logger } from "../../Logger/Logger.js";
import { Sequelize } from "sequelize";

export const handleRegister = (socket) => {
    return async (userId) => {
        socket.userId = userId;
        socket.join(String(userId));
        logger.info(`User ${userId} registered with socket ${socket.id}`);

        const groups = await Group.findAll({
            where: Sequelize.where(
                Sequelize.fn(
                    'JSON_CONTAINS',
                    Sequelize.col('memberIds'),
                    JSON.stringify(userId)
                ),
                1
            )
        });

        for (const group of groups) {
            socket.join(String(group.id));
        }

        if (!connectedUsers.has(userId)) {
            connectedUsers.set(userId, new Set());
            socket.broadcast.emit("user_online", userId); // Notify others that this user is online
        }
        connectedUsers.get(userId).add(socket.id);
        socket.emit("online_users", { // Send the list of currently online users to the newly connected user mean the current user
            users: Array.from(connectedUsers.keys()),
        });
    }
}


export const handleDisconnect = (socket) => {
    return async () => {
        logger.info(`Socket disconnected: ${socket.id}`);
        const userId = socket.userId;
        if (!userId || !connectedUsers.has(userId)) return;

        const userSockets = connectedUsers.get(userId);
        userSockets.delete(socket.id);

        if (userSockets.size === 0) {
            connectedUsers.delete(userId);
            await User.update({ lastSeen: new Date().toISOString() }, { where: { id: userId } });
            socket.broadcast.emit("user_offline", userId);
            socket.broadcast.emit("user_last_seen", { userId, lastSeen: new Date().toISOString() });
        }
    }

}