const { DataTypes } = require("sequelize");
const db = require("../db");

const Team = db.define('team', {
    firstname: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    lastname: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    runners: {
        type: DataTypes.ARRAY(DataTypes.INTEGER),
        allowNull: true
    }
});

module.exports = Team;