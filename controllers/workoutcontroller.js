const { Router } = require("express");
const { Workout } = require("../models");
const validateSession = require("../middleware/validate-session");
const router = Router();

// This endpoint creates a new workout. Coaches don't need access.
router.post('/', validateSession, function (req, res) {
    Workout.create({
        timestamp: req.body.workout.timestamp,
        description: req.body.workout.description,
        distance: req.body.workout.distance,
        units: req.body.workout.units,
        movingtime: req.body.workout.movingtime,
        elapsedtime: req.body.workout.elapsedtime,
        elevationgain: req.body.workout.elevationgain,
        startlocation: req.body.workout.startlocation,
        endlocation: req.body.workout.endlocation,
        temp: req.body.workout.temp,
        humidity: req.body.workout.humidity,
        aqi: req.body.workout.aqi,
        notes: req.body.workout.notes,
        sourceid: req.body.workout.sourceid,
        userId: req.user.id
    })
    .then((workout) => res.status(200).json(workout))
    .catch((err) => res.status(500).json({ error: err }));
});

// This endpoint updates a workout based on an ID
// Don't need coaches to be able to do this. They are only going to modify plans.
router.put('/update/:id', validateSession, function (req, res) {
    const updateWorkout = {
        timestamp: req.body.workout.timestamp,
        description: req.body.workout.description,
        distance: req.body.workout.distance,
        units: req.body.workout.units,
        movingtime: req.body.workout.movingtime,
        elapsedtime: req.body.workout.elapsedtime,
        elevationgain: req.body.workout.elevationgain,
        startlocation: req.body.workout.startlocation,
        endlocation: req.body.workout.endlocation,
        temp: req.body.workout.temp,
        humidity: req.body.workout.humidity,
        aqi: req.body.workout.aqi,
        notes: req.body.workout.notes,
        sourceid: req.body.workout.sourceid,
    };

    const query = { where: { id: req.params.id, userId: req.user.id }};

    Workout.update(updateWorkout, query)
    .then((rowsAffected) => res.status(200).json({message: `${rowsAffected} entries updated.`}))
    .catch((err) => res.status(500).json({ error: err }));
})

// This endpoint gets all workouts for the logged in user
router.get('/mine', validateSession, function (req, res) {
    const query = {
        where: {userId: req.user.id}
    }

    Workout.findAll(query)
        .then((workouts) => res.status(200).json(workouts))
        .catch((err) => res.status(500).json({ error: err }));
})

// This endpoint gets a specific workout by ID.
// If the user is not a coach, assume the user is looking up the plan and only return 
// result if that plan ID is owned by that user. If the user is a coach, only return
// that plan ID if the ownerId is listed in the coach's runners.
router.get('/get/:id', validateSession, function (req, res) {
    if (!req.user.coach) {
        const query = {
            where: {id: req.params.id, userId: req.user.id } // Only find the plan if the userid matches.
        }

        Workout.findOne(query)
        .then((workout) => res.status(200).json(workout))
        .catch((err) => res.status(500).json({ error: err }));
    } else {
        const query = {
            where: {id: req.params.id} 
        }

        Workout.findOne(query)
        .then((workout) => {
            if (req.user.id == workout.userId) {
                res.status(200).json(workout) // User is a coach but this is their workout
            } else if (req.user.team.runners) {
                if (req.user.team.runners.includes(parseInt(workout.userId))) {
                    res.status(200).json(workout)
                } else {
                    res.status(403).json({ message: "Unauthorized - You are not this runner's coach." })
                }
            } else if (req.user.team.runners == null) {
                res.status(500).json({ message: "(NULL) Runners Array is Empty" })
            }
        })
        .catch((err) => res.status(500).json({ error: err, query: query }));
    }
})

// This endpoint gets all workouts for the specified user ID
// Only can pull the workout for specific userID if you're that user's coach
router.get('/:id', validateSession, function (req, res) {
    if (req.user.id == req.params.id) {

        const query = {
            where: {userId: req.params.id}
        }
    
        Workout.findAll(query)
            .then((workouts) => res.status(200).json(workouts))
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
    
        Workout.findAll(query)
            .then((workouts) => res.status(200).json(workouts))
            .catch((err) => res.status(500).json({ error: err }));

    } else {
        // User Doesn't Match and They Aren't a Coach
        return res.status(403).json({ message: "Access Denied." })
    }
})

// Coaches should not be able to delete workouts for their runners this query's where statement ensures that
router.delete('/:id', validateSession, function (req, res) {
    const query = {
        where: {id: req.params.id, userId: req.user.id}
    }

    Workout.destroy(query)
        .then((rowsAffected) => res.status(200).json({message: `${rowsAffected} entries deleted.`}))
        .catch((err) => res.status(500).json({ error: err }));
})


module.exports = router;