const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const roomSchema = new Schema(
  {
    _id: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    roomNames: {
      type: String,
      required: true,
    },
    imageUrls: [
      {
        _id: mongoose.Types.ObjectId,
        imageUrl: String,
      },
    ],
    routines: [
      {
        _id: mongoose.Types.ObjectId,
        routineName: String,
      },
    ],
    chats: [
      {
        _id: mongoose.Types.ObjectId,
        message: String,
      },
    ],
    roomKey: {
      type: String,
      required: true,
    },
    administrator: [
      {
        _id: mongoose.Types.ObjectId,
        name: String,
      },
    ],
    createdBy: {
      _id: mongoose.Types.ObjectId,
      name: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Room", roomSchema);
