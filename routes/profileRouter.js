const express = require("express");
const bcrypt = require("bcrypt");
const validator = require("validator");
const router = express.Router();
const { authenticateUser } = require("../middlewares/auth");
const { fieldsAllowedToBeEdited } = require("../utils/validation.js");

router.get("/profile/view", authenticateUser, async (req, res) => {

    try {
        const user = req.user;
        return res.send(user);
    } catch (err) {
        res.status(400).send("Error : " + err.message);
    }

})


router.patch("/profile/edit", authenticateUser , async (req,res)=>{
    //validate the req body data...

    try{

        if (!fieldsAllowedToBeEdited(req)){
            return res.status(400).send("Invalid Edit Request");
        }
        const loggedInUser = req.user;
        Object.keys(req.body).forEach((key)=>loggedInUser[key] = req.body[key]);

        await loggedInUser.save();

        res.json({ message: `${loggedInUser.firstname} , your data updated successfully !`, data: loggedInUser });
        

    }catch(err){
        return res.status(400).send("Error : " +  err.message);

    }

})


router.patch("/profile/password" , authenticateUser , async (req,res)=>{

    try{

        const loggedInUser = req.user;
        const newPassword = req.body.password;

        //check for strong password...
        if (!validator.isStrongPassword(newPassword)){
            throw new Error();
        }

        const hashedPass = await bcrypt.hash(newPassword, 10);

        loggedInUser.password = hashedPass;
        await loggedInUser.save();
        return res.send("Password Updated Successfully !");

    }catch(err){
        return res.status(400).send("Please choose a strong password !");
    }
    




});

module.exports = router;
