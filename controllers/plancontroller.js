const { Router } = require("express");
const { Plan } = require("../models");
const validateSession = require("../middleware/validate-session");
const router = Router();

router.post('/', validateSession, function (req, res) {
    Plan.create({
        date: req.body.plan.date,
        description: req.body.plan.description,
        type: req.body.plan.type,
        distance: req.body.plan.distance,
        units: req.body.plan.units,
        time: req.body.plan.time,
        notes: req.body.plan.notes,
        userId: req.user.id
    })
    .then(plan => res.status(200).json(plan))
    .catch(err => res.status(500).json({ error: err }));
});

router.put('/update/:id', validateSession, function (req, res) {
    const updatePlan = {
        date: req.body.plan.date,
        description: req.body.plan.description,
        type: req.body.plan.type,
        distance: req.body.plan.distance,
        units: req.body.plan.units,
        time: req.body.plan.time,
        notes: req.body.plan.notes,
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

    const query = { where: { id: req.params.id, userId: req.user.id }};

    Plan.update(updatePlan, query)
    .then((rowsAffected) => res.status(200).json(rowsAffected))
    .catch((err) => res.status(500).json({ error: err }));
})

router.get('/mine', validateSession, function (req, res) {
    const query = {
        where: {userId: req.user.id}
    }

    Plan.findAll(query)
        .then((plans) => res.status(200).json(plans))
        .catch((err) => res.status(500).json({ error: err }));
})

// Only can pull the plans for specific userID if you're that user's coach
router.get('/get/:id', validateSession, function (req, res) {
    if (req.user.team) {
        if (req.user.team.runners) {
            if (!req.user.team.runners.includes(parseInt(req.params.id))) {
                // Deny access if not a coach and the id doesn't match one of their runners
                return res.status(403).json({ message: "You are not this runner's coach." })
            } 
        } else if (req.user.team.runners === null) {
                // Deny access if not a coach has no runners
                return res.status(403).json({ message: "You are not this runner's coach." })
        }
    }
    const query = {
        where: {id: req.params.id}
    }

    Plan.findOne(query)
        .then((plans) => res.status(200).json(plans))
        .catch((err) => res.status(500).json({ error: err }));
})

// Only can pull the plans for specific userID if you're that user's coach
router.get('/:id', validateSession, function (req, res) {
    if (req.user.team) {
        if (req.user.team.runners) {
            if (!req.user.team.runners.includes(parseInt(req.params.id))) {
                // Deny access if not a coach and the id doesn't match one of their runners
                return res.status(403).json({ message: "You are not this runner's coach." })
            } 
        } else if (req.user.team.runners === null) {
                // Deny access if not a coach has no runners
                return res.status(403).json({ message: "You are not this runner's coach." })
        }
    }
    const query = {
        where: {userId: req.params.id}
    }

    Plan.findAll(query)
        .then((plans) => res.status(200).json(plans))
        .catch((err) => res.status(500).json({ error: err }));
})

// Only should allow deletions if the plan belongs to the current user OR that user's coach
router.delete('/:id', validateSession, function (req, res) {
    
    // Get the info about the plan to delete
    Plan.findOne({
        where: {
            id: req.params.id
        },
    })
    .then((plan) => {
        console.log(req.user);
        if (req.user.team) {
            if (!req.user.team.runners.includes(plan.userId)) {
                // Deny access if not a coach and the id doesn't match one of their runners
                return res.status(403).json({ message: "You are not this runner's coach." })
            } else {
                // This person is the runner's coach
                const query = {
                    where: {id: req.params.id} // delete the plan even if it's not owned by current user
                }

                Plan.destroy(query)
                .then((rowsAffected) => res.status(200).json({message: `${rowsAffected} entries deleted.`}))
                .catch((err) => res.status(500).json({ error: err }));
            }
        } else {
            // This person is the runner
            const query = {
                where: {id: req.params.id, userId: req.user.id}
            }

            Plan.destroy(query)
            .then((rowsAffected) => res.status(200).json({message: `${rowsAffected} entries deleted.`}))
            .catch((err) => res.status(500).json({ error: err }));
        }
    
    })
    .catch((err) => res.status(500).json({ error: err }))

})

module.exports = router;