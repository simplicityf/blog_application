const { User, File } = require("../models");
//Importing our hashed password
const { hashedPassword, comparedPassword } = require("../utils/hashPassword");
const generateToken = require("../utils/generateToken"); // Importing our generateToken file
const generateCode = require("../utils/generateCode");
const sendMail = require("../utils/sendEmail");
const {jwtSecret } = require("../config/keys");
const jwt = require('jsonwebtoken');
//Designing signup route

const signup = async (req, res, next) => {
  try {
      const { name, email, password } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
          return res.status(400).json({ message: "Email is already registered" });
      }

      const googleId = generateCode(22)

      // Create a new user instance (do not save yet)
      const hashedPass = await hashedPassword(password);
      const user = new User({
          name,
          email,
          password: hashedPass,
          isVerified: false,
          googleId,
      });

      // Generate a verification code
      const code = generateCode(6);
      user.verificationCode = code;

      // Attempt to send the verification email
      try {
          await sendMail({
              emailTo: user.email,
              subject: "Verify your Email",
              code,
              content: "Please verify your email to complete registration",
          });

          // Save the user to the DB only if the email was sent successfully
          await user.save();

          return res.status(200).json({
              message: "Signup successful. Please check your email for verification.",
              data: user
          });
      } catch (emailError) {
          // Log the email error and do not save the user
          console.error('Error sending verification email:', emailError);
          return res.status(500).json({ message: 'Error sending verification email. Please try again.' });
      }
  } catch (error) {
      next(error); // Pass the error to the error handling middleware
  }
}; 

const signin = async (req, res, next) => {
  try {
    const { email, password } = req.body; //Collect email and password from the request body
    const user = await User.findOne({ email }); //Find user by email
    if (!user) {
      return res.status(401).send("Invalid Credential"); //Return error if user not found
    }
    const isMatch = await comparedPassword(password, user.password); //Compare the entered password with the stored hashpassword
    if (!isMatch) {
      return res.status(401).send("Invalid Credential"); //Return error is password not match
    }
    const token = generateToken(user); //Generate a token using the user's id
    res.status(200).json({
      code: 200,
      staus: true,
      message: "You are successfully logged in",
      data: { token, user }, //Send back the token
    }); // If both email and password is correct, the user is successfully logged in
  } catch (error) {
    next(error);
  }
};

// const sendCode = async (req, res, next) => {
//   try {
//     const { email } = req.body;
//     const user = await User.findOne({ email }); //Go into the database to search for user email

//     if (!user) {
//       res.code = 401;
//       res.send("Invalid Credential");
//       throw new Error("Invalid Credential"); //If email doesn't match the one in the database, the it will throw an erro
//     }
//     if (user.isverified) {
//       return res.status(400).json({ message: "User Not Found" }); //After checking the user, we check if the user is verified
//     }
//     const code = generateCode(6); // A code will the generated, looping through 0-6
//     user.verificationCode = code; //the verification code will be saved in the DB, and once the code is verified, it will be removed
//     await user.save();
//     await sendMail({
//       emailTo: user.email,
//       subject: "Email Verification Code",
//       code,
//       content: "Verify your account",
//     });
//     res.status(200).json({
//       code: 200,
//       status: true,
//       message: "Code has been sent to your gmail",
//     }); //User will be saved successfully
//   } catch (error) {
//     next(error);
//   }
// };

const verifyUser = async (req, res, next) => {
  try {
    const { email, code } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Check if the code matches
    if (user.verificationCode !== code) {
      return res.status(400).json({ message: "Invalid verification code" });
    }

    // Mark user as verified and clear the verification code
    user.isVerified = true;
    user.verificationCode = null;

    await user.save();

    return res.status(200).json({ message: "User verified successfully" });
  } catch (error) {
    console.error("Verification error:", error); // Log the error for debugging
    return res
      .status(500)
      .json({ message: "An error occurred during verification." }); // Send a structured error response
  }
};

const forgotPasswordCode = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User Not Found" });
    }

    const code = generateCode(6);
    user.forgotPasswordCode = code;

    await user.save(); // Error likely happens here if schema or data is invalid

    await sendMail({
      emailTo: user.email,
      subject: "Forgot Password Code",
      code,
      content: "Reset your password",
    });

    return res.status(200).json({
      message: "Reset Password Code has been sent to your Gmail",
    });
  } catch (error) {
    return next(error);
  }
};

