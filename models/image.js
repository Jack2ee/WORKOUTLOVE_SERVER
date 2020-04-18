const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const imageSchema = new Schema(
  {
    imageUrl: {
      type: String,
      required: true,
    },
    imageName: {
      type: String,
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Image", imageSchema);
