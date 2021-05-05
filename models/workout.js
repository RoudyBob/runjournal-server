const { DataTypes } = require("sequelize");
const db = require("../db");

const Workout = db.define('workout', {
    timestamp: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    distance: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    units: {
        type: DataTypes.STRING,
        allowNull: false
    },
    movingtime: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    elapsedtime: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    elevationgain: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    startlocation: {
        type: DataTypes.ARRAY(DataTypes.FLOAT),
        allowNull: true
    },
    endlocation: {
        type: DataTypes.ARRAY(DataTypes.FLOAT),
        allowNull: true
    },
    temp: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    humidity: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    aqi: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    notes: {
        type: DataTypes.STRING,
        allowNull: true
    },
    sourceid: {
        type: DataTypes.STRING,
        allowNull: true
    }
});

module.exports = Workout;