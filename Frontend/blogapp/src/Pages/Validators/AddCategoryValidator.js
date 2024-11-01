const AddCategoryValidator = ({title}) => {
    const errors = { title: "" };
  
    // Check if title is empty or undefined
    if (!title) {
      errors.title = "Title is required";
    }
  
    // Return errors object
    return errors;
  };
  
  export default AddCategoryValidator;
  