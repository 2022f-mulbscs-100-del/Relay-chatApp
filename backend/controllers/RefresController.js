import { ErrorHandler } from "../utlis/ErrorHandler.js";
import jwt from "jsonwebtoken";
import { GenerateAccessToken } from "../utlis/GenerateAccessToken.js";
import User from "../modals/User.modal.js";
import Auth from "../modals/Auth.modal.js";
import { logger } from "../Logger/Logger.js";

export const RefresController = async (req, res, next) => {
    logger.info('Refresh token request received');

    const refreshToken = req.cookies?.RefreshToken;
    if (!refreshToken) {
        logger.warn('Refresh token missing');
        return next(ErrorHandler(401, "Unauthorized: No refresh token provided"));
    }
    try {
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
            if (err) {
                logger.warn(`Invalid refresh token: ${err.message}`);
                return next(ErrorHandler(403, "Forbidden: Invalid refresh token"));
            }
            
            if (!decoded || !decoded.id) {
                logger.warn('Token decoded but missing id');
                return next(ErrorHandler(403, "Forbidden: Invalid token payload"));
            }
            
            const user = await User.findOne({ 
                where: { id: decoded.id },
                include: [{ model: Auth, as: "auth" }]
            });
            
            if (!user) {
                logger.warn(`User not found for refresh token: ${decoded.id}`);
                return next(ErrorHandler(404, "User not found"));
            }
            
            const accessToken = GenerateAccessToken(decoded.id);
            logger.info(`Access token refreshed for user ID: ${decoded.id}`);
            return res.status(200).json({
                user,
                accessToken
            });
        });

    } catch (error) {
        logger.error(`Refresh token error: ${error.message}`);
        next(error);
    }
}   