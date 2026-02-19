import { logger } from "../../Logger/Logger.js";
import Auth from "../../modals/Auth.modal.js";
import User from "../../modals/User.modal.js";
import bcrypt from "bcrypt";
import { ErrorHandler } from "../../utlis/ErrorHandler.js";
import { GenerateAccessToken } from "../../utlis/GenerateAccessToken.js";
import { GenerateRefreshToken } from "../../utlis/GenerateRefreshToken.js";
import UserService from "../User/UserService.js";
import speakeasy from "speakeasy";
import CheckCodeExpiry from "../../utlis/CheckCodeExpiry.js";
import crypto from "crypto";
import { verifyAuthenticationResponse } from "@simplewebauthn/server";
class AuthService {

    static async FindById(id) {
        try {
            const user = await User.findOne({
                where: { id },
                include: [{ model: Auth, as: "auth" }],
            });
            if (!user) {
                logger.warn(`User not found with email: ${id}`);
                throw ErrorHandler(404, "User not found");
            }
            logger.info(`User fetched successfully with id: ${id}`);
            return {
                user
            }
        } catch (error) {
            logger.error(`Error fetching user with email ${id}: ${error.message}`, { stack: error.stack });
            throw error;
        }
    }
    static async FindUserByEmail(email) {
        try {
            const user = await User.findOne({
                where: { email: email.toLowerCase() },
                include: [{ model: Auth, as: "auth" }],
            });
            if (!user) {
                logger.warn(`User not found with email: ${email}`);
                throw ErrorHandler(404, "User not found");
            }
            logger.info(`User fetched successfully with email: ${email}`);
            return {
                user
            }
        } catch (error) {
            logger.error(`Error fetching user with email ${email}: ${error.message}`, { stack: error.stack });
            throw error;
        }
    }

    static async VerifyCredentials(email, password) {
        try {
            const { user } = await AuthService.FindUserByEmail(email);
            const isPasswordValid = await bcrypt.compare(password, user.auth.password);
            if (!isPasswordValid) {
                logger.warn(`Invalid password for user with email: ${email}`);
                throw ErrorHandler(401, "Invalid credentials");
            }
            logger.info(`User authenticated successfully with email: ${email}`);
            return !!isPasswordValid;

        } catch (error) {
            logger.error(`Error verifying credentials for email ${email}: ${error.message}`, { stack: error.stack });
            throw error;
        }
    }

    static async generateTokens(userId) {
        try {
            const AccessToken = GenerateAccessToken(userId);
            const RefreshToken = GenerateRefreshToken(userId);
            return {
                AccessToken,
                RefreshToken
            }
        } catch (error) {
            logger.error(`Error generating tokens for user ID ${userId}: ${error.message}`, { stack: error.stack });
            throw error;
        }
    }


    static async userExists(email) {
        try {
            const user = await User.findOne({ where: { email: email.toLowerCase() } });
            return !!user;
        } catch (error) {
            logger.error(`Error checking user existence for email ${email}: ${error.message}`, { stack: error.stack });
            throw error;
        }
    }

    static async HashingPassword(password) {
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            return hashedPassword;
        } catch (error) {
            logger.error(`Error hashing password: ${error.message}`, { stack: error.stack });
            throw error;
        }
    }

    static async createUser(username, email) {
        try {
            const newUser = await User.create({ username, email: email.toLowerCase() });
            logger.info(`User created successfully with email: ${email}`);
            return newUser;
        } catch (error) {
            logger.error(`Error creating user with email ${email}: ${error.message}`, { stack: error.stack });
            throw error;
        }
    }

    static async createAuthRecord(userId, hashedPassword) {
        try {
            await Auth.create({
                userId,
                password: hashedPassword,
            });
            logger.info(`Auth record created successfully for user ID: ${userId}`);
        } catch (error) {
            logger.error(`Error creating auth record for user ID ${userId}: ${error.message}`, { stack: error.stack });
            throw error;
        }
    }

    static async checkTwoFactorEnabled(userId) {
        try {
            const { user } = await UserService.getUserById(userId);
            return user.passKeyEnabled ? "passkeyTwoFactor" : user.totpEnabled ? "totpTwoFactor" : user.emailtwoFactor ? "emailTwoFactor" : false;
        } catch (error) {
            logger.error(`Error checking two-factor enabled for user ID ${userId}: ${error.message}`, { stack: error.stack });
            throw error;
        }
    }


    static async login(email, password) {
        try {
            await AuthService.VerifyCredentials(email, password);
            const { user } = await AuthService.FindUserByEmail(email);


            const tokens = await AuthService.generateTokens(user.id);
            return {
                user,
                ...tokens
            };
        } catch (error) {
            logger.error(`Login error for email ${email}: ${error.message}`, { stack: error.stack });
            throw error;
        }

    }

    static async signUp(username, email, password) {
        try {
            const userExists = await AuthService.userExists(email);
            if (userExists) {
                logger.warn(`User already exists with email: ${email}`);
                throw ErrorHandler(400, "User already exists");
            }
            const newUser = await AuthService.createUser(username, email);
            const hashedPassword = await AuthService.HashingPassword(password);
            await AuthService.createAuthRecord(newUser.id, hashedPassword);
            const tokens = await AuthService.generateTokens(newUser.id);


            return {
                user: newUser,
                ...tokens
            }
        } catch (error) {
            logger.error(`Signup error: ${error.message}`, { stack: error.stack });
            throw error;
        }
    }

    static async updatePassword(id, newPassword) {
        try {
            const { user } = await UserService.getUserById(id);
            await AuthService.VerifyCredentials(user.email, newPassword);
            const HashedPassword = await AuthService.HashingPassword(newPassword);
            user.auth.password = HashedPassword;
            await user.save();

            logger.info(`User password updated successfully for ID: ${id}`);
            return true;
        } catch (error) {
            logger.error(`Error updating user password for ID ${id}: ${error.message}`, { stack: error.stack });
            throw error;
        }
    }

    static async twoFactorLoginSetup(email, type) {
        try {
            const { user } = await AuthService.FindUserByEmail(email);
            const auth = user.auth;
            switch (type) {
                case "passkeyTwoFactor": {
                    if (!auth.passkeyCredentialID && !auth.passkeyPublicKey) {
                        throw ErrorHandler(400, "Passkey not found for user");
                    }
                    const challenge = crypto.randomBytes(32).toString("base64url");
                    auth.passKeyChallenge = challenge;
                    await auth.save();
                    return {
                        challenge,
                        allowCredentials: [
                            {
                                type: "public-key",
                                id: auth.passkeyCredentialID,
                                transports: ["internal"] //Touch ID, Windows Hello
                            }
                        ],
                        userVerification: "preferred", // can also be "required" or "discouraged"
                    }

                }

                case "emailTwoFactor": { }
                    break;
                default:
                    throw ErrorHandler(400, "Invalid two-factor type");
            }

        } catch (error) {
            throw error;
        }
    }

    static async verifyTwoFactorToken(email, token, type, assertionResponse) {
        const { user } = await AuthService.FindUserByEmail(email);
        const auth = user.auth;
        const TypeSafetoken = Number(token)
        try {
            switch (type) {
                case "passkeyTwoFactor": {
                    if (!auth.passkeyCredentialID || !auth.passkeyPublicKey) {
                        throw ErrorHandler(400, "Passkey two-factor authentication not set up");
                    }
                    const base64UrlToBuffer = (value) => {
                        const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
                        const padded = normalized + "===".slice((normalized.length + 3) % 4);
                        return Buffer.from(padded, "base64");
                    };

                    const { verified } = await verifyAuthenticationResponse({
                        response: assertionResponse,
                        expectedChallenge: auth.passKeyChallenge,
                        expectedOrigin: process.env.FRONTEND_URL,
                        expectedRPID: "localhost", // must match registration
                        credential: {
                            id: base64UrlToBuffer(auth.passkeyCredentialID),
                            publicKey: base64UrlToBuffer(auth.passkeyPublicKey),
                            // counter: auth.passkeyCounter || 0,
                        },
                        requireUserVerification: false,
                    });
                    // auth.passkeyCounter = assertionResponse.response.signCount;
                    auth.passKeyChallenge = null;
                    await auth.save();
                    return verified;

                }
                case "totpTwoFactor": {
                    const isVerified = speakeasy.totp.verify({
                        secret: auth.totpSecret,
                        encoding: "base32",
                        token: TypeSafetoken,
                        window: 1,
                    })
                    if (!isVerified) {
                        throw ErrorHandler(400, "Invalid TOTP token");
                    }
                    return true;
                }

                case "emailTwoFactor": {
                    if (auth.emailTwoFactorToken !== token || CheckCodeExpiry(15, auth.emailTwoFactorTokenExpires)) {
                        throw ErrorHandler(400, "Invalid email two-factor token");
                    }
                    return true;
                }
                default:
                    throw ErrorHandler(400, "Invalid two-factor type");
            }
        } catch (error) {
            throw error;
        }
    }

}

export default AuthService;



// this.constructor.userExists(email)
// AuthService.userExists("test@example.com"); 
//both are same thing the first one is using the instance of the class to call the static method
//  and the second one is calling the static method directly from the class. 
// In both cases, it will work because static methods can be called on the class itself without needing an instance.
//-------------->
//the main advantage to use the first one is that when we change the name of the service we don't have to change 
// the name of the class everywhere in the code we can just use this.constructor to call the static method and 
// it will work fine even if we change the name of the class in future.