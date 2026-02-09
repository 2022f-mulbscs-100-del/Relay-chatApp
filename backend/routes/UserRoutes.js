import express from "express";
import { getSingleUserController, getAssociatedUserController ,getAllUsersController,UpdateUserPasswordController, updateUserController,UserProfileSetupController,getUserProfileController,UpdateUserProfileSetupController} from "../controllers/UserController.js";
import { VerifyToken } from "../middleware/VerifyToken.js";

const routes = express.Router();

routes.get("/getAssociatedUsers", VerifyToken, getAssociatedUserController);
routes.get("/getAllUsers", VerifyToken, getAllUsersController);
routes.get("/getUser", VerifyToken, getSingleUserController);
routes.post("/UpdateUser", VerifyToken, updateUserController); 
routes.post("/UserProfileSetup", VerifyToken, UserProfileSetupController);
routes.get("/getUserProfile", VerifyToken, getUserProfileController);
routes.post("/UpdateUserProfileSetup", VerifyToken, UpdateUserProfileSetupController);
routes.post("/updateUserPassword", VerifyToken, UpdateUserPasswordController);
export default routes;
