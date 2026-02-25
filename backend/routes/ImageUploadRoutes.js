import express from "express";
import { ImageUploadController } from "../controllers/ImageController.js";
import { uploadHandler } from "../middleware/upload.js";

const routes = express.Router();

routes.post("/upload", uploadHandler, ImageUploadController);

export default routes;