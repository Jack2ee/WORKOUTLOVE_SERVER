const express = require("express");

const adminController = require("../controllers/admin");

const router = express.Router();

// POST /admin/add-all-workouts {}
router.post("/add-all-workouts", adminController.addAllWorkouts);

// GET /admin/get-all-routines {}
router.get("/get-all-routines", adminController.getAllRoutines);

module.exports = router;
