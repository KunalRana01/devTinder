const mongoose = require("mongoose");
const { Schema } = mongoose;
const validator = require("validator");

const userSchema = new Schema({
    firstname :{
        type:String,
        required:true,
        lowercase:true,
        trim:true,
        minLength : 4,
        maxLength : 50
    },
    lastname :{
        type:String,
        lowercase:true,
        trim:true,
        minLength: 4,
        maxLength: 50
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        maxLength: 40,
        validate : function(value){
            if(!validator.isEmail(value)){
                throw new Error("Error , invalid email address");
                return false;
            } 
            return true;
        }   
    },
    age : {
        type:Number,
        required:true,
        min : 18,
        max : 80
    },
    password:{
        type:String,
        required:true,
        trim:true,
        minLength:8,
        maxLength : 128,
        validate : function(value){
            if(!validator.isStrongPassword(value)){
                throw new Error ("Error : weak password , please create a strong password  !");
            }
            return true;
        }
    },
    gender:{
        type:String,
        lowercase: true,
        enum: ["male", "female", "others"]
    }
},{timestamps:true});

const user = mongoose.model('user', userSchema);

module.exports = user;