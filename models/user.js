const { DataTypes } = require("sequelize");
const db = require("../db");

const User = db.define('user', {
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    firstname: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastname: {
        type: DataTypes.STRING,
        allowNull: false
    },
    birthdate: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    weekstart: {
        type: DataTypes.STRING,
        allowNull: false
    },
    defaultunits: {
        type: DataTypes.STRING,
        allowNull: false
    },
    coach: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    }
});
    
module.exports = User;