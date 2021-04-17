const { Router } = require("express");
const { Workout } = require("../models");
const validateSession = require("../middleware/validate-session");
const router = Router();

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

// Don't need coaches to be able to do this. They are only going to modify plans.
router.put('/:id', validateSession, function (req, res) {
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
    .then((rowsAffected) => res.status(200).json(rowsAffected))
    .catch((err) => res.status(500).json({ error: err }));
})

router.get('/mine', validateSession, function (req, res) {
    const query = {
        where: {userId: req.user.id}
    }

    Workout.findAll(query)
        .then((workouts) => res.status(200).json(workouts))
        .catch((err) => res.status(500).json({ error: err }));
})

// This will only work for coaches and the owners of workouts
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

    Workout.findAll(query)
        .then((workouts) => res.status(200).json(workouts))
        .catch((err) => res.status(500).json({ error: err }));
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