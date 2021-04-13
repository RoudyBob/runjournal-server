const express = require('express');
const Sequelize = require('../db');
const Plan = require('../db').import('../models/plan');
const router = express.Router();
const validateSession = require ('../middleware/validate-session');

module.exports = router;