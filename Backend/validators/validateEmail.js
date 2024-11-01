const validateEmail = (email) => {
    // Regular expression to validate email format
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
    // Test the email against the regex pattern
    const result = email.match(regex);

    // If result is not null, email is valid
    return result !== null;
}

module.exports = validateEmail;