const { Router } = require("express");
const { Plan } = require("../models");
const validateSession = require("../middleware/validate-session");
const router = Router();

// This endpoint creates a new plan - NEED COACH CHECK?
router.post('/', validateSession, function (req, res) {
    Plan.create({
        date: req.body.plan.date,
        description: req.body.plan.description,
        type: req.body.plan.type,
        distance: req.body.plan.distance,
        units: req.body.plan.units,
        time: req.body.plan.time,
        notes: req.body.plan.notes,
        userId: req.body.plan.userId
    })
    .then(plan => res.status(200).json(plan))
    .catch(err => res.status(500).json({ error: err }));
});

// This endpoint updates a plan by ID
// If the user is not a coach, just see if they own the plan they're updating.
// If they are a coach, make sure that the owner of the plan is someone they coach.
router.put('/update/:id', validateSession, function (req, res) {
    const updatePlan = {
        date: req.body.plan.date,
        description: req.body.plan.description,
        type: req.body.plan.type,
        distance: req.body.plan.distance,
        units: req.body.plan.units,
        time: req.body.plan.time,
        notes: req.body.plan.notes,
        userId: req.body.plan.userId
    };
    
    if (!req.user.coach) {
        const query = {
             where: { id: req.params.id, userId: req.user.id } // Only find the plan if the userid matches.
        };

        Plan.update(updatePlan, query)
        .then((plan) => res.status(200).json(plan))
        .catch((err) => res.status(500).json({ error: err }));
    } else {
        const query = {
            where: {id: req.params.id} 
        }
        if (req.user.id == updatePlan.userId) { // User is a coach but this is their plan
            Plan.update(updatePlan, query)
            .then((rowsAffected) => res.status(200).json({message: `${rowsAffected} entries updated.`}))
            .catch((err) => res.status(500).json({ error: err }));
        } else if (req.user.team.runners) {
            if (req.user.team.runners.includes(parseInt(updatePlan.userId))) {
                Plan.update(updatePlan, query)
                .then((rowsAffected) => res.status(200).json({message: `${rowsAffected} entries updated.`}))
                .catch((err) => res.status(500).json({ error: err }));
            } else {
                res.status(403).json({ message: "Unauthorized - You are not this runner's coach.", userId: updatePlan })
            }
        } else if (req.user.team.runners == null) {
            res.status(500).json({ message: "(NULL) Runners Array is Empty" })
        }
    }
})

// This endpoint gets all plans for logged in user
router.get('/mine', validateSession, function (req, res) {
    const query = {
        where: {userId: req.user.id}
    }

    Plan.findAll(query)
        .then((plans) => res.status(200).json(plans))
        .catch((err) => res.status(500).json({ error: err }));
})

// This endpoint gets a specific plan by that plan's ID
// If the user is not a coach, assume the user is looking up the plan and only return 
// result if that plan ID is owned by that user. If the user is a coach, only return
// that plan ID if the ownerId is listed in the coach's runners.
router.get('/get/:id', validateSession, function (req, res) {
    if (!req.user.coach) {
        const query = {
            where: {id: req.params.id, userId: req.user.id } // Only find the plan if the userid matches.
        }

        Plan.findOne(query)
        .then((plan) => res.status(200).json(plan))
        .catch((err) => res.status(500).json({ error: err }));
    } else {
        const query = {
            where: {id: req.params.id} 
        }

        Plan.findOne(query)
        .then((plan) => {
            if (req.user.id == plan.userId) {
                res.status(200).json(plan) // User is a coach but this is their plan
            } else if (req.user.team.runners) {
                if (req.user.team.runners.includes(parseInt(plan.userId))) {
                    res.status(200).json(plan)
                } else {
                    res.status(403).json({ message: "Unauthorized - You are not this runner's coach." })
                }
            } else if (req.user.team.runners == null) {
                res.status(500).json({ message: "(NULL) Runners Array is Empty" })
            }
        })
        .catch((err) => res.status(500).json({ error: err, query: query }));
    }
});

// This endpoint gets all plans for the specified user ID
// Only can pull the plans for specific userID if you're that user's coach
router.get('/:id', validateSession, function (req, res) {
    if (req.user.id == req.params.id) {

        const query = {
            where: {userId: req.params.id}
        }
    
        Plan.findAll(query)
            .then((plans) => res.status(200).json(plans))
            .catch((err) => res.status(500).json({ error: err }));

    } else if (req.user.team) {
        if (req.user.team.runners) {
            if (!req.user.team.runners.includes(parseInt(req.params.id))) {
                // Deny access if not a coach and the id doesn't match one of their runners
                return res.status(403).json({ message: "You are not this runner's coach." })
            } 
        } else if (req.user.team.runners === null) {
                // Deny access if not a coach has no runners
                return res.status(403).json({ message: "You are not this runner's coach" })
        }

        const query = {
            where: {userId: req.params.id}
        }
    
        Plan.findAll(query)
            .then((plans) => res.status(200).json(plans))
            .catch((err) => res.status(500).json({ error: err }));

    } else {
        // User Doesn't Match and They Aren't a Coach
        return res.status(403).json({ message: "Access Denied." })
    }
})

// Only should allow deletions if the plan belongs to the current user OR that user's coach
router.delete('/:id', validateSession, function (req, res) {
    if (!req.user.coach) {
        const query = {
            where: {id: req.params.id, userId: req.user.id } // Only find the plan if the userid matches.
        }

        Plan.destroy(query)
        .then((rowsAffected) => res.status(200).json({message: `${rowsAffected} entries deleted.`}))
        .catch((err) => res.status(500).json({ error: err }));

    } else {
        const query = {
            where: {id: req.params.id} 
        }

        Plan.findOne(query)
        .then((plan) => {
            if (req.user.id == plan.userId) {
                // User is a coach but this is their plan
                Plan.destroy(query)
                .then((rowsAffected) => res.status(200).json({message: `${rowsAffected} entries deleted.`}))
                .catch((err) => res.status(500).json({ error: err }));
            } else if (req.user.team.runners) {
                if (req.user.team.runners.includes(parseInt(plan.userId))) {
                    Plan.destroy(query)
                    .then((rowsAffected) => res.status(200).json({message: `${rowsAffected} entries deleted.`}))
                    .catch((err) => res.status(500).json({ error: err }));
                } else {
                    res.status(403).json({ message: "Unauthorized - You are not this runner's coach." })
                }
            } else if (req.user.team.runners == null) {
                res.status(500).json({ message: "(NULL) Runners Array is Empty" })
            }
        })
        .catch((err) => res.status(500).json({ error: err, query: query }));
    }
});

module.exports = router;