const express = require("express");
const router = express.Router();

const {authController} = require("../controllers");

const passport = require("passport");

const {
  signupValidator,
  signinValidator,
  emailValidator,
  verifyUserValidator,
  recoverPasswordValidator,
  updateProfileValidator
} = require("../validators/auth");
const validate = require("../validators/validate");
const {isAuth} = require("../middleware");

// Authenticate user
//signupValidator will check if requirements are not empty, validate will throw error if they are empty
router.post("/signup", signupValidator, validate, authController.signup);

//signinValidator will check if requirements are not empty, validate will throw error if they are empty
router.post("/signin", signinValidator, validate, authController.signin);

//Verifying email
// router.post(
//   "/emailvalidator",
//   emailValidator,
//   validate,
//   authController.sendCode
// );

//Verifying User
router.post(
  "/verify-user",
  verifyUserValidator,
  validate,
  authController.verifyUser
);

//Code for sending forgot password
router.post("/forgot-password-code", emailValidator, validate, authController.forgotPasswordCode);

//Route for recovering password
router.post("/recover-password", recoverPasswordValidator, validate, authController.recoverPassword);

// Initiating Google OAuth login
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Handling Google OAuth callback
router.get("/google/callback",
  passport.authenticate("google", { failureRedirect: "/auth/signup" }),
  authController.passportAuth // Redirects after success
);
//User is logged in and want to change password
router.put("/change-password", isAuth, authController.changePassword );

router.put("/update-profile", isAuth, updateProfileValidator, validate, authController.updateProfile);

//Get current user
router.get("/current-user", isAuth, authController.currentUser);

router.get("/verify-token", isAuth, authController.currentUser);

module.exports = router;
