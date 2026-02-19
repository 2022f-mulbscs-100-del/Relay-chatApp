import express from 'express';
import { RefresController } from '../controllers/RefresController.js';

const routes = express.Router();

//-------------Refresh Token----------------
routes.get('/refresh', RefresController);

export default routes;