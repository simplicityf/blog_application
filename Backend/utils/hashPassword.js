const bcrypt = require("bcrypt");

const hashedPassword = (password) => {
    return new Promise((resolve, reject) => { //colling Promise function, which resolve i.e hashed our password or reject if there is error
        bcrypt.genSalt(12, (error, salt ) => { // The 12 is the lenght we want the password to be hashed into, we can put in any number we want, and it will return error if any, and then salt will be generated
            if(error) {
                return reject(error); // if an error occur, it will terminate the hashing process
            }
            bcrypt.hash(password, salt, (error, hash) => { // passing our password parameter to continue the process
                if(error) { 
                    return reject(error); // if error it will reject 
                }
                resolve(hash); // and if no error, our password will hashed successfully
            })
        });
        
    });
};

//Writing code for decrypting password in the database and comparing it to user raw password
const comparedPassword = (password, hashedPassword) => {
    return bcrypt.compare(password, hashedPassword).then(match => {
        return match;  // true if password matches, false otherwise
    }) 
    .catch(error => {
        console.error(error);
        return false;  // return false in case of an error
    });
}

// module.exports = hashedPassword;
module.exports = {comparedPassword, hashedPassword};

