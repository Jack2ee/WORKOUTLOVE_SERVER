const mongoose = require("mongoose");

const User = require("../models/user");
const Workout = require("../models/workout");

exports.getAllWorkouts = async (req, res, next) => {
  let allWorkouts;
  try {
    allWorkouts = await Workout.find({});
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      err.message = "모든 운동을 로드할 수 없습니다.";
    }
    next(err);
  }

  if (allWorkouts) {
    res.status(200).json({
      message: "모든 운동을 성공적으로 로드하였습니다.",
      allWorkouts: allWorkouts,
    });
  }
};

exports.getOneWorkout = async (req, res, next) => {
  const workoutId = req.params.workoutId;
  let workout;
  try {
    workout = await Workout.findOne({ _id: id });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      err.message = `${workoutId}의 운동을 로드할 수 없습니다.`;
    }
    next(err);
  }

  if (workout) {
    res.status(200).json({
      message: `${workoutId}의 운동을 성공적으로 로드하였습니다.`,
      data: workout,
    });
  }
};

exports.getMyWorkouts = async (req, res, next) => {
  const userId = req.userId;
  let loadedUser;

  try {
    loadedUser = await User.findOne({ _id: userId });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      err.message = "유저 정보를 로드할 수 없습니다.";
    }
    next(err);
  }

  let loadedMyWorkouts;
  let loadedMyWorkoutCount;
  if (loadedUser) {
    try {
      loadedMyWorkouts = await Workout.find({
        _id: { $in: loadedUser.workouts },
      });
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
        err.message = "나의 운동을 로드할 수 없습니다.";
      }
      next(err);
    }
  }

  if (loadedMyWorkouts) {
    res.status(200).json({
      message: "나의 운동을 성공적으로 로드하였습니다.",
      myWorkouts: loadedMyWorkouts,
      myWorkoutCount: loadedMyWorkoutCount,
    });
  }
};
