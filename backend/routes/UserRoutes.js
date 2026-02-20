import express from "express";
import { getSingleUserController,verifyTOTPController,updateUserMessageAlertController,updateAssociatedUserController,passKeyVerificationController,passKeyRegistrationController, getAssociatedUserController,generateTOTPController,UpdateUserProfileController ,getAllUsersController,UpdateUserPasswordController, addAssociatedUserController,UserProfileSetupController,getUserProfileController,UpdateUserProfileSetupController} from "../controllers/UserController.js";
import { VerifyToken } from "../middleware/VerifyToken.js";

const routes = express.Router();

//-------------User Data Routes----------------
routes.get("/getAllUsers", VerifyToken, getAllUsersController);
routes.get("/getUser", VerifyToken, getSingleUserController);
routes.get("/getUserProfile", VerifyToken, getUserProfileController);


//-------------Associated Users Routes----------------
routes.get("/getAssociatedUsers", VerifyToken, getAssociatedUserController);
routes.post("/addAssociatedUser", VerifyToken, addAssociatedUserController); 


routes.get('/muteChat/:associateUserId', VerifyToken, updateAssociatedUserController);


//-------------User Profile Setup Route----------------
routes.post("/UserProfileSetup", VerifyToken, UserProfileSetupController);
routes.post("/UpdateUserProfileSetup", VerifyToken, UpdateUserProfileSetupController);
routes.post("/updateUserProfile", VerifyToken, UpdateUserProfileController);

//-------------User message alert toggle Route----------------
routes.get("/updateUserMessageAlert", VerifyToken, updateUserMessageAlertController);

//-------------Password Update Route----------------
routes.post("/updateUserPassword", VerifyToken, UpdateUserPasswordController);


// -------------TOTP ROUTES----------------
routes.get("/generateTOTP", VerifyToken, generateTOTPController);
routes.post("/verifyTOTP", VerifyToken, verifyTOTPController);


// -------------Passkey Routes----------------
routes.get("/passKey-registration",VerifyToken,passKeyRegistrationController)
routes.post("/passkey-verification",VerifyToken,passKeyVerificationController)


export default routes;
