import express from "express";
import { getMessagesController,UpdateMessagesController,updateMessageController,unReadChatListController } from "../controllers/MessageController.js";
import { VerifyToken } from "../middleware/VerifyToken.js";



const routes = express.Router();

//-------------get Messages----------------
routes.get("/getMessages/:chatId", VerifyToken, getMessagesController);

//-------------update Messages----------------
routes.post("/UpdateMessages/:chatId", VerifyToken,UpdateMessagesController);

//-------------update Message----------------
routes.post("/updateMessage", VerifyToken,updateMessageController);

//-------------unRead Chat List----------------
routes.get("/unreadChatList", VerifyToken, unReadChatListController);
export default routes;