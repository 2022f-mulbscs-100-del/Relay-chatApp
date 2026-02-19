import express from "express";
import {  getUserGroupsController,getGroupMessagesController,markGroupMessageAsReadController } from "../controllers/GroupController.js";
import { VerifyToken } from "../middleware/VerifyToken.js";

const routes = express.Router();


//-------------get User Groups----------------
routes.get("/getUserGroups", VerifyToken, getUserGroupsController);


//-------------get Group Messages----------------
routes.get("/getGroupMessages/:groupId", VerifyToken, getGroupMessagesController);


//-------------mark Group Message As Read----------------
routes.post("/markGroupMessageAsRead", VerifyToken, markGroupMessageAsReadController);


// routes.post("/addGroupMessage", VerifyToken, addGroupMessageController);

export default routes;