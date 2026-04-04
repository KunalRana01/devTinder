const express = require("express");
const app = express();
const port = process.env.PORT || 3000 ;
require("dotenv").config();
const {connectDB} = require("./config/database.js");
const User = require("./models/userModel.js");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { validateSignUpData } = require("./utils/validation.js");
const { authenticateUser } = require("./middlewares/auth.js");
const authRouter = require("./routes/authRouter.js");
const profileRouter = require("./routes/profileRouter.js");
const requestsRouter = require("./routes/requestsRouter.js");
const userRouter = require("./routes/userRouter.js");


app.use(express.json());
app.use(cookieParser());


app.use("/" , authRouter);
app.use("/" , profileRouter);
app.use("/", requestsRouter);
app.use("/" , userRouter);


app.get("/feed" ,async (req,res)=>{

    try{
        let allUsers = await User.find();
        res.send(allUsers);
    }catch(err){
        res.status(404).send("Error getting all users....");
    }
});



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



