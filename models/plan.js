module.exports = (sequelize, DataTypes) => {
    const Plan = sequelize.define('plan', {
        date: {
            type: DataTypes.DATE,
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
            type: DataTypes.DECIMAL,
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
        ownerid: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    })
    return Plan;
} 