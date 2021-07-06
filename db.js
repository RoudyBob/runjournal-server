const { Sequelize }  = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    dialectOptions: {
        useUTC: false, //for reading from database
        // ssl: {
        //     require: true,
        //     rejectUnauthorized: false,
        // },
    },
});

sequelize.authenticate().then(
    function() {
        console.log('Connected to RunJournal PostgreSQL database.');
    },
    function(err) {
        console.log(err);
    }
);

module.exports = sequelize;