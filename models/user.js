const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    profileImageUrl: {
      type: String,
      default: null,
    },
    oauth: {
      type: Boolean,
      default: false,
    },
    oauthProvider: {
      type: String,
      default: null,
    },
    sex: {
      type: Boolean,
      default: null,
    },
    age: {
      type: Number,
      default: null,
    },
    height: {
      type: Number,
      default: null,
    },
    weight: {
      type: Number,
      default: null,
    },
    authToken: {
      type: String,
      default: null,
    },
    accessToken: {
      type: String,
      default: null,
    },
    refreshToken: {
      type: String,
      default: null,
    },
    thirdPartyId: {
      type: Number,
      default: null,
    },
    posts: {
      type: Array,
      ref: "Post",
    },
    routines: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Routine",
      },
    ],
    dailyWorkouts: [
      {
        type: mongoose.Types.ObjectId,
        ref: "UserWorkout",
      },
    ],
    workouts: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Workout",
      },
    ],
    rooms: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Room",
      },
    ],
    images: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Image",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
