const mongoose = require("mongoose");

const MessengeSchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    text: String,
    file: String,
  },
  { timestamps: true }
);

const MessageModal = mongoose.model("Message", MessengeSchema);

module.exports = MessageModal;