const recoverPassword = async (req, res, next) => {
  try {
    const { email, code, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      res.code = 400;
      throw new Error("User Not Found");
    }
    if (user.forgotPasswordCode !== code) {
      res.code = 400;
      throw new Error("Invalid code provided");
    }

    const hashedPass = await hashedPassword(password);
    user.password = hashedPass;
    user.forgotPasswordCode = null;

    await user.save();

    res.status(200).json({
      code: 200,
      status: true,
      message: "Password has been changed successfully",
    });
  } catch (error) {
    next(error);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body; // Get old and new passwords from request body

    // Check if the old password and new password are provided
    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        code: 400,
        status: false,
        message: "Old and new passwords are required.",
      });
    }

    const { _id } = req.user; // Assuming the user is already set in req.user by some auth middleware
    const user = await User.findById(_id); // Find the user by their ID

    if (!user) {
      return res
        .status(404)
        .json({ code: 404, status: false, message: "User not found." });
    }

    // Validate the old password
    const isMatch = await comparedPassword(oldPassword, user.password); // Compare with hashed password
    if (!isMatch) {
      return res.status(401).json({
        code: 401,
        status: false,
        message: "Old password is incorrect.",
      });
    }

    // Hash the new password
    const hashedNewPassword = await hashedPassword(newPassword); // Hash the new password

    // Update the user's password in the database
    user.password = hashedNewPassword; // Update password in user object
    await user.save(); // Save changes to the database

    res.status(200).json({
      code: 200,
      status: true,
      message: "Password changed successfully",
      data: { user }, // Send back the updated user object (optional)
    });
  } catch (error) {
    next(error); // Handle any errors that occur
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const { name, email, file } = req.body;

    // Log incoming request data
    console.log("Request Body:", req.body);

    const user = await User.findById({ _id }).select(
      "-password -verificationCode -forgotPasswordCode"
    );

    if (!user) {
      req.code = 404;
      throw new Error("User not found");
    }

    // Check if email has been updated
    if (email && email !== user.email) {
      // Generate new verification code
      const code = generateCode(6);
      user.verificationCode = code;
      user.isVerified = false;

      // Send verification email to the new email address
      await sendMail({
        emailTo: email, // Send to the new email, not the old one
        subject: "Verify your new email",
        code,
        content: "Please verify your new email to complete the update.",
      });
    }

    if (file) {
      const isFileExist = await File.findById(file);
      if (!isFileExist) {
        return res
          .status(404)
          .json({ code: 404, status: false, message: "File not found" });
      }
    }

    // Update user fields
    user.name = name ? name : user.name;
    user.email = email ? email : user.email;
    user.profilePic = file || user.profilePic;

    await user.save();

    res.status(200).json({
      code: 200,
      status: true,
      message: "Profile updated successfully. Please verify your new email.",
      data: { user },
    });
  } catch (error) {
    console.error("Update Profile Error:", error); // Log the error for debugging
    next(error);
  }
};

const currentUser = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const user = await User.findById(_id)
      .select("-password -verificationCode -forgotPasswordCode")
      .populate("profilePic");
    if (!user) {
      req.code = 404;
      throw new Error("User not found");
    }
    res.status(200).json({
      code: 200,
      status: true,
      message: "User retrieved successfully",
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

const passportAuth = (req, res) => {
  const { user, token } = req.user; // Destructure user and token from req.user

  res.cookie("token", token, {
    httpOnly: true, // Prevent access to cookie via JavaScript
    secure: false, // Set to 'true' in production (HTTPS)
    sameSite: "Lax", // Protect against CSRF
  });

  res.redirect(`http://localhost:5173/post?token=${token}`);
};

const verifyToken = (req, res) => {
  const token = req.cookies.token; // Read token from cookies

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized, no token found' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, jwtSecret); // Ensure you have a valid secret

    return res.json({ success: true, user: decoded });
  } catch (error) {
    return res.status(401).json({ message: 'Token verification failed' });
  }
};


module.exports = {
  signup,
  signin,
  verifyUser,
  forgotPasswordCode,
  recoverPassword,
  changePassword,
  updateProfile,
  currentUser,
  passportAuth,
  verifyToken,
};
