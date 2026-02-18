import { DataTypes } from "sequelize";
import { sequelize } from "../config/dbConfig.js";

const Associated = sequelize.define("associated", {
    id: {
        type: DataTypes.UUID,
        autoIncrement: true,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    associatedUserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    Group:{
        type: DataTypes.STRING,
        allowNull: true,
    }
}, {
    timestamps: true,
});

export default Associated;