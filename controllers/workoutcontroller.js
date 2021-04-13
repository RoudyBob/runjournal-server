const express = require('express');
const Sequelize = require('../db');
const Workout = require('../db').import('../models/workout');
const router = express.Router();
const validateSession = require ('../middleware/validate-session');

module.exports = router;