const { validationResult } = require("express-validator");

const validate = (req, res, next) => {
  const errors = validationResult(req);
  let mappedErrors = {};

  if (Object.keys(errors.errors).length == 0) {
    // If there are no errors, move to the next middleware or route handler
    return next(); 
  } else {
    //if there is error
    // Map the validation errors to return a response of key and value
    errors.errors.map((error) => {
      mappedErrors[error.path] = error.msg;
    });
    // Return the error response with status 400 and the mapped errors as a JSON object
    return res.status(400).json(mappedErrors);
  }
};

module.exports = validate;
