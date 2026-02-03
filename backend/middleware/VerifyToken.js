import jwt from 'jsonwebtoken';
import { logger } from '../Logger/Logger.js';
export const VerifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        logger.warn('Access token missing in request');
        return res.status(401).json({ message: 'Access Token Required' });
    }

    try {
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) {
                logger.warn(`Invalid access token: ${err.message}`);
                return res.status(403).json({ message: 'Invalid Access Token' });
            }
            req.user = user;
            logger.info(`Token verified for user ID: ${user.id}`);
            next();
        });
    } catch (error) {
        logger.error(`Token verification error: ${error.message}`);
        next(error);
    }

}