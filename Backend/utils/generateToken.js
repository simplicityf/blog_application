const jwt = require("jsonwebtoken");
const {jwtSecret} = require("../config/keys")
// console.log(jwtSecret);  // Debug to check if the key is correctly loaded

const generateToken = (user) => {
  // if (!jwtSecret) {
  //   throw new Error('JWT Secret is not defined');
  // }
  
  const token = jwt.sign(
    { _id: user._id, name: user.name, email: user.email, role: user.role },
    //The token that will be generated will come from user id, name, email and role
    jwtSecret,
    { expiresIn: "2d" }
    
  );
  return token; //It will return token
};

module.exports = generateToken;