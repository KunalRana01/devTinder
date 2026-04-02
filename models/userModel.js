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
        validate : function(value){
            if(!validator.isStrongPassword(value)){
                throw new Error ("Error : weak password , please create a strong password  !");
            }
            return true;
        }
    },
    about:{
        type:String,
        default:"This is the default about of the user",
        trim: true,
        minLength: 4,
        maxLength: 100
    },
    gender:{
        type:String,
        lowercase: true,
        enum: ["male", "female", "others"]
    },
    photoUrl:{
        type:String,
        lowercase:true,
        default: "https://img.icons8.com/?size=100&id=IerOpHeUt2OH&format=png&color=000000",
        validate : function(value){
            if (!validator.isURL(value)){
                return false;
            }
            return true;
        }
    }
},{timestamps:true});

const user = mongoose.model('user', userSchema);

module.exports = user;