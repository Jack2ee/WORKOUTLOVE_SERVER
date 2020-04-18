const express = require("express");

const myDailyWorkoutController = require("../controllers/myDailyWorkout");
const isAuth = require("../middlewares/is-auth");
const router = express.Router();

// GET /my-daily-workouts/chunk/:chunk, HEADERS: `bearer ${authToken}`(AUTHORIZATION)
router.get(
  "/chunk/:chunk",
  isAuth,
  myDailyWorkoutController.getMyDailyWorkouts
);

// GET /my-daily-workouts/:myDailyWorkoutId, HEADERS: `bearer ${authToken}`(AUTHORIZATION)
router.get(
  "/:myDailyWorkoutId",
  isAuth,
  myDailyWorkoutController.getMyDailyWorkout
);

// POST /my-daily-workouts/, HEADERS: `bearer ${authToken}`(AUTHORIZATION), BODY: {contents: routineId}
router.post("/", isAuth, myDailyWorkoutController.createMyDailyWorkout);

// UPDATE /my-daily-workouts/:myDailyWorkoutId, , HEADERS: `bearer ${authToken}`(AUTHORIZATION), BODY: {contents}
router.put(
  "/:myDailyWorkoutId",
  isAuth,
  myDailyWorkoutController.updateMyDailyWorkout
);
module.exports = router;
