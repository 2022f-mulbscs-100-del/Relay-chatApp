import express from "express";
import { getMessagesController,UpdateMessagesController,updateMessageController,unReadChatListController } from "../controllers/MessageController.js";
import { VerifyToken } from "../middleware/VerifyToken.js";



const routes = express.Router();

routes.get("/getMessages/:chatId", VerifyToken, getMessagesController);
routes.post("/UpdateMessages/:chatId", VerifyToken,UpdateMessagesController);
routes.post("/updateMessage", VerifyToken,updateMessageController);
routes.get("/unreadChatList", VerifyToken, unReadChatListController);
export default routes;