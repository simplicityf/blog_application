const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const {User} = require("../models"); // Assuming you have a User model
const { client_id_auth, client_secret_auth } = require("../config/keys");
const generateToken = require("../utils/generateToken"); // Importing our generateToken file

passport.use(
  new GoogleStrategy(
    {
      clientID: client_id_auth,
      clientSecret: client_secret_auth,
      callbackURL: "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if the user already exists in your DB
        let user = await User.findOne({ googleId: profile.id });
        
        if (user) {
          // Generate JWT token for the existing user
          const token = generateToken(user);
          
          // Return the user and token (but serialize only the user)
          return done(null, { user, token });
        }
        
        // If not, create a new user
        const newUser = new User({
          googleId: profile.id,
          name: profile.displayName,
          email: profile.emails[0].value,
          isVerified: true,
          profilePic: profile.photos && profile.photos.length > 0 ? profile.photos[0].value : null,
          password: "123456",  // No password for Google users
        });
        
        // Save the new user to the database
        user = await newUser.save();
        
        // Generate JWT token for the new user
        const token = generateToken(user);
        // Return the user and token (but serialize only the user)
        return done(null, { user, token });
      } catch (err) {
        return done(err, false);
      }
    }
  )
);


// Serialize user into session
passport.serializeUser((userObject, done) => {
  // Serialize  the user.id
  done(null, userObject.user._id);  //  userObject.user._id, because we passed { user, token } in the done callback
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);  // Find the user by ID in the database
    done(null, user);  // Return the user object
  } catch (err) {
    done(err, false);
  }
});