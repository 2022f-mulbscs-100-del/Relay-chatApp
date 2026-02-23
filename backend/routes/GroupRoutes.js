import express from "express";
import {  getUserGroupsController,muteGroupController,getGroupMessagesController,markGroupPinnedController,markGroupMessageAsReadController, addGroupCategoryController,deleteGroupController } from "../controllers/GroupController.js";
import { VerifyToken } from "../middleware/VerifyToken.js";

const routes = express.Router();


//-------------get User Groups----------------
routes.get("/getUserGroups", VerifyToken, getUserGroupsController);


//-------------get Group Messages----------------
routes.get("/getGroupMessages/:groupId", VerifyToken, getGroupMessagesController);


//-------------mark Group Message As Read----------------
routes.post("/markGroupMessageAsRead", VerifyToken, markGroupMessageAsReadController);

//-------------mark Group Pinned----------------
routes.post("/markGroupPinned", VerifyToken, markGroupPinnedController);

//-------------add Group Category----------------
routes.post("/addCategoryToGroup", VerifyToken, addGroupCategoryController);

//-------------mute Group ----------------
routes.post("/muteGroup", VerifyToken, muteGroupController);

routes.delete("/deleteGroup/:groupId", VerifyToken,deleteGroupController);

// routes.post("/addGroupMessage", VerifyToken, addGroupMessageController);

export default routes;