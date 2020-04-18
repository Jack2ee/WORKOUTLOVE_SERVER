const mongoose = require("mongoose");

const User = require("../models/user");
const Routine = require("../models/routine");
const Workout = require("../models/workout");
const workouts = require("../data/_allWorkout");

exports.addAllWorkouts = async (req, res, next) => {
  const workoutArray = workouts;
  try {
    workoutArray.map(async (i, k) => {
      const objectId = mongoose.Types.ObjectId();
      const sports = {
        eng: "fitness",
        kor: "피트니스",
      };
      const targetPartEng = i.targetPartEng;
      const targetPartKor = i.targetPartKor;
      const targetMuscleEng = i.targetMuscleEng;
      const targetMuscleKor = i.targetMuscleKor;
      const workoutNameEng = i.workoutNameEng;
      const workoutNameKor = i.workoutNameKor;
      const createdBy = await User.findOne({
        _id: mongoose.Types.ObjectId("5e9810b13b9b333508fd40e8"),
      });
      await new Workout({
        _id: objectId,
        sports: sports,
        targetPartEng: targetPartEng,
        targetPartKor: targetPartKor,
        targetMuscleEng: targetMuscleEng,
        targetMuscleKor: targetMuscleKor,
        workoutNameEng: workoutNameEng,
        workoutNameKor: workoutNameKor,
        createdBy: { _id: createdBy._id, name: createdBy.name },
      }).save();
    });
    return res
      .status(201)
      .json({ message: "리스트의 모든 운동이 데이터베이스화되었습니다." });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getAllRoutines = async (req, res, next) => {
  let routines;
  try {
    routines = await Routine.find({});
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      err.message = "루틴을 로드할 수 없습니다.";
    }
    next(err);
  }

  if (routines) {
    res.status(200).json({
      message: "루틴을 성공적으로 로드하였습니다.",
      data: routines,
    });
  }
};
