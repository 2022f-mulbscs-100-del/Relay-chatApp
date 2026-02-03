import User from "../modals/User.modal.js";
import { logger } from "../Logger/Logger.js";
import { Op } from "sequelize";

export const getUserController = async (req, res, next) => {
    logger.info(`Fetching users for user ID: ${req.user.id}`);
    
    try {
        const users = await User.findAll({
            where: {
                id: {
                    [Op.ne]: req.user.id 
                }
            }
        });

        logger.info(`Users fetched successfully. Count: ${users.length}`);
        return res.status(200).json({
            success: true,
            message: "Users fetched successfully",
            users: users,
        });
    } catch (error) {
        logger.error(`Error fetching users: ${error.message}`, { stack: error.stack });
        next(error);
    }
} 