const mongoose = require("mongoose");
const { Schema } = mongoose;

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
        maxLength: 40
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
        maxLength : 32
    },
    gender:{
        type:String,
        lowercase: true,
        validate (value){
            if(!["male" , "female" , "others"].includes(value)){
                return false;
            }
            return true;
        },
    }
},{timestamps:true});

const user = mongoose.model('user', userSchema);

module.exports = user;