const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const workoutSchema = new Schema(
  {
    sports: {
      kor: String,
      eng: String,
    },
    targetPartEng: {
      type: String,
      required: true,
    },
    targetPartKor: {
      type: String,
      required: true,
    },
    targetMuscleEng: {
      type: String,
      required: true,
    },
    targetMuscleKor: {
      type: String,
      required: true,
    },
    workoutNameEng: {
      type: String,
      required: true,
    },
    workoutNameKor: {
      type: String,
      required: true,
    },
    createdBy: {
      _id: mongoose.Types.ObjectId,
      name: String,
      profileImageUrl: String,
    },
    revisedBy: [
      {
        _id: mongoose.Types.ObjectId,
        name: String,
        profileImageUrl: String,
      },
    ],
    numberOfConducted: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Workout", workoutSchema);
