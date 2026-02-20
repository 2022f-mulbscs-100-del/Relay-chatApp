import Auth from "./Auth.modal.js";
import Group from "./Group.modal.js";
import GroupMember from "./GroupMember.modal.js";
import GroupMessage from "./GroupMessage.modal.js";
import { Message } from "./Message.modal.js";
import PrivateMemberModal from "./PrivateMember.modal.js";
import User from "./User.modal.js";


User.hasOne(Auth, { foreignKey: "userId", as: "auth" });

Auth.belongsTo(User, { foreignKey: "userId", as: "user" });

User.hasMany(Message, { foreignKey: "senderId", as: "sentMessages" }); 
//user can send many messages

User.hasMany(Message, { foreignKey: "receiverId", as: "receivedMessages" });
//user can receive many messages

User.hasMany(GroupMessage, { foreignKey: "senderId", as: "sentGroupMessages" });
//user can send many group messages

User.hasMany(Group, { foreignKey: "createdBy", as: "createdGroups" });
//user can create many groups

Group.hasMany(GroupMessage, { foreignKey: "groupId", as: "groupMessages" });
//group can have many group messages


Group.hasMany(GroupMember, { foreignKey: "groupId", as: "members" });
//group can have many members

User.hasMany(GroupMember, { foreignKey: "userId", as: "groupMemberships" });
//user can be member of many groups

User.hasMany(PrivateMemberModal, { foreignKey: "userId", as: "privateAssociations" });
//user can have many private associations

User.hasMany(PrivateMemberModal, { foreignKey: "associateUserId", as: "associatedWith" });
//user can be associated with many users in private chats


// --------------------------------------     BELONGS TO     --------------------------------------

Group.belongsTo(User, { foreignKey: "createdBy", as: "creator" });
//group belongs to a user (the creator)

GroupMessage.belongsTo(User, { foreignKey: "senderId", as: "sender" });
//group message belongs to a user (the sender)

Message.belongsTo(User, { foreignKey: "senderId", as: "sender" });
//message belongs to a user (the sender)

Message.belongsTo(User, { foreignKey: "receiverId", as: "receiver" });
//message belongs to a user (the receiver)

GroupMember.belongsTo(User, { foreignKey: "userId", as: "user" });
//group member belongs to a user

GroupMember.belongsTo(Group, { foreignKey: "groupId", as: "group" });
//group member belongs to a group

PrivateMemberModal.belongsTo(User, { foreignKey: "userId", as: "user" });
//private member belongs to a user

PrivateMemberModal.belongsTo(User, { foreignKey: "associateUserId", as: "associatedUser" });
//private member belongs to an associated user