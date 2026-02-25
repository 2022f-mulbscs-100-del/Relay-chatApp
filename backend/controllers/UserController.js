import { logger } from "../Logger/Logger.js";
import { UserService } from "../services/User/index.js";
import AuthService from "../services/Auth/AuthService.js";
import PrivateMemberModal from "../modals/PrivateMember.modal.js";
import User from "../modals/User.modal.js";
import Auth from "../modals/Auth.modal.js";
import { Message } from "../modals/Message.modal.js";
import { Op } from "sequelize";

export const getAssociatedUserController = async (req, res, next) => {

    logger.info(`Fetching users for user ID: ${req.user.id}`);

    try {
        // const hasMessaged = await UserService.getAssociatedUser(req.user.id);
        const associatedUser = await PrivateMemberModal.findAll({
            where: {
                userId: req.user.id,
            },
            include: [
                {
                    model: User,
                    as: "associatedUser",
                    exclude: [Auth],
                    include: [
                        {
                            model: Message,
                            as: "sentMessages",
                            where: {
                                receiverId: req.user.id,
                                deletedForReceiver: false,
                                deletedForEveryone: false
                            },
                            required: false
                        },
                        {
                            model: Message,
                            as: "receivedMessages",
                            where: {
                                senderId: req.user.id,
                                deletedForSender: false,
                                deletedForEveryone: false
                            },
                            required: false
                        }
                    ]

                },
            ],
        });

        // If condition becomes false (no matching message),
        // Sequelize will NOT return that user at all.

        logger.info(`Fetched ${associatedUser.length} associated users for user ID: ${req.user.id}`);
        return res.status(200).json({
            success: true,
            message: "Users fetched successfully",
            // AcssociatedUsers: hasMessaged,
            associatedUser: associatedUser,
        });
    } catch (error) {
        next(error)
    }
}

export const getSingleUserController = async (req, res, next) => {
    const { id } = req.user;

    try {
        const { user } = await UserService.getUserById(id);
        return res.status(200).json({
            success: true,
            message: "User fetched successfully",
            user: user,
        });
    } catch (error) {
        next(error)
    }

}


export const getAllUsersController = async (req, res, next) => {
    logger.info(`Fetching all users excluding user ID: ${req.user.id}`);

    try {
        const { users } = await UserService.getAllUsers(req.user.id);

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
        logger.info(`Adding associated user with ID: ${userId} for user ID: ${id}`);

        const user = await User.findByPk(id);

        const [association, created] = await PrivateMemberModal.findOrCreate({
            // Check if association already exists
            where: {
                userId: id,
                associateUserId: userId,
            },
            //used to create association if it doesn't exist
            defaults: {
                userId: id,
                associateUserId: userId,
                isMuted: false,
                isPinned: false,
                category: null,
            }
        });

        if (created) {
            logger.info(`New association created for user ID: ${id} and associate user ID: ${userId}`);
        } else {
            logger.info(`Association already exists for user ID: ${id} and associate user ID: ${userId}`);
        }

        return res.status(200).json({
            success: true,
            message: created ? "User associated successfully" : "User already associated",
            user: user,
        });
    } catch (error) {
        logger.error(`Error adding associated user for user ID ${id}: ${error.message}`, { stack: error.stack });
        next(error);
    }
}

export const updateUserMessageAlertController = async (req, res, next) => {
    const { id } = req.user;
    try {
        const user = await User.findByPk(id);
        user.messageAlerts = !user.messageAlerts;
        await user.save();
        return res.status(200).json({
            success: true,
            message: "User message alerts updated successfully",
            user: user,
        });
    } catch (error) {
        next(error);
    }

}

export const updateAssociatedUserController = async (req, res, next) => {
    try {
        const { id } = req.user;
        const { associateUserId } = req.params;

        const associatedUser = await PrivateMemberModal.findOne(
            {
                where: {
                    userId: id,
                    associateUserId: associateUserId,
                },
            }
        );

        associatedUser.isMuted = !associatedUser.isMuted;
        await associatedUser.save();
        return res.status(200).json({
            success: true,
            message: "User muted status updated successfully",
        });
    } catch (error) {
        next(error);
    }
}

export const UserProfileSetupController = async (req, res, next) => {
    const { id } = req.user;
    const { username, phone, location, about, title, tags,imageUrl } = req.body;

    try {
        const { user } = await UserService.UpdateUserProfile(id, { username, phone, location, about, title, tags,imageUrl });
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
        const { user } = await UserService.getUserById(id);

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

        const { user } = await UserService.UpdateUserProfile(id, { username, phone, location, about, title, tags });

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

        const success = await AuthService.updatePassword(id, newPassword);

        if (success) {
            return res.status(200).json({
                success: true,
                message: "User password updated successfully",
            });
        }

    } catch (error) {
        logger.error(`Error updating user password for ID ${id}: ${error.message}`, { stack: error.stack });
        next(error);
    }
}

