import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { claudinaryConfig as claudinary } from "../config/cloudinary.js";
import { logger } from "../Logger/Logger.js";

const storage = new CloudinaryStorage({
    cloudinary: claudinary,
    params: {
        folder: "chat-app",
        // allowed_formats: ["jpg", "jpeg", "png"],
        // transformation: [{ width: 500, height: 500, crop: "limit" }],
    },
});

export const upload = multer({ storage });

// Middleware wrapper to handle multer errors
//actual middleware to be used in routes
export const uploadHandler = (req, res, next) => { // multer's single file upload middleware
    upload.single("file")(req, res, (err) => {
        if (err) {
            logger.error("Multer upload error:", err.message);

            return res.status(400).json({
                error: "Upload failed",
                message: err.message
            });
        }
        next();
    });
};



// When file uploads:
// Cloudinary will:
// • store in folder → chat-app
// • detect type automatically (image/video/pdf)
// • receives file
// • uploads to cloudinary
// • stores result in req.file

// What multer does internally
// When request comes:
// Before:
// req.file = undefined
// After upload.single:
// req.file becomes:
// {
//  path: "https://cloudinary url",
//  filename: "public_id",
//  mimetype: "image/png",
//  size: 23423
// }