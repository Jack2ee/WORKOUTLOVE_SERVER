const express = require("express");

const workoutController = require("../controllers/workout");
const isAuth = require("../middlewares/is-auth");

const router = express.Router();

// GET /workouts
router.get("/all", isAuth, workoutController.getAllWorkouts);

// GET /workouts/one/:workoutId
router.get("/one/:workoutId", isAuth, workoutController.getOneWorkout);

// GET /workouts/my
router.get("/my", isAuth, workoutController.getMyWorkouts);

module.exports = router;
