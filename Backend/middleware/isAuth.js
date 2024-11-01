const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../config/keys");

const isAuth = async (req, res, next) => {
  try {
    let token;

    // Check if the token is in the 'Authorization' header (Bearer token)
    const authorization = req.headers.authorization;
    if (authorization && authorization.startsWith('Bearer ')) {
      token = authorization.split(" ")[1]; // Extract token from the Authorization header
    }
    
    // If no Authorization header, check if the token is in the query parameters
    else if (req.query.token) {
      token = req.query.token;  // Extract token from query parameter
    }
    
    // If no token found in either location, return error
    if (!token) {
      return res.status(401).send("Token is required");
    }

    // Verify the token with jwtSecret
    const payload = jwt.verify(token, jwtSecret);

    // Attach the user info from token payload to req.user
    req.user = {
      _id: payload._id,
      name: payload.name,
      email: payload.email,
      role: payload.role
    };

    // Proceed to the next middleware or route handler
    next();

  } catch (error) {
    return res.status(401).send("Invalid or expired token");
  }
};

module.exports = isAuth;
