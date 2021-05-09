const { Router } = require("express");
const { Team } = require("../models");
const validateSession = require("../middleware/validate-session");
const Sequelize = require('../db');
const router = Router();

router.post('/', validateSession, function (req, res) {
    const teamEntry = {
        firstname: req.body.team.firstname,
        lastname: req.body.team.lastname,
        runners: req.body.team.runners,
        userId: req.user.id,
    }

    Team.create(teamEntry)
    .then(team => res.status(200).json(team))
    .catch(err => res.status(500).json({ error: err }))
});

router.get('/', validateSession, function (req, res) {
    const query = {}


    Team.findAll(query)
    .then(teams => res.status(200).json(teams))
    .catch(err => res.status(500).json({ error: err }));
})

router.put('/join/:coachid', validateSession, function (req, res) {
    Team.update(
        {runners: Sequelize.fn('array_append', Sequelize.col('runners'), req.user.id)},
        {where: {userId: req.params.coachid}}
    )
    .then(rowsAffected => res.status(200).json(rowsAffected))
    .catch(err => res.status(500).json({error:err}))
});

router.put('/leave/:coachid', validateSession, function (req, res) {
    Team.update(
        {runners: Sequelize.fn('array_remove', Sequelize.col('runners'), req.user.id)},
        {where: {userId: req.params.coachid}}
    )
    .then(rowsAffected => res.status(200).json(rowsAffected))
    .catch(err => res.status(500).json({error:err}))
});

// Deletes the team associated with the logged in user ID
router.delete('/', validateSession, function (req, res) {
    const query = {
        where: {userId: req.user.id},
    }

    Team.destroy(query)
        .then((rowsAffected) => res.status(200).json({message: `${rowsAffected} entries deleted.`}))
        .catch((err) => res.status(500).json({ error: err }));
})

module.exports = router;