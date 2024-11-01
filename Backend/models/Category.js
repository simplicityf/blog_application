const mongoose = require("mongoose");

const categorySchema = mongoose.Schema({
    title: {type: String, required: true},
    desc: String,
    file: {type: mongoose.Types.ObjectId || String, ref: "file",},
    updatedBy: {type: String, required: true},
}, {timestamps: true}
);

const Category = mongoose.model("category", categorySchema);

module.exports = Category;