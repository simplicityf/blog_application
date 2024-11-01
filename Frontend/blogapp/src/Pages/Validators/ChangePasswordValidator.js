
const isPassword = (password) => password.match(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/);

const ChangePasswordValidator = ({oldPassword, newPassword}) => {

const errors = {
    oldPassword: '',
    newPassword: '',
    
}

if(!newPassword) {
    errors.newPassword = 'Password is required'
} else if (!isPassword(newPassword)) {
    errors.newPassword = 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character'
}
if(!oldPassword) {
    errors.oldPassword = 'Password is required'
} else if (!isPassword(oldPassword)) {
    errors.oldPassword = 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character'
}

if(oldPassword && oldPassword === newPassword) {
    errors.newPassword = 'You are providing old password'
}

    return errors;
}

export default ChangePasswordValidator
