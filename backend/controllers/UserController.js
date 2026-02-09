import User from "../modals/User.modal.js";
import { logger } from "../Logger/Logger.js";
import { Op } from "sequelize";
import { Message } from "../modals/Message.modal.js";
import Auth from "../modals/Auth.modal.js";
import Bcrypt from "bcryptjs";

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


export const addAssociatedUserController = async (req, res, next) => {
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


export const UserProfileSetupController = async (req, res, next) => {
    const { id } = req.user;
    const { username, phone, location, about, title, tags } = req.body;

    try {
        const user = await User.findByPk(id);

        if (!user) {
            logger.warn(`User not found with ID: ${id}`);
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        user.username = username || user.username;
        user.phone = phone || user.phone;
        user.location = location || user.location;
        user.about = about || user.about;
        user.title = title || user.title;
        user.tags = tags || user.tags;

        await user.save();

        logger.info(`User profile setup completed successfully for ID: ${id}`);
        return res.status(200).json({
            success: true,
            message: "User profile setup completed successfully",
            user: user,
        });
    } catch (error) {
        next(error);
        logger.error(`Error setting up user profile for ID ${id}: ${error.message}`, { stack: error.stack });
    }
}

export const getUserProfileController = async (req, res, next) => {
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

        logger.info(`User profile fetched successfully with ID: ${id}`);
        return res.status(200).json({
            success: true,
            message: "User profile fetched successfully",
            user
        });
    } catch (error) {
        next(error);
        logger.error(`Error fetching user profile with ID ${id}: ${error.message}`, { stack: error.stack });
    }

}


export const UpdateUserProfileSetupController = async (req, res, next) => {
    const { id } = req.user;
    const { username, phone, location, about, title, tags } = req.body;

    try {
        const user = await User.findByPk(id);

        if (!user) {
            logger.warn(`User not found with ID: ${id}`);
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        user.username = username || user.username;
        user.phone = phone || user.phone;
        user.location = location || user.location;
        user.about = about || user.about;
        user.title = title || user.title;
        user.tags = tags || user.tags;

        await user.save();

        logger.info(`User profile updated successfully for ID: ${id}`);
        return res.status(200).json({
            success: true,
            message: "User profile updated successfully",
            user
        });
    } catch (error) {
        next(error);
        logger.error(`Error updating user profile for ID ${id}: ${error.message}`, { stack: error.stack });
    }
}



export const UpdateUserPasswordController = async (req, res, next) => {
    const { id } = req.user;
    const { newPassword } = req.body;

    try {
        const user = await User.findByPk(id, {
            include: [{ model: Auth, as: "auth" }]
        });

        if (!user) {
            logger.warn(`User not found with ID: ${id}`);
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        const CheckPassword = Bcrypt.compareSync(newPassword, user.auth.password);
        // if (CheckPassword) {
        //     logger.warn(`New password cannot be the same as the old password for user ID: ${id}`);
        //     return res.status(400).json({
        //         success: false,
        //         message: "New password cannot be the same as the old password",
        //     });
        // }

        if (!CheckPassword) {
            logger.warn(`Wrong password provided for user ID: ${id}`);
            return res.status(400).json({
                success: false,
                message: "Wrong password provided",
            });
        }
        const HashedPassword =await Bcrypt.hashSync(newPassword, 10);
        user.auth.password = HashedPassword;
        await user.save();

        logger.info(`User password updated successfully for ID: ${id}`);
        return res.status(200).json({
            success: true,
            message: "User password updated successfully",
        });
    } catch (error) {
        next(error);
        logger.error(`Error updating user password for ID ${id}: ${error.message}`, { stack: error.stack });
    }
}