


const isEmail = (email) => String(email).toLowerCase().match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/);


const SendCodeValidator = ({ email}) => {

const errors = {
   
    email: '',
    }



if(!email){
errors.email = 'Email is required'
} else if (!isEmail(email)) {
    errors.email = 'Invalid email format'
}


    return errors;
}

export default SendCodeValidator