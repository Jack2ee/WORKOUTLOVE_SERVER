const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const routineSchema = new Schema(
  {
    routineName: String,
    workouts: Array,
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sharedBy: [
      {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Routine", routineSchema);
