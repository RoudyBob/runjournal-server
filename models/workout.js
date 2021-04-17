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
        type: DataTypes.DECIMAL,
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
        type: DataTypes.DECIMAL,
        allowNull: true
    },
    startlocation: {
        type: DataTypes.ARRAY(DataTypes.DECIMAL),
        allowNull: true
    },
    endlocation: {
        type: DataTypes.ARRAY(DataTypes.DECIMAL),
        allowNull: true
    },
    temp: {
        type: DataTypes.DECIMAL,
        allowNull: true
    },
    humidity: {
        type: DataTypes.DECIMAL,
        allowNull: true
    },
    aqi: {
        type: DataTypes.DECIMAL,
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