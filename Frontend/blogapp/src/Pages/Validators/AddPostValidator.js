const AddPostValidator = ({desc, category}) => {
    const errors = { desc: "",
      category: "" };
    
  
    // Check if title is empty or undefined
    if (!desc) {
      errors.desc = "Description is required";
    }

    if (!category) {
        errors.category = "Category is required";
      }
  
    // Return errors object
    return errors;
  };
  
  export default AddPostValidator;
  