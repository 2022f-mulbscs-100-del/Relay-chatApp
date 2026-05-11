    import { Sequelize } from "sequelize";
import { logger } from "../Logger/Logger.js";
import fs from "fs";
import dotenv from 'dotenv';
dotenv.config();

// Path to CA certificate (only exists locally)
const localCAPath = "/home/dev/Music/ca.pem";

logger.info(`Database Config - Host: ${process.env.DB_HOST}, Database: ${process.env.DB_NAME}, Port: ${process.env.DB_PORT}, User: ${process.env.DB_USER}`);

// Check if we're running locally or on Render
const isLocal = fs.existsSync(localCAPath);

// Configure SSL based on environment

// SSL configuration for cloud databases
const dialectOptions = isLocal
  ? {
      ssl: {
        ca: fs.readFileSync(localCAPath),
        rejectUnauthorized: true,
      },
    }
  : process.env.CA_CERT
  ? {
      ssl: {
        ca: process.env.CA_CERT,
        rejectUnauthorized: true,
      },
    }
  : {
      ssl: {
        rejectUnauthorized: false,
      },
    };

const sequelize = new Sequelize(
    process.env.DB_NAME || 'chatapp',
    process.env.DB_USER || 'root',
    process.env.DB_PASSWORD || 'root',
    {
        dialect: 'mysql',
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 3306,
        dialectOptions,
    }
);



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
