import express from "express";
import {  getUserGroupsController,getGroupMessagesController,markGroupMessageAsReadController } from "../controllers/GroupController.js";
import { VerifyToken } from "../middleware/VerifyToken.js";

const routes = express.Router();

routes.get("/getUserGroups", VerifyToken, getUserGroupsController);
routes.get("/getGroupMessages/:groupId", VerifyToken, getGroupMessagesController);
routes.post("/markGroupMessageAsRead", VerifyToken, markGroupMessageAsReadController);
// routes.post("/addGroupMessage", VerifyToken, addGroupMessageController);

export default routes;