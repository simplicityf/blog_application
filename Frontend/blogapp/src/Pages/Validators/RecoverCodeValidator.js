const isPassword = (password) =>
  password.match(
    /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
  );

const RecoverPasswordCode = ({ code, password }) => {
  const errors = {
    code: "",
    password: "",
  };

  if (!code) {
    errors.email = "Code is required";
  }

  if (!password) {
    errors.password = "Password is required";
  } else if (!isPassword(password)) {
    errors.password =
      "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character";
  }

  return errors;
};

export default RecoverPasswordCode;
