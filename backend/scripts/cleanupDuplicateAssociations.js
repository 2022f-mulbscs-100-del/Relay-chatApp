import { sequelize } from "../config/dbConfig.js";
import PrivateMemberModal from "../modals/PrivateMember.modal.js";
import { logger } from "../Logger/Logger.js";

/**
 * Cleanup script to remove duplicate private member associations
 * Keeps the oldest entry for each unique (userId, associateUserId) pair
 */
async function cleanupDuplicates() {
    try {
        await sequelize.authenticate();
        logger.info("Database connection established");

        // Find all duplicate entries
        const [results] = await sequelize.query(`
            SELECT userId, associateUserId, COUNT(*) as count
            FROM private_members
            GROUP BY userId, associateUserId
            HAVING COUNT(*) > 1
        `);

        logger.info(`Found ${results.length} duplicate association pairs`);

        let totalDeleted = 0;

        for (const duplicate of results) {
            const { userId, associateUserId, count } = duplicate;
            logger.info(`Processing duplicates for userId: ${userId}, associateUserId: ${associateUserId} (${count} entries)`);

            // Get all entries for this pair, ordered by creation date
            const entries = await PrivateMemberModal.findAll({
                where: {
                    userId,
                    associateUserId
                },
                order: [['createdAt', 'ASC']]
            });

            // Keep the first (oldest) entry, delete the rest
            for (let i = 1; i < entries.length; i++) {
                await entries[i].destroy();
                totalDeleted++;
                logger.info(`Deleted duplicate entry with ID: ${entries[i].id}`);
            }
        }

        logger.info(`Cleanup completed. Total duplicates removed: ${totalDeleted}`);
        process.exit(0);
    } catch (error) {
        logger.error(`Error during cleanup: ${error.message}`, { stack: error.stack });
        process.exit(1);
    }
}

cleanupDuplicates();
