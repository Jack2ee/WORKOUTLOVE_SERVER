const express = require("express");

const routineController = require("../controllers/routine");
const isAuth = require("../middlewares/is-auth");

const router = express.Router();

// GET /routines/chunk/:chunk, HEADERS: `bearer ${authToken}`(AUTHORIZATION)
router.get("/chunk/:chunk", routineController.getRoutines);

// GET /routines/all, HEADERS: `bearer ${authToken}`(AUTHORIZATION)
router.get("/all", routineController.getAllRoutines);

// GET /routines/one/:routineId
router.get("/one/:routineId", routineController.getRoutine);

// GET /routines/my, HEADERS: `bearer ¢[authToken]`(AUTHORIZATION),
router.get("/my", isAuth, routineController.getMyRoutines);

// POST /routines/, HEADERS: `bearer ${authToken}`(AUTHORIZATION), BODY: {contents: routineName, workouts}
router.post("/", isAuth, routineController.createRoutine);

// UPDATE /routines/my/:routineId, HEADERS: `bearer ¢[authToken]`(AUTHORIZATION), BODY: {contents: routineName, workouts}
router.put("/my/:routineId", isAuth, routineController.updateRoutine);

// DELETE /routines/my/:routineId, HEADERS: `bearer ¢[authToken]`(AUTHORIZATION)
router.delete("/my/:routineId", isAuth, routineController.deleteRoutine);

module.exports = router;
