import { DataTypes } from "sequelize";
import { sequelize } from "../config/dbConfig.js";

const GroupMessage  = sequelize.define("groupMessage", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    senderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    groupId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    isReadBy: {
        type: DataTypes.JSON,
        defaultValue: [],
    },
    ImageUrl: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    isDeletedBy: {
        type: DataTypes.JSON,
        defaultValue: [],
    },
},{
    timestamps: true,
})

export default GroupMessage;