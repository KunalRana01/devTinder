const express = require("express");
const app = express();
const port = process.env.PORT || 3000 ;
require("dotenv").config();
const {connectDB} = require("./config/database.js");
const User = require("./models/userModel.js");

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
    
    let {firstname , email , age , password , gender} = req.body;
    
    try{
        const user = new User({
            firstname,
            email,
            age,
            password,
            gender
        })

        await user.save();

        res.send("User creation success !");

    }catch(err){
        res.status(400).send(err.message);
    }
})




connectDB().then(() => {
    console.log("Database connection successfull...");
    app.listen(port, () => {
        console.log(`Server running at http://127.0.0.1:${port}`);
    })

}).catch((err) => {
    console.log(err.message)
    console.error("Database connection failure....");

});



