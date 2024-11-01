const mongoose = require("mongoose");
const { check } = require("express-validator");
const validateEmail = require("./validateEmail");

// Using express-validator to check the requirements of user inputs
const signupValidator = [
  check("name").notEmpty().withMessage("Name is required"),
  check("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format"),
  check("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

const signinValidator = [
  check("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format"),
  check("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

const emailValidator = [
  check("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format"),
];

const verifyUserValidator = [
  check("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format"),
  check("code").notEmpty().withMessage("code is required"),
];

const recoverPasswordValidator = [
  check("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format"),
  check("code").notEmpty().withMessage("code is required"),
  check("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

const updateProfileValidator = [
  check("email").custom(async (email) => {
    if (email) {
      const isValidEmail = validateEmail(email);
      if (!isValidEmail) {
        throw "Invalid Email";
      }
    }
  }),
  check("profilePic").custom(async (profilePic) => {
    // If profilePic is provided, check if it is a valid ObjectId
    if (profilePic && !mongoose.Types.ObjectId.isValid(profilePic)) {
      throw new Error("Invalid Profile Picture"); // Use Error object to throw
    }
  }),
];

module.exports = {
  signupValidator,
  signinValidator,
  emailValidator,
  verifyUserValidator,
  recoverPasswordValidator,
  updateProfileValidator,
};
