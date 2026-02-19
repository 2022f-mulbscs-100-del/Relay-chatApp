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
    phone:{
        type: DataTypes.STRING,
        allowNull: true,
    },
    location:{
        type: DataTypes.STRING,
        allowNull: true,
    },
    about:{
        type: DataTypes.STRING,
        allowNull: true,
    },
    title:{
        type: DataTypes.STRING,
        allowNull: true,
    },
    profilePic: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    tags:{
        type: DataTypes.JSON,
        defaultValue: [],
    },
    hasMessaged: {
        type: DataTypes.JSON,
        defaultValue: false,
    },
    lastSeen: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    emailtwoFactor: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    totpEnabled: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    passKeyEnabled:{
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    timestamps: true,
});

export default User;