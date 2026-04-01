const express = require("express");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validateSignUpData } = require("../utils/validation");
const { authenticateUser } = require("../middlewares/auth");
const router = express.Router();


router.post("/signup", async (req, res) => {

    try {
        //validate the data from the api
        // validateSignUpData(req);

        //encrypt the pass
        const { firstname, email, age, password ,gender } = req.body;

        const hashedPass = await bcrypt.hash(password, 10);

        const user = new User({
            firstname,
            email,
            age,
            password: hashedPass,
            gender
        })
        await user.save();
        res.send("User creation success !");

    } catch (err) {
        res.status(400).send(err.message);
    }
})


router.post("/login", async (req, res) => {

    try {

        const { email, password } = req.body;

        //first check if the user exists already...

        let userExists = await User.findOne({ email: email });

        if (!userExists) {
            return res.status(404).send("User not registered , please register first...");
        }

        const result = await bcrypt.compare(password, userExists.password);

        if (!result) {
            return res.status(404).send("Username or password incorrect !");
        } else {

            const token = await jwt.sign({ _id: userExists._id }, process.env.JWT_SECRET);

            res.cookie("token", token, { expires: new Date(Date.now() + 900000) });
            return res.send("Login successfull !");
        }

    } catch (err) {
        res.send("Unknown Error");
    }

})

router.get("/logout" , authenticateUser , (req,res)=>{
    res.cookie("token" , "");
    return res.send("Logged Out Successfully...");
})  


module.exports = router;