import express from "express";
import { getSingleUserController, getAssociatedUserController ,getAllUsersController, updateUserController} from "../controllers/UserController.js";
import { VerifyToken } from "../middleware/VerifyToken.js";

const routes = express.Router();

routes.get("/getAssociatedUsers", VerifyToken, getAssociatedUserController);
routes.get("/getAllUsers", VerifyToken, getAllUsersController);
routes.get("/getUser", VerifyToken, getSingleUserController);
routes.post("/UpdateUser", VerifyToken, updateUserController); 
export default routes;
