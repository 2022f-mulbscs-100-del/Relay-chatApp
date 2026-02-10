import express from 'express';
import logoutController, { loginController, signUpController } from '../controllers/AuthController.js';

const routes  = express.Router();


routes.post("/login",loginController);
routes.post("/signup",signUpController);
routes.post("/logout",logoutController);


export default routes;