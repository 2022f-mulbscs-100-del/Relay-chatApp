import { DataTypes } from "sequelize";
import { sequelize } from "../config/dbConfig.js";

const GroupMember = sequelize.define("group_member", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    groupId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    isMuted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    isPinned: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    categoroy: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    timestamps: true,
})

export default GroupMember;