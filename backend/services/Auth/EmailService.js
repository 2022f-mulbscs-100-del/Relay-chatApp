import { logger } from "../../Logger/Logger";

class EmailService {
    static async sendTwoFactorCode(email, code) {
        logger.info(`Preparing to send two-factor code to ${email}`);

        try {

            logger.info(`Sending two-factor code to ${email}: ${code}`);

        } catch (error) {
            logger.error(`Error sending two-factor code to ${email}: ${error.message}`, { stack: error.stack });
            throw error;
        }
    }



}

export default EmailService;