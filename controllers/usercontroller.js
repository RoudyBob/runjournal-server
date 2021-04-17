const { User } = require('../models');
const { Team } = require('../models');
const { Router } = require('express');
const router = Router();
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
    })
    .then(
        function createSuccess(user) {
            if (req.body.user.coach === true) {
                Team.create({
                    firstname: req.body.user.firstname,
                    lastname: req.body.user.lastname,
                    userId: user.id,
                })
                .then(team => res.status(200).json(team))
                .catch(err => res.status(500).json({ error: err }))
            }
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
    };

    // if (req.body.user.coach === true) {
    //     Team.create({
    //         firstname: req.body.user.firstname,
    //         lastname: req.body.user.lastname,
    //         userId: req.user.id,
    //     })
    //     .then(team => res.status(200).json(team))
    //     .catch(err => res.status(500).json({ error: err }))
    // }

    // Add in here check to see if it changed and handle appropriately

    const query = { where: { id: req.params.id, id: req.user.id }};

    User.update(updateUser, query)
    .then(rowsAffected => res.status(200).json(rowsAffected))
    .catch(err => res.status(500).json({ error: err }));
});

router.post('/login', function (req, res) {
    User.findOne({
        where: {
            email: req.body.user.email
        },
        include: "team"
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
        attributes: ['id', 'email', 'firstname', 'lastname'],
        include: "team"
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