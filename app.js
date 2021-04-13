const express = require('express');
const app = express();
const Sequelize = require('./db');
require('dotenv').config();

// Import JSON support for Express
app.use(express.json());

// Header configuration for client requests
app.use(require('./middleware/headers'));

// Import controllers as a bundle
const controllers = require("./controllers");

// Controllers used by the backend
app.use('/user', controllers.User);
app.use('/plan', controllers.Plan);
app.use('/workout', controllers.Workout);

// Connect to DB
Sequelize.sync();
//sequelize.sync({force: true});  // If we need to force a DB change

app.listen(process.env.PORT, function(){
    console.log(`App is listening on port ${process.env.PORT}`);
})