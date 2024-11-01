const mongoose = require("mongoose");

// Creating a user Schema
const userSchema = new mongoose.Schema({
  googleId: {
    type: String,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6, // Fixed spelling to minlength
  },
  role: {
    type: String,
    default: "user",
  },
  profilePic: {
    type: mongoose.Schema.Types.Mixed, // Allow it to be either String or ObjectId
    ref: "file",
  },
  verificationCode: {
    type: String,
  },
  forgotPasswordCode: {
    type: String,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true, // Automatically handle createdAt and updatedAt fields
});

// Connecting the User Schema to a collection called 'user'
const User = mongoose.model("user", userSchema);

module.exports = User;
