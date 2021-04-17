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

router.put('/join/:teamid', validateSession, function (req, res) {
    Team.update(
        {runners: Sequelize.fn('array_append', Sequelize.col('runners'), req.user.id)},
        {where: {id: req.params.teamid}}
    )
    .then(rowsAffected => res.status(200).json(rowsAffected))
    .catch(err => res.status(500).json({error:err}))
});

router.put('/leave/:teamid', validateSession, function (req, res) {
    Team.update(
        {runners: Sequelize.fn('array_remove', Sequelize.col('runners'), req.user.id)},
        {where: {id: req.params.teamid}}
    )
    .then(rowsAffected => res.status(200).json(rowsAffected))
    .catch(err => res.status(500).json({error:err}))
});

router.delete('/:id', validateSession, function (req, res) {
    const query = {
        where: {id: req.params.id, userId: req.user.id}
    }

    Team.destroy(query)
        .then((rowsAffected) => res.status(200).json({message: `${rowsAffected} entries deleted.`}))
        .catch((err) => res.status(500).json({ error: err }));
})

module.exports = router;