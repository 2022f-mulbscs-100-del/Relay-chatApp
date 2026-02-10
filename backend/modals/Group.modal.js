import { DataTypes } from "sequelize";
import { sequelize } from "../config/dbConfig.js";

const Group = sequelize.define("group", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    groupName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    createdBy: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    profile:{
        type: DataTypes.STRING,
        allowNull: true,
    },
    memberIds: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: []
    },
},{
    timestamps: true,
})

export default Group;