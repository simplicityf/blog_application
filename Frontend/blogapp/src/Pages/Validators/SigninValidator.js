
const SigninValidator = ({email, password}) => {

const errors = {
    email: '',
    password: '',
}


if(!email){
errors.email = 'Email is required'
} 

if(!password) {
    errors.password = 'Password is required'
} 


    return errors;
}

export default SigninValidator