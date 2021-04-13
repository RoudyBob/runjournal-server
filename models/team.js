module.exports = (sequelize, DataTypes) => {
    const Team = sequelize.define('team', {
        firstname: {
            type: DataTypes.STRING,
            allowNull: false
        },
        lastname: {
            type: DataTypes.STRING,
            allowNull: false
        },
        runnerid: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        coachid: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    })
    return Team;
} 