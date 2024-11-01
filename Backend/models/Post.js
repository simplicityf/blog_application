const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
    title: {type: String},
    desc: {type: String, require: true},
    file: {type: mongoose.Types.ObjectId, ref: "file"},
    category: {type: mongoose.Types.ObjectId, ref: "category"},
    updatedBy: {type: mongoose.Types.ObjectId, ref:"user"}
}, {timestamps: true});

const Post = mongoose.model("post", postSchema);

module.exports = Post