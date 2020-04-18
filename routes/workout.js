const express = require("express");

const workoutController = require("../controllers/workout");

const router = express.Router();

// GET /workouts
router.get("/", workoutController.getAllWorkouts);

// GET /workouts/:workoutId
router.get("/:workoutId", workoutController.getOneWorkout);

module.exports = router;
