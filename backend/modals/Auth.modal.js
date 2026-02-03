import { DataTypes } from "sequelize";
import { sequelize } from "../config/dbConfig.js";



const Auth = sequelize.define("auths", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },

}, {
    timestamps: true,
});

export default Auth;