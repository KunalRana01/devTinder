const validator = require("validator");

function validateSignUpData(req){

    let { firstname, email, password } = req.body;

    if(!firstname){
        throw new Error("First name is required");
    }else if(!validator.isEmail(email)){
        throw new Error("Please enter a valid email");
    }else if(!validator.isStrongPassword(password)){
        throw new Error("Please choose a strong password");
    }

}

module.exports = {
    validateSignUpData
}