const User = require('./user');
const Plan = require('./plan');
const Workout = require('./workout');
const Team = require('./team');

// Setup Associations
User.hasMany(Plan);
Plan.belongsTo(User);

User.hasMany(Workout);
Workout.belongsTo(User);

User.hasOne(Team);
Team.belongsTo(User);

module.exports = {
  User,
  Plan,
  Workout,
  Team,
};