import { logger } from "../Logger/Logger.js";
import { AuthService } from "../services/Auth/index.js";
import HTTP_STATUS from "../services/Constants.js";

export const loginController = async (req, res, next) => {

    const { email, password } = req.body;
    logger.info(`Login attempt for email: ${email}`);

    try {

        const { user, AccessToken, RefreshToken } = await AuthService.login(email, password);
        res.cookie("RefreshToken", RefreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: "/",
        });

        logger.info(`Login successful for user: ${user.username} (${user.id})`);
        return res.status(HTTP_STATUS.OK).json({
            user,
            accessToken: AccessToken
        });

    } catch (error) {
        logger.error(`Login error: ${error.message}`, { stack: error.stack });
        next(error);
    }

}

export const signUpController = async (req, res, next) => {
    const { username, email, password } = req.body;
    logger.info(`Signup attempt for email: ${email}, username: ${username}`);

    try {
        const { user: newUser, AccessToken, RefreshToken } = await AuthService.signUp(username, email, password);

        res.cookie("RefreshToken", RefreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: "/",
        });

        logger.info(`Signup successful for user: ${newUser.username} (${newUser.id})`);

        return res.status(HTTP_STATUS.CREATED).json({
            user: newUser,
            accessToken: AccessToken
        });

    } catch (error) {
        logger.error(`Signup error: ${error.message}`, { stack: error.stack });
        next(error);
    }
}

export default function logoutController(req, res, next) {

    try {
        res.clearCookie("RefreshToken", {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: "/",
        });

        return res.status(HTTP_STATUS.OK).json({ message: "Logged out successfully" });

    } catch (error) {
        next(error);
    }

}