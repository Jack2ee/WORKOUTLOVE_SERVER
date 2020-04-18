const MyDailyWorkout = require("../models/myDailyWorkout");
const Routine = require("../models/routine");
const User = require("../models/user");

const WORKOUT_PER_CHUNK = 5;

exports.getMyDailyWorkouts = async (req, res, next) => {
  const userId = req.userId;
  const chunk = req.params.chunk;

  let user;
  try {
    user = await User.findOne({ _id: userId });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      err.message = "유저를 찾을 수 없습니다.";
    }
    next(err);
  }

  let totalWorkoutCount;
  let workoutChunk;
  if (user) {
    try {
      totalWorkoutCount = user.dailyWorkouts.length;
      workoutChunk = await MyDailyWorkout.find({
        _id: { $in: user.dailyWorkouts },
      })
        .skip((chunk - 1) * WORKOUT_PER_CHUNK)
        .limit(WORKOUT_PER_CHUNK);
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
        err.message = `${chunk}그룹 내 운동을 로드할 수 없습니다.`;
      }
      next(err);
    }
  }

  if (workoutChunk) {
    res.status(200).json({
      message: `${chunk}그룹 내 운동을 성공적으로 로드하였습니다.`,
      data: {
        totalWorkoutCount: totalWorkoutCount,
        workoutChunk: workoutChunk,
      },
    });
  }
};

exports.getMyDailyWorkout = async (req, res, next) => {
  const myDailyWorkoutId = req.params.myDailyWorkoutId;

  let myDailyWorkout;
  try {
    myDailyWorkout = await MyDailyWorkout.findOne({ _id: myDailyWorkoutId });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      err.message = `${myDailyWorkoutId}의 운동을 로드할 수 없습니다.`;
    }
    next(err);
  }

  if (myDailyWorkout) {
    res.status(200).json({
      message: `${myDailyWorkoutId} 운동을 성공적으로 로드하였습니다.`,
      data: myDailyWorkout,
    });
  }
};

exports.createMyDailyWorkout = async (req, res, next) => {
  const routineId = req.body.contents.routineId;
  const userId = req.userId;

  let routine;
  try {
    routine = await Routine.findOne({ _id: routineId });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      err.message = "루틴을 찾을 수 없습니다.";
    }
    next(err);
  }

  let user;
  if (routine) {
    try {
      user = await User.findOne({ _id: userId });
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
        err.message = "유저를 찾을 수 없습니다.";
      }
      next(err);
    }
  }

  let createdMyDailyWorkout;
  if (user) {
    try {
      createdMyDailyWorkout = await new MyDailyWorkout({
        routineId: routineId,
        routineName: routine.routineName,
        workouts: routine.workouts,
      }).save();
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
        err.message = "운동을 생성할 수 없습니다.";
      }
      next(err);
    }
  }

  let updatedUser;
  if (createdMyDailyWorkout) {
    try {
      await user.dailyWorkouts.push(createdMyDailyWorkout._id);
      updatedUser = await user.save();
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
        err.message = "유저 테이블의 운동 id를 생성할 수 없습니다.";
      }
      next(err);
    }
  }

  let updatedRoutine;
  if (updatedUser) {
    try {
      if (routine.createdBy !== userId) {
        await routine.sharedBy.push(userId);
        updatedRoutine = routine.save();
      }
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
        err.message =
          "루틴 테이블의 공유한 유저의 id를 업데이트할 수 없습니다.";
      }
    }
  }

  if (updatedRoutine) {
    return res.status(201).json({
      message: "운동이 생성되었습니다.",
      workout: createdMyDailyWorkout,
    });
  }
};

exports.updateMyDailyWorkout = async (req, res, next) => {
  const myDailyWorkoutId = req.params.myDailyWorkoutId;
  const contents = req.body.contents;

  let updatedMyDailyWorkout;
  try {
    const myDailyWorkout = await MyDailyWorkout.findOneAndUpdate(
      { _id: myDailyWorkoutId },
      contents,
      {
        new: true,
        useFindAndModify: true,
      }
    );
    updatedMyDailyWorkout = await myDailyWorkout.save();
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      err.message = "운동을 수정할 수 없습니다.";
    }
    next(err);
  }

  if (updatedMyDailyWorkout) {
    res.status(201).json({
      message: "운동 수정을 완료했습니다.",
      data: updatedMyDailyWorkout,
    });
  }
};

exports.deleteMyDailyWorkout = async (req, res, next) => {
  const deleteMyDailyWorkoutId = req.params.deleteMyDailyWorkoutId;

  let deleteMyDailyWorkout;
  try {
    deleteMyDailyWorkout = await MyDailyWorkout.findByIdAndRemove({
      _id: deleteMyDailyWorkoutId,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      err.message = `${deleteMyDailyWorkoutId} 운동을 찾을 수 없습니다.`;
    }
    next(err);
  }

  let user;
  if (deleteMyDailyWorkout) {
    try {
      user = await User.findOne({ _id: req.userId });
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
        err.message = "유저를 찾을 수 없습니다.";
      }
      next(err);
    }
  }

  let updatedUser;
  if (user) {
    try {
      await user.dailyWorkouts.pull(deleteMyDailyWorkoutId);
      updatedUser = await user.save();
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
        err.message = "유저 테이블의 내 운동 아이디를 업데이트할 수 없습니다.";
      }
      next(err);
    }
  }

  if (updatedUser) {
    res.status(200).json({
      message: "내 운동을 성공적으로 삭제하였습니다.",
      data: deleteMyDailyWorkout,
    });
  }
};
