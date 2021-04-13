module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('user', {
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
            type: DataTypes.DATE,
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
        },
        coachteam: {
            type: DataTypes.ARRAY(DataTypes.INTEGER),
            allowNull: true
        }
    })
    return User;
} 