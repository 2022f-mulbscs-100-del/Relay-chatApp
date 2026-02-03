import Auth from "./Auth.modal.js";
import User from "./User.modal.js";


User.hasOne(Auth, { foreignKey: "userId", as: "auth" });
Auth.belongsTo(User, { foreignKey: "userId", as: "user" });