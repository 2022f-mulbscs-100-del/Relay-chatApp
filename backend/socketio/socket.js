import { Server } from "socket.io";
import { logger } from "../Logger/Logger.js";
import { handleRegister, handleDisconnect } from "./SocketControllers/AuthController.js";
import { groupMessage, joinGroup, leaveGroup, addMemberToGroup, createGroup } from "./SocketControllers/GroupController.js";
import { handlePrivateMessage } from "./SocketControllers/PrivateController.js";

export const connectedUsers = new Map(); // Map to store userId and their corresponding socketId(s)

export const initializeSocket = (server) => {

    const io = new Server(server, {
        cors: {
            origin: true,
            methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
            credentials: true,
        },
    });


    io.on("connection", (socket) => {
        logger.info(`New socket connection: ${socket.id}`);

        // auth controller
        socket.on("register", handleRegister(socket));
        socket.on("disconnect", handleDisconnect(socket));

        //  private controller
        socket.on("private_message", handlePrivateMessage(io, socket));

        // group controller
        socket.on("create_group", createGroup(io));
        socket.on("group_message", groupMessage(io, socket));
        socket.on("add_member", addMemberToGroup(io));
        socket.on("join_group", joinGroup(socket));
        socket.on("leave_group", leaveGroup(socket));

    });



    return io;
};



//here we are receving message the user is sending message threought this event 
//privatemessage and we sending that message or forwarding that message to
//the specific user using toUserId(room)
//on front end the user is receving that message by listening to the same event name private message
//and then updating the chat window
//Group creation and notifying other
