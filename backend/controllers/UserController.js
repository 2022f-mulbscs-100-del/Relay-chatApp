import User from "../modals/User.modal.js";
import { logger } from "../Logger/Logger.js";
import { Op } from "sequelize";
import { Message } from "../modals/Message.modal.js";

export const getAssociatedUserController = async (req, res, next) => {
    logger.info(`Fetching users for user ID: ${req.user.id}`);

    try {
        const users = await User.findByPk(req.user.id)
        let fetchedUsers = [];
        let hasMessaged = [];

        if (typeof users.hasMessaged === "string") {
            fetchedUsers = JSON.parse(users.hasMessaged);
        }
        for (const user of fetchedUsers) {
            const userDetails = await User.findOne({
                where: {
                    email: user
                },
                include: [
                    {
                        model: Message,
                        as: 'sentMessages',
                        where: {
                            receiverId: req.user.id
                        },
                        required: false
                    },
                    {
                        model: Message,
                        as: 'receivedMessages',
                        where: {
                            senderId: req.user.id
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
        return res.status(200).json({
            success: true,
            message: "Users fetched successfully",
            AcssociatedUsers: hasMessaged,
        });
    } catch (error) {
        logger.error(`Error fetching users: ${error.message}`, { stack: error.stack });
        next(error);
    }
}

export const getSingleUserController = async (req, res, next) => {
    const { id } = req.user;

    try {
        const user = await User.findByPk(id);

        if (!user) {
            logger.warn(`User not found with ID: ${id}`);
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        logger.info(`User fetched successfully with ID: ${id}`);
        return res.status(200).json({
            success: true,
            message: "User fetched successfully",
            user: user,
        });
    } catch (error) {
        next(error);
        logger.error(`Error fetching user with ID ${id}: ${error.message}`, { stack: error.stack });
    }

}



export const getAllUsersController = async (req, res, next) => {
    logger.info(`Fetching all users excluding user ID: ${req.user.id}`);

    try {
        const users = await User.findAll({
            where: {
                id: {
                    [Op.ne]: req.user.id
                }
            }
        });

        logger.info(`All users fetched successfully. Count: ${users.length}`);
        return res.status(200).json({
            success: true,
            message: "All users fetched successfully",
            users: users,
        });
    } catch (error) {
        logger.error(`Error fetching all users: ${error.message}`, { stack: error.stack });
        next(error);
    }
}


export const updateUserController = async (req, res, next) => {
    const { id } = req.user;
    const { userId } = req.body;

    try {
        const user = await User.findByPk(id);
        const toSaveUser = await User.findByPk(userId)
        if (!user) {
            logger.warn(`User not found with ID: ${id}`);
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        let hasMessaged = [];
        try {
            user.hasMessaged = JSON.parse(user.hasMessaged || "[]");
            hasMessaged = user.hasMessaged;
            if (hasMessaged.includes(toSaveUser.email)) {
                logger.info(`User with ID ${id} already has ${toSaveUser.email} in hasMessaged list.`);
                return res.status(200).json({
                    success: true,
                    message: "User updated successfully",
                    user: user,
                });
            }
            hasMessaged.push(toSaveUser.email);
            user.hasMessaged = JSON.stringify(hasMessaged);
            await user.save();
            logger.info(`User with ID ${id} updated successfully with new email: ${toSaveUser.email}`);

        } catch (error) {
            next(error);
            logger.error(`Error updating user with ID ${id}: ${error.message}`, { stack: error.stack });
        }

        return res.status(200).json({
            success: true,
            message: "User updated successfully",
            user: user,
        });
    } catch (error) {
        next(error);
        logger.error(`Error updating user with ID ${id}: ${error.message}`, { stack: error.stack });
    }
}