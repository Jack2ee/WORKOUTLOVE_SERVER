const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const myDailyWorkoutSchema = new Schema(
  {
    routineId: mongoose.Types.ObjectId,
    routineName: String,
    workouts: Array,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("myDailyWorkout", myDailyWorkoutSchema);
