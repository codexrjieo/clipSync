const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

const clipboardSchema = new mongoose.Schema(
  {
    clipId: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true },
    password: { type: String, required: true },
    notes: [noteSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Clipboard", clipboardSchema);
