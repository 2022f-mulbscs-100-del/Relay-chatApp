import { DataTypes } from "sequelize";
import { sequelize } from "../config/dbConfig.js";

const PrivateMemberModal = sequelize.define("private_members", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    associateUserId: {
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
    category: {
        type: DataTypes.STRING,
        allowNull: true,
    },
},{
    timestamps: true,
    indexes: [
        {
            unique: true,
            fields: ['userId', 'associateUserId'],
            name: 'unique_user_association'
        }
    ]
    // Composite UNIQUE Index
});

export default PrivateMemberModal;