const express = require("express");
const app = express();
const port = process.env.PORT || 3000 ;
require("dotenv").config();
const {connectDB} = require("./config/database.js");
const User = require("./models/userModel.js");
const { validateSignUpData } = require("./utils/validation.js");
const bcrypt = require("bcrypt");

app.use(express.json());


app.get("/feed" ,async (req,res)=>{

    try{
        let allUsers = await User.find();
        res.send(allUsers);
    }catch(err){
        res.status(404).send("Error getting all users....");
    }
});


app.post("/signup" , async (req,res)=>{
    
    
    
    try{
        //validate the data from the api
        validateSignUpData(req);

        //encrypt the pass
        const { firstname, email, age, password} = req.body;

        const hashedPass = await bcrypt.hash(password, 10);
        console.log(hashedPass);

        const user = new User({
            firstname,
            email,
            age,
            password: hashedPass
        })
        await user.save();
        res.send("User creation success !");

    }catch(err){
        res.status(400).send(err.message);
    }
})


app.post("/login" , async (req,res)=>{

    try{

        const{email,password} = req.body;

        //first check if the user exists already...

        let userExists = await User.findOne({email:email});

        if(!userExists){
            return res.status(404).send("User not registered , please register first...");
        }

        const result = await bcrypt.compare(password, userExists.password);

        if (!result) {
            return res.status(404).send("Username or password incorrect !");
        } else {
            return res.send("Login successfull !");
        }


    }catch(err){
        
    }

})


app.patch("/update" , async (req,res)=>{

    const userId = req.body.userId;
    const data = req.body;

    try{
        const user = await User.findById(userId);
        Object.assign(user,data);
        await user.save();
        return res.send(user);
    }catch(err){
        return res.status(400).send(err.message);
    }

});





connectDB().then(() => {
    console.log("Database connection successfull...");
    app.listen(port, () => {
        console.log(`Server running at http://127.0.0.1:${port}`);
    })

}).catch((err) => {
    console.log(err.message)
    console.error("Database connection failure....");

});