export const UpdateUserProfileController = async (req, res, next) => {

    const { id } = req.user;
    const { totpEnabled, emailtwoFactor } = req.body;
    try {
        const { user } = await UserService.UpdateUserProfile(id, {
            emailtwoFactor,
            totpEnabled,
        });
        return res.status(200).json({
            success: true,
            message: "User profile updated successfully, Two factor authentication Updated",
            user
        });
    } catch (error) {
        next(error);
    }
}

export const generateTOTPController = async (req, res, next) => {
    const { id } = req.user;

    try {
        const { qrCodeDataURL } = await UserService.GnerateTOTP(id);
        return res.status(200).json({
            success: true,
            message: "TOTP generated successfully",
            qrCodeDataURL
        });
    } catch (error) {
        next(error);
    }

}

export const verifyTOTPController = async (req, res, next) => {
    const { id } = req.user;
    const { token } = req.body;

    try {
        const result = await UserService.VerifyTOTP(id, token);
        return res.status(200).json({
            ...result
        });
    } catch (error) {
        next(error);
    }

}


export const passKeyRegistrationController = async (req, res, next) => {
    const { id } = req.user;
    try {
        const result = await UserService.registerPassKey(id);
        return res.status(200).json({
            success: true,
            message: "Passkey registration successful",
            credential: { ...result },
        });
    } catch (error) {
        next(error);
    }
}


export const passKeyVerificationController = async (req, res, next) => {
    const { id } = req.user;
    const { attestationResponse } = req.body;
    try {
        const result = await UserService.passKeyVerification(id, attestationResponse);
        return res.status(200).json({
            success: true,
            message: "Passkey verified successfully",
            ...result
        });
    } catch (error) {
        next(error);
    }
}

export const catrgorizeChatController = async (req, res, next) => {
    const { id } = req.user;
    const { associateUserId, category } = req.body;
    try {
        const associatedUser = await PrivateMemberModal.findOne(
            {
                where: {
                    userId: id,
                    associateUserId: associateUserId,
                }
            }
        )

        if (!associatedUser) {
            return res.status(404).json({
                success: false,
                message: "Associated user chat not found",
            });
        }

        associatedUser.category = category;
        await associatedUser.save();

        return res.status(200).json({
            success: true,
            message: "Chat categorized successfully",
        });

    } catch (error) {
        next(error);
    }
}

export const deleteChatController = async (req, res, next) => {
    const { id } = req.user;
    const { associateUserId } = req.params;
    try {
        logger.info(`Delete chat requested by user ID: ${id} for associated user ID: ${associateUserId}`);

        const user = await User.findByPk(id);
        
        let associatedUserArray = [];
        if (user.hasMessaged) {
            try {
                associatedUserArray = Array.isArray(user.hasMessaged) ? user.hasMessaged : JSON.parse(user.hasMessaged);
            } catch (e) {
                associatedUserArray = [];
            }
        }
        
        const updatedAssociatedUserArray = associatedUserArray.filter((userId) => userId !== associateUserId);
        user.hasMessaged = updatedAssociatedUserArray;
        await user.save();

        if (!user) {
            logger.warn(`Delete chat failed: user not found for ID: ${id}`);
            return res.status(404).json({
                success: false,
                message: "User not found in messaged users",
            });
        }

        const associatedUser = await PrivateMemberModal.findOne(
            {
                where: {
                    userId: id,
                    associateUserId: associateUserId,
                }
            }
        )

        if (!associatedUser) {
            logger.warn(`Delete chat failed: association not found for user ID: ${id} and associate user ID: ${associateUserId}`);
            return res.status(404).json({
                success: false,
                message: "Associated user chat not found",
            });
        }

        const Sendingmessages = await Message.findAll({
            where: {
                senderId: id,
                receiverId: associateUserId,
            },
        });

        for (const message of Sendingmessages) {
            message.deletedForSender = true;
            await message.save();
        }

        logger.info(`Deleted ${Sendingmessages.length} messages for chat between user ID: ${id} and associate user ID: ${associateUserId}`);

        const Receivingmessages = await Message.findAll({
            where: {
                senderId: associateUserId,
                receiverId: id,
            },
        });

        for (const message of Receivingmessages) {
            message.deletedForReceiver = true;
            await message.save();
        }

        logger.info(`Deleted ${Receivingmessages.length} messages for chat between user ID: ${id} and associate user ID: ${associateUserId}`);

        await associatedUser.destroy();

        logger.info(`Chat deleted successfully for user ID: ${id} and associate user ID: ${associateUserId}`);

        return res.status(200).json({
            success: true,
            message: "Chat deleted successfully",
        });
    } catch (error) {
        logger.error(`Error deleting chat for user ID ${id} and associate user ID ${associateUserId}: ${error.message}`, { stack: error.stack });
        next(error);
    }
}