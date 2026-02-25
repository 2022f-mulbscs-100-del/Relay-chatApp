import { logger } from "../../Logger/Logger.js";
import User from "../../modals/User.modal.js";
import Auth from "../../modals/Auth.modal.js";
import { Message } from "../../modals/Message.modal.js";
import { ErrorHandler } from "../../utlis/ErrorHandler.js";
import { Op } from "sequelize";
import speakeasy from "speakeasy";
import QRCode from "qrcode";
import { sequelize } from "../../config/dbConfig.js";
import crypto from "crypto";
import { verifyRegistrationResponse } from "@simplewebauthn/server";
class UserService {
    //get user by id
    static async getUserById(id) {
        try {
            if (!id) {
                logger.warn('getUserById called with undefined id');
                throw ErrorHandler(400, "User ID is required");
            }
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
    //get associated users who have messaged with the user
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
    //get all users
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
    //add associated user to the user who has messaged with
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
                    throw ErrorHandler(200, "User already associated");
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
    //using nullish instead of or to allow false values to be saved 
    //update user profile
    static async UpdateUserProfile(id, data) {

     
        const { user } = await UserService.getUserById(id);
        user.username = data.username ?? user.username;
        user.phone = data.phone ?? user.phone;
        user.location = data.location ?? user.location;
        user.about = data.about ?? user.about;
        user.title = data.title ?? user.title;
        user.tags = data.tags ?? user.tags;
        user.emailtwoFactor = data.emailtwoFactor ?? user.emailtwoFactor;
        user.totpEnabled = data.totpEnabled ?? user.totpEnabled;
        user.imageUrl = data.imageUrl ?? user.imageUrl;

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
    //generate TOTP secret and QR code for the user
    static async GnerateTOTP(id) {
        const { user } = await UserService.getUserById(id);
        const secret = speakeasy.generateSecret({
            name: `Relay (${user.email})`,
        });

        const qrCodeDataURL = await QRCode.toDataURL(secret.otpauth_url);

        const auth = user.auth;
        auth.totpSecret = secret.base32;
        // Base32 is a way to encode binary data into readable text using 32 characters
        await auth.save();

        logger.info(`TOTP generated successfully for user ID: ${id}`);

        return {
            qrCodeDataURL,
        }
    }


    //verify TOTP token and enable TOTP for the user
    static async VerifyTOTP(id, token) {
        const transaction = await sequelize.transaction();
        const { user } = await UserService.getUserById(id);
        const auth = user.auth;

        if (!auth.totpSecret) {
            logger.warn(`TOTP secret not found for user ID: ${id}`);
            throw ErrorHandler(400, "TOTP not set up");
        }

        const isVerified = speakeasy.totp.verify({
            secret: auth.totpSecret,
            encoding: 'base32',
            token,
            window: 1,
        })
        if (isVerified) {
            logger.info(`TOTP verified successfully for user ID: ${id}`);
            user.totpEnabled = true;
            await user.save({ transaction });
            // Don't permanently save yet. Wait for commit
            await transaction.commit();
            return {
                success: true,
                message: "TOTP verified successfully"
            }
        } else {
            await transaction.rollback();
            logger.warn(`TOTP verification failed for user ID: ${id}`);
            throw ErrorHandler(400, "Invalid TOTP token");
        }
    }


    //register passkey and generate challenge for the user
    static async registerPassKey(id) {
        const transaction = await sequelize.transaction();
        try {
            const { user } = await UserService.getUserById(id);
            const challenge = crypto.randomBytes(32).toString("base64url");
            const auth = user.auth;
            auth.passKeyChallenge = challenge;
            await auth.save({ transaction });
            await transaction.commit();

            return ({
                challenge,
                rp: { name: "Relay Chat App" },
                user: {
                    id: Buffer.from(String(user.id)).toString("base64url"),
                    name: user.username,
                    displayName: user.username
                },
                pubKeyCredParams: [{ alg: -7, type: "public-key" }],
            })
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }
    //verify passkey registration response and enable passkey for the user
    static async passKeyVerification(id, attestationResponse) {
        const transaction = await sequelize.transaction();
        try {
            const { user } = await UserService.getUserById(id);
            const auth = user.auth;

            if (!auth.passKeyChallenge) {
                logger.warn(`Passkey challenge not found for user ID: ${id}`);
                throw ErrorHandler(400, "Passkey registration not initiated");
            }


            const { verified, registrationInfo } = await verifyRegistrationResponse({
                response: attestationResponse,
                expectedChallenge: auth.passKeyChallenge,
                expectedOrigin: "http://localhost:5173",
                expectedRPID: "localhost",
                requireUserVerification: false,
            });

            if (!verified) {
                logger.warn(`Passkey registration failed for user ID: ${id}`);
                await transaction.rollback();
                throw ErrorHandler(400, "Passkey registration failed");
            }


            const base64 = Buffer.from(registrationInfo.credential.publicKey).toString("base64");

            auth.passkeyCredentialID = registrationInfo.credential.id;
            auth.passkeyPublicKey = base64;
            auth.passKeyChallenge = null;
            user.passKeyEnabled = true;
            await auth.save({ transaction });
            await user.save({ transaction });

            await transaction.commit();

        } catch (error) {
            await transaction.rollback();
            throw error
        }
    }

}

export default UserService;