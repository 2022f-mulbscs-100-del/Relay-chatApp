import { logger } from "../Logger/Logger.js";

export const ImageUploadController = async (req, res) => {
    try {
        logger.info("Image upload request received");
        if (!req.file || !req.file.path) {
            logger.warn("No file uploaded or file path missing");
            return res.status(400).json({ error: "No file uploaded or file path missing" });
        }
        const imageUrl = req.file.path;
        logger.info("Image uploaded successfully:", { imageUrl });
        res.status(200).json({ imageUrl });
    } catch (error) {
        logger.error("Image upload failed:", error.message);
        res.status(500).json({ error: "Image upload failed" });
    }
};