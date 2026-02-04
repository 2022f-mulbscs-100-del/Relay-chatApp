import { DataTypes } from "sequelize";
import { sequelize } from "../config/dbConfig.js";

const User  = sequelize.define("users", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    hasMessaged: {
        type: DataTypes.JSON,
        defaultValue: false,
    },
}, {
    timestamps: true,
});

export default User;