import express from 'express';
import { RefresController } from '../controllers/RefresController.js';

const routes = express.Router();


routes.get('/refresh', RefresController);

export default routes;