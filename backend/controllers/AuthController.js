import { logger } from "../Logger/Logger.js";
import { AuthService } from "../services/Auth/index.js";
import HTTP_STATUS from "../services/Constants.js";
import { ErrorHandler } from "../utlis/ErrorHandler.js";
import passport from "passport";

export const loginController = async (req, res, next) => {

    const { email, password } = req.body;
    logger.info(`Login attempt for email: ${email}`);

    try {

        const { user, AccessToken, RefreshToken } = await AuthService.login(email, password);

        const twoFactorEnabled = await AuthService.checkTwoFactorEnabled(user.id);

        if (twoFactorEnabled === "totpTwoFactor") {
            return res.status(HTTP_STATUS.OK).json({
                twoFactorRequired: twoFactorEnabled,
            });
        }
        if (twoFactorEnabled === "passkeyTwoFactor" || twoFactorEnabled === "emailTwoFactor") {
            logger.info(`Two-factor authentication required for user: ${user.username} (${user.id})`);

            const result = await AuthService.twoFactorLoginSetup(email, twoFactorEnabled);

            return res.status(HTTP_STATUS.OK).json({
                twoFactorRequired: twoFactorEnabled,
                ...result
            });
        }


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

export const logoutController = (req, res, next) => {

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

export const checkTwoFactorController = async (req, res, next) => {
    const { email, token, twoFaMethod, assertionResponse } = req.body;
    logger.info(`Checking two-factor authentication for user email: ${email}`);

    try {
        const isVerified = await AuthService.verifyTwoFactorToken(email, token, twoFaMethod, assertionResponse);
        if (isVerified) {
            logger.info(`Two-factor authentication successful for user email: ${email}`);
            const { user } = await AuthService.FindUserByEmail(email);
            const { AccessToken, RefreshToken } = await AuthService.generateTokens(user.id);
            res.cookie("RefreshToken", RefreshToken, {
                httpOnly: true,
                secure: false,
                sameSite: "lax",
                maxAge: 7 * 24 * 60 * 60 * 1000,
                path: "/",
            });
            return res.status(HTTP_STATUS.OK).json({
                message: "Two-factor authentication successful",
                user,
                accessToken: AccessToken
            });
        }

    } catch (error) {
        next(error);
    }
}

export const forgetPasswordController = async (req, res, next) => {
    const { email } = req.body;
    logger.info(`Password reset request for email: ${email}`);
    try {

    } catch (error) {
        next(error)
    }
}

export const forgetPasswordTokenVerificationController = async (req, res, next) => {
    const { email, token } = req.body;
    try {
        const isVerified = await AuthService.verifyForgetPasswordToken(email, token);
        if (isVerified) {
            return res.status(HTTP_STATUS.OK).json({ message: "Token verified successfully" });
        }
    } catch (error) {
        next(error)
    }
}

export const socialLoginController = async (req, res, next) => {
    const { provider } = req.params;
    console.log("Provider:", provider); // Debug log to check the provider value
    try {
        switch (provider) {
            case "google": {
                passport.authenticate("google",
                    {
                        scope: ["profile", "email"],
                        prompt: "consent",
                        accessType: "offline",
                    },
                )(req, res, next);
            }
                break;
            default: {
                return next(ErrorHandler(HTTP_STATUS.BAD_REQUEST, "Unsupported social login type"));
            }
        }

    } catch (error) {
        next(error);
    }
}


export const socialLoginCallbackController = async (req, res, next) => {
    try {
        passport.authenticate("google", async (err, user, info) => {
            if (err) {
                logger.error(`Social login error: ${err.message}`, { stack: err.stack });
                return next(ErrorHandler(HTTP_STATUS.INTERNAL_SERVER_ERROR, "Social login failed"));
            }
            if (!user) {
                logger.warn(`Social login failed: ${info.message}`);
                return next(ErrorHandler(HTTP_STATUS.UNAUTHORIZED, "Social login failed"));
            }
            const { AccessToken, RefreshToken } = await AuthService.generateTokens(user.id);
            res.cookie("RefreshToken", RefreshToken, {
                httpOnly: true,
                secure: false,
                sameSite: "lax",
                maxAge: 7 * 24 * 60 * 60 * 1000,
                path: "/",
            });
            return res.send(`<html>
                <body>
                    <script> 
                    //it will help to send data to the main window not in the pop up if we send simple response it will send data to the pop up and we can't access it in main window
                        window.opener.postMessage({ 
                            user: ${JSON.stringify(user)},
                            token: "${AccessToken}"
                        }, "*");
                        window.close();
                    </script>
                </body>
            </html>`);
        })(req, res, next);
    } catch (error) {
        next(error);
    }
}