import Auth from "./Auth.modal.js";
import { Message } from "./Message.modal.js";
import User from "./User.modal.js";


User.hasOne(Auth, { foreignKey: "userId", as: "auth" });
Auth.belongsTo(User, { foreignKey: "userId", as: "user" });

User.hasMany(Message, { foreignKey: "senderId", as: "sentMessages" }); 
//user can send many messages
User.hasMany(Message, { foreignKey: "receiverId", as: "receivedMessages" });
//user can receive many messages

Message.belongsTo(User, { foreignKey: "senderId", as: "sender" });

Message.belongsTo(User, { foreignKey: "receiverId", as: "receiver" });

export { User, Auth, Message };