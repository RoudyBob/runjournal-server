const express = require('express');
const Sequelize = require('../db');
const User = require('../db').import('../models/user');
const Team = require('../db').import('../models/team');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const validateSession = require ('../middleware/validate-session');

router.post('/signup', function (req, res) {
    User.create({
        email: req.body.user.email,
        password: bcrypt.hashSync(req.body.user.password, 13),
        firstname: req.body.user.firstname,
        lastname: req.body.user.lastname,
        birthdate: req.body.user.birthdate,
        weekstart: req.body.user.weekstart,
        defaultunits: req.body.user.defaultunits,
        coach: req.body.user.coach,
        coachteam: req.body.user.coachteam
    })
    .then(
        function createSuccess(user) {
           let token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {expiresIn: 60 * 60 * 24});
           res.json({
               user: user,
               message: "User successfully registered!",
               sessionToken: token
            });
        }
    )
    .catch(err => res.status(500).json({ error: err }));
});

router.put('/:id', validateSession, function (req, res) {
    const updateUser = {
        firstname: req.body.user.firstname,
        lastname: req.body.user.lastname,
        birthdate: req.body.user.birthdate,
        weekstart: req.body.user.weekstart,
        defaultunits: req.body.user.defaultunits,
        coach: req.body.user.coach,
        coachteam: req.body.user.coachteam
    };

    const query = { where: { id: req.params.id, id: req.user.id }};

    User.update(updateUser, query)
    .then(rowsAffected => res.status(200).json(rowsAffected))
    .catch(err => res.status(500).json({ error: err }));
});

router.post('/login', function (req, res) {
    User.findOne({
        where: {
            email: req.body.user.email
        }
    })
    .then(
        function loginSuccess(user) {
            if(user) {
                bcrypt.compare(req.body.user.password, user.password, function (err, matches) {
                    if (matches) {
                        let token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {expiresIn: 60 * 60 * 24});

                        res.status(200).json({
                            user: user,
                            message: "User login successful!",
                            sessionToken: token
                        })

                    } else {
                        res.status(502).send({ error: 'Login Failed' });
                    };
                }); 
            } else {
                res.status(500).json({ error: 'User does not exist.' })
            };
        })
    .catch(err => res.status(500).json({error: err}));
})

router.get('/', validateSession, function (req, res) {
    User.findAll({
        where: {coach: true},
        attributes: ['id', 'email', 'firstname', 'lastname']
    })
    .then(users => res.status(200).json(users))
    .catch(err => res.status(500).json({ error: err }));
})

// router.get('/', validateSession, function (req, res) {
//     console.log(req);
//     User.findAll()
//     .then(users => res.status(200).json(users))
//     .catch(err => res.status(500).json({ error: err }))
// });

module.exports = router;