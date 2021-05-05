const { DataTypes } = require("sequelize");
const db = require("../db");

const Plan = db.define('plan', {
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false
    },
    distance: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    units: {
        type: DataTypes.STRING,
        allowNull: true
    },
    time: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    notes: {
        type: DataTypes.STRING,
        allowNull: true
    },
});

module.exports = Plan;
