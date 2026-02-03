import Auth from "../modals/Auth.modal.js";
import User from "../modals/User.modal.js";
import { ErrorHandler } from "../utlis/ErrorHandler.js";
import { GenerateAccessToken } from "../utlis/GenerateAccessToken.js";
import { GenerateRefreshToken } from "../utlis/GenerateRefreshToken.js";
import bcrypt from "bcryptjs";
import { logger } from "../Logger/Logger.js";
export const loginController = async (req, res, next) => {

    const { email, password } = req.body;
    logger.info(`Login attempt for email: ${email}`);

    try {

        const user = await User.findOne({
            where: { email: email.toLowerCase() },
            include: [{ model: Auth, as: "auth" }],
        });
  
        if (!user) {
            logger.warn(`Login failed: User not found for email: ${email}`);
            return next( ErrorHandler(404, "User not found"));
        }
        const auth = user.auth;
     
        if (!auth) {
            return next( ErrorHandler(404, "Authentication details not found"));
        }
        const CheckPassword = await bcrypt.compare(password, auth.password);

        if (!CheckPassword) {
            logger.warn(`Login failed: Invalid credentials for email: ${email}`);
            return next( ErrorHandler(400, "Invalid Credentials"));
        }

        const AccessToken = GenerateAccessToken(user.id);
        const RefreshToken = GenerateRefreshToken(user.id);


        res.cookie("RefreshToken", RefreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: "/",
        });

        logger.info(`Login successful for user: ${user.username} (${user.id})`);
        return res.status(200).json({
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
        const existingUser = await User.findAll({ where: {email} });
        if (existingUser.length > 0) {
            logger.warn(`Signup failed: User already exists for email: ${email}`);
            return next(ErrorHandler(400, "User already exists"));
        }

        const newUser = await User.create({ username, email: email.toLowerCase() });
        const hashedPassword = await bcrypt.hash(password, 10);

         await Auth.create({
            userId: newUser.id,
            password: hashedPassword,
        });


        const AccessToken = await GenerateAccessToken(newUser.id);
        const RefreshToken = await GenerateRefreshToken(newUser.id);

        res.cookie("RefreshToken", RefreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: "/",
        });

        logger.info(`Signup successful for user: ${newUser.username} (${newUser.id})`);
        return res.status(201).json({
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

        return res.status(200).json({ message: "Logged out successfully" });

    } catch (error) {
        next(error);
    }

}