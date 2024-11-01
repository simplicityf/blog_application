const mongoose = require("mongoose");

const fileSchema = mongoose.Schema(
  {
    key: { type: String, required: true },
    size: { type: Number, required: true },
    mimetype: { type: String, required: true },
    uploadedBy: { type: mongoose.Types.ObjectId, ref: "user", required: true },
  },
  { timestamps: true }
);

const File = mongoose.model("file", fileSchema);

module.exports = File;
