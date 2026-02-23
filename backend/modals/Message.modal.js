import { DataTypes } from "sequelize";
import { sequelize } from "../config/dbConfig.js";
;


export const Message = sequelize.define("Message", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    senderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    receiverId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    isRead: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    ImageUrl: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    deletedForSender: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    deletedForReceiver: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    deletedForEveryone: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
},{
    timestamps: true,
})


// {
//                         senderId: associateUserId,
//                         receiverId: id,
//                     },


// a message to user b 
// a is the sender  b is the receiver

// b get the messages in which b is the reciver and a is the sender 
// mark those message as deleted for the for the sender cause the user a is deletung the msgs


// now how to correct the recived messages thing 