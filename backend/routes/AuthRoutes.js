import express from 'express';
import {logoutController,socialLoginCallbackController, loginController,socialLoginController, signUpController,checkTwoFactorController,forgetPasswordController } from '../controllers/AuthController.js';

const routes  = express.Router();

//-------------Login Routes----------------
routes.post("/login",loginController);

//-------------Signup Routes----------------
routes.post("/signup",signUpController);

//-------------Logout Routes----------------
routes.post("/logout",logoutController);

//-------------Check Two Factor Authentication----------------
routes.post("/check-twoFactor",checkTwoFactorController);

//-------------Forget Password----------------
routes.post("/forget-password",forgetPasswordController);

//-------------social login----------------
routes.get("/social-login/:provider", socialLoginController);
routes.get("/google-callback", socialLoginCallbackController);

export default routes;