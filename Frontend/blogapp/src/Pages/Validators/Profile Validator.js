


const isEmail = (email) => String(email).toLowerCase().match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/);

// const isPassword = (password) => password.match(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/);

const ProfileValidator = ({name, email}) => {

const errors = {
    name: '',
    email: '',
    
}

if(!name) {
    errors.name = 'Name is required'
}

if(!email){
errors.email = 'Email is required'
} else if (!isEmail(email)) {
    errors.email = 'Invalid email format'
}

// if(!password) {
//     errors.password = 'Password is required'
// } else if (!isPassword(password)) {
//     errors.password = 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character'
// }

// if(password!== confirmPassword) {
//     errors.confirmPassword = 'Passwords do not match'
// }

    return errors;
}

export default ProfileValidator
