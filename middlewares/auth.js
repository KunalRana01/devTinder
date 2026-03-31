const jwt = require("jsonwebtoken");
const User = require("../models/userModel.js");

const authenticateUser = async (req,res,next)=>{

    try{
        const token = req.cookies?.token;

        if (!token) {
            return res.status(401).send("Invalid credentials , please login again.");
        } else {

            const decodedTokenObj = await jwt.verify(token, process.env.JWT_SECRET);

            const {_id} = decodedTokenObj;

            const user = await User.findById(_id);

            if(user){
                req.user = user;
                next();
            }else{
                return res.status(401).send("Error user not found....");
            }
            
        }
    }catch(err){
        return res.status(401).send("Error :" + err.message);
    }
}

module.exports = {
    authenticateUser
}
