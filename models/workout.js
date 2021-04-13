module.exports = (sequelize, DataTypes) => {
    const Workout = sequelize.define('workout', {
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
        },
        ownerid: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    })
    return Workout;
} 