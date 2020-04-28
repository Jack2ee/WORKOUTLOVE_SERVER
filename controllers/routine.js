const User = require("../models/user");
const Routine = require("../models/routine");

const ROUTINE_PER_CHUNK = 5;

exports.createRoutine = async (req, res, next) => {
  const contents = req.body.contents;
  let creator;
  try {
    creator = await User.findOne({
      _id: req.userId,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      err.message = "유저를 찾을 수 없습니다.";
    }
    next(err);
  }

  let routine;
  if (creator) {
    try {
      routine = await new Routine({
        routineName: contents.routineName,
        workouts: contents.workouts,
        createdBy: req.userId,
      }).save();
    } catch (err) {
      console.log(err);
      if (!err.statusCode) {
        err.statusCode = 500;
        err.message = "루틴을 생성할 수 없습니다.";
      }
      next(err);
    }
  }

  let updatedUserRoutines;
  if (routine) {
    try {
      await creator.routines.push(routine);
      updatedUserRoutines = await creator.save();
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
        err.message = "유저 테이블의 루틴을 업데이트할 수 없습니다.";
      }
      next(err);
    }
  }

  if (updatedUserRoutines) {
    res.status(201).json({
      message: "루틴이 생성되었습니다.",
      routines: updatedUserRoutines.routines,
    });
  }
};

exports.getAllRoutines = async (req, res, next) => {
  let totalRoutineCount;
  let allRoutines;
  try {
    allRoutines = await Routine.find();
    totalRoutineCount = allRoutines.length;
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      err.message = "모든 루틴을 로드할 수 없습니다.";
    }
    next(err);
  }

  if (totalRoutineCount && allRoutines) {
    res.status(200).json({
      message: "모든 루틴을 로드하였습니다.",
      totalRoutineCount: totalRoutineCount,
      allRoutines: allRoutines,
    });
  }
};

exports.getRoutines = async (req, res, next) => {
  const chunk = req.params.chunk;
  let totalRoutineCount;
  let routineChunk;

  try {
    totalRoutineCount = await Routine.find().countDocuments();
    routineChunk = await Routine.find()
      .skip((chunk - 1) * ROUTINE_PER_CHUNK)
      .limit(ROUTINE_PER_CHUNK);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      err.message = `${chunk}그룹 루틴을 로드할 수 없습니다.`;
    }
    next(err);
  }

  if (totalRoutineCount && routineChunk) {
    res.status(200).json({
      message: `${chunk}그룹 루틴을 성공적으로 로드하였습니다.`,
      totalRoutineCount: totalRoutineCount,
      routineChunk: routineChunk,
    });
  }
};

exports.getRoutine = async (req, res, next) => {
  const routineId = req.params.routineId;
  let routine;
  try {
    routine = await Routine.findOne({ _id: routineId });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      err.message = `${routineId} 루틴을 로드할 수 없습니다.`;
    }
    next(err);
  }

  if (routine) {
    res
      .status(200)
      .json({ message: "루틴을 성공적으로 로드하였습니다.", data: routine });
  }
};

exports.getMyRoutines = async (req, res, next) => {
  const userId = req.userId;

  let user;
  try {
    user = await User.findOne({
      _id: userId,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      err.message = "유저를 찾을 수 없습니다.";
    }
    next(err);
  }

  let myRoutines;
  let myRoutineCount;
  try {
    myRoutines = await Routine.find({ _id: { $in: user.routines } });
    myRoutineCount = myRoutines.length;
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      err.message = "유저를 찾았으나 해당 유저의 루틴을 로드할 수 없습니다.";
    }
  }

  if (user) {
    res.status(200).json({
      message: "내 루틴을 성공적으로 로드하였습니다.",
      myRoutines: myRoutines,
      myRoutineCount: myRoutineCount,
    });
  }
};

exports.updateRoutine = async (req, res, next) => {
  const routineId = req.params.routineId;
  const contents = req.body.contents;

  let updatedRoutine;
  try {
    const routine = await Routine.findOneAndUpdate(
      { _id: routineId },
      contents,
      {
        new: true,
        useFindAndModify: true,
      }
    );
    updatedRoutine = await routine.save();
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      err.message = "루틴을 수정할 수 없습니다.";
    }
    next(err);
  }

  if (updatedRoutine) {
    res
      .status(201)
      .json({ message: "루틴 수정을 완료하였습니다.", data: updatedRoutine });
  }
};

exports.deleteRoutine = async (req, res, next) => {
  const deletedRoutineId = req.params.routineId;

  let deletedRoutine;
  try {
    deletedRoutine = await Routine.findOneAndRemove({
      _id: deletedRoutineId,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      err.message = `${deletedRoutineId} 루틴을 찾을 수 없습니다.`;
    }
    next(err);
  }

  let user;
  if (deletedRoutine) {
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
      await user.routines.pull(deletedRoutineId);
      updatedUser = await user.save();
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
        err.message = "유저 테이블의 루틴 아이디를 업데이트할 수 없습니다.";
      }
      next(err);
    }
  }

  if (updatedUser) {
    res.status(200).json({
      message: "루틴을 성공적으로 삭제하였습니다.",
      data: deletedRoutine,
    });
  }
};
