import { logger } from "../Logger/Logger.js";
import { UserService } from "../services/User/index.js";
import AuthService from "../services/Auth/AuthService.js";

export const getAssociatedUserController = async (req, res, next) => {

    logger.info(`Fetching users for user ID: ${req.user.id}`);

    try {
        const hasMessaged = await UserService.getAssociatedUser(req.user.id);
        return res.status(200).json({
            success: true,
            message: "Users fetched successfully",
            AcssociatedUsers: hasMessaged,
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
        const { user } = await UserService.addAssociatedUser(id, userId);
        return res.status(200).json({
            success: true,
            message: "User updated successfully",
            user: user,
        });
    } catch (error) {
        next(error);
    }
}

export const UserProfileSetupController = async (req, res, next) => {
    const { id } = req.user;
    const { username, phone, location, about, title, tags } = req.body;

    try {
        const { user } = await UserService.UpdateUserProfile(id, { username, phone, location, about, title, tags });
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
            credential: {...result},
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