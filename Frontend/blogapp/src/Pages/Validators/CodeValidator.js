const CodeValidator = ({ code }) => {
    let errors = {};
    if (!code) {
      errors.code = "Code is required";
    }
    return errors;
  };
  
export default CodeValidator;