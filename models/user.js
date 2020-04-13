const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      default: null,
    },
    name: {
      type: String,
      required: true,
    },
    oauth: {
      type: Boolean,
      default: false,
    },
    oauth_provider: {
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
    auth_token: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
