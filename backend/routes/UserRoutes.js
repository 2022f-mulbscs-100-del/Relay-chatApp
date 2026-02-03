import express from "express";
import { getUserController } from "../controllers/UserController.js";
import { VerifyToken } from "../middleware/VerifyToken.js";

const routes = express.Router();

routes.get("/getUsers", VerifyToken, getUserController);

export default routes;
