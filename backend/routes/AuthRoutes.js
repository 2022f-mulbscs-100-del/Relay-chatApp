import express from 'express';
import {logoutController, loginController, signUpController,checkTwoFactorController } from '../controllers/AuthController.js';

const routes  = express.Router();

//-------------Login Routes----------------
routes.post("/login",loginController);

//-------------Signup Routes----------------
routes.post("/signup",signUpController);

//-------------Logout Routes----------------
routes.post("/logout",logoutController);

//-------------Check Two Factor Authentication----------------
routes.post("/check-twoFactor",checkTwoFactorController);


export default routes;