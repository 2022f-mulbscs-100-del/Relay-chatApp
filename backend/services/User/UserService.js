import { logger } from "../../Logger/Logger.js";
import User from "../../modals/User.modal.js";
import Auth from "../../modals/Auth.modal.js";
import { Message } from "../../modals/Message.modal.js";
import { ErrorHandler } from "../../utlis/ErrorHandler.js";
import { Op } from "sequelize";
class UserService {

    static async getUserById(id) {
        try {
            const user = await User.findByPk(id, {
                include: [{ model: Auth, as: "auth" }]
            });

            if (!user) {
                logger.warn(`User not found with ID: ${id}`);
                throw ErrorHandler(404, "User not found");
            }
            logger.info(`User fetched successfully with ID: ${id}`);
            return {
                user
            }
        } catch (error) {
            logger.error(`Error fetching user with ID ${id}: ${error.message}`, { stack: error.stack });
            throw error;
        }
    }

    static async getAssociatedUser(id) {
        try {
            const { user } = await UserService.getUserById(id);
            let fetchedUsers = [];
            let hasMessaged = [];

            if (typeof user.hasMessaged === "string") {
                fetchedUsers = JSON.parse(user.hasMessaged);
            }
            for (const userEmail of fetchedUsers) {
                const userDetails = await User.findOne({
                    where: {
                        email: userEmail
                    },
                    include: [
                        {
                            model: Message,
                            as: 'sentMessages',
                            where: {
                                receiverId: user.id
                            },
                            required: false
                        },
                        {
                            model: Message,
                            as: 'receivedMessages',
                            where: {
                                senderId: user.id
                            },
                            required: false
                        }
                    ],
                    order: [
                        [{ model: Message, as: 'sentMessages' }, 'createdAt', 'ASC'],
                        [{ model: Message, as: 'receivedMessages' }, 'createdAt', 'ASC']
                    ]
                })
                if (userDetails) {
                    hasMessaged.push(userDetails);
                }
            }

            logger.info(`Users fetched successfully. Count: ${fetchedUsers.length}`);
            return {
                hasMessaged
            }


        } catch (error) {
            logger.error(`Error fetching users: ${error.message}`, { stack: error.stack });
            throw error
        }
    }


    static async getAllUsers(id) {
        try {
            const users = await User.findAll({
                where: {
                    id: {
                        [Op.ne]: id
                    }
                }
            });
            logger.info(`All users fetched successfully. Count: ${users.length}`);
            return {
                users
            }
        } catch (error) {
            logger.error(`Error fetching all users: ${error.message}`, { stack: error.stack });
            throw error;
        }
    }


    static async addAssociatedUser(id, userId) {
        try {
            const { user } = await UserService.getUserById(id);
            const { user: toSaveUser } = await UserService.getUserById(userId);
            if (!user) {
                logger.warn(`User not found with ID: ${id}`);
                throw ErrorHandler(404, "User not found");
            }

            let hasMessaged = [];
            try {
                user.hasMessaged = JSON.parse(user.hasMessaged || "[]");
                hasMessaged = user.hasMessaged;
                if (hasMessaged.includes(toSaveUser.email)) {
                    logger.info(`User with ID ${id} already has ${toSaveUser.email} in hasMessaged list.`);
                    throw ErrorHandler(400, "User already associated");
                }
                hasMessaged.push(toSaveUser.email);
                user.hasMessaged = JSON.stringify(hasMessaged);
                await user.save();
                logger.info(`User with ID ${id} updated successfully with new email: ${toSaveUser.email}`);


            } catch (error) {
                logger.error(`Error updating user with ID ${id}: ${error.message}`, { stack: error.stack });
                throw error;
            }

            return {
                user
            }

        } catch (error) {
            logger.error(`Error updating user with ID ${id}: ${error.message}`, { stack: error.stack });
            throw error;
        }
    }

    static async UpdateUserProfile(id, username, phone, location, about, title, tags) {
        const { user } = await UserService.getUserById(id);
        user.username = username || user.username;
        user.phone = phone || user.phone;
        user.location = location || user.location;
        user.about = about || user.about;
        user.title = title || user.title;
        user.tags = tags || user.tags;

        try {
            await user.save();
            logger.info(`User profile updated successfully with ID: ${id}`);
            return {
                user
            }
        } catch (error) {
            logger.error(`Error updating user profile with ID ${id}: ${error.message}`, { stack: error.stack });
            throw error;
        }
    }
}

export default UserService;