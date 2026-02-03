import { Sequelize } from "sequelize";
import { logger } from "../Logger/Logger.js";



const sequelize = new Sequelize('chatapp', 'root', 'NewRoot@123', {
    host: 'localhost',
    dialect: 'mysql',
});



async function authenticateDB() {
    try {
        await sequelize.authenticate();
        logger.info("Connected to MySQL using Sequelize");

        await sequelize.sync({});
        logger.info("Models synced successfully");

    } catch (err) {
        logger.error("DB connection failed:", { error: err.message, stack: err.stack });
    }
};

authenticateDB();


export { sequelize, authenticateDB };
