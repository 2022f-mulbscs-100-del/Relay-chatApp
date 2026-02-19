import dotenv from 'dotenv';
const result = dotenv.config();
console.log("dotenv config result:", result);
console.log("ENV GOOGLE_CLIENT_ID after config:", process.env.GOOGLE_CLIENT_ID);
import express from 'express';
import "./modals/associations.js";
import cookieParser from 'cookie-parser';
import AuthRoutes from './routes/AuthRoutes.js';
import { authenticateDB } from './config/dbConfig.js';
import RefreshRoutes from './routes/RefreshRoute.js';
import cors from 'cors';
import http from 'http';
import { initializeSocket } from './socketio/socket.js';
import UserRoutes from './routes/UserRoutes.js';
import { logger } from './Logger/Logger.js';
const GooglePassport = await import('./middleware/passport/GooglePassport.js').then(m => m.default);
import MessageRoutes from './routes/MessageRoutes.js';
import GroupRoutes from './routes/GroupRoutes.js';
// In ES modules, ALL import statements at the top of a file are resolved BEFORE any code executes, even before dotenv.config().
// When GooglePassport.js loads, process.env variables are still undefined because dotenv hasn't loaded them yet.
const app = express();
const PORT = 2404;

const server = http.createServer(app);

initializeSocket(server);


app.use(
  cors({
    origin: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);
app.use(GooglePassport.initialize());
app.use(cookieParser());
app.use(express.json());

app.use("/api",RefreshRoutes);
app.use("/api/auth",AuthRoutes);
app.use("/api/users",UserRoutes);
app.use("/api/messages", MessageRoutes);
app.use("/api/groups", GroupRoutes);
app.use((err, req, res, next) => {
    logger.error(`Error: ${err.message}`, { stack: err.stack, status: err.status });
    return res.status(500).json({
        success: false,
        message: err.message || "Internal Server Error",
        status: err.status || 500
    });
})

authenticateDB();
server.listen(PORT, () => {
    logger.info(`Server is running on http://localhost:${PORT}`);
});