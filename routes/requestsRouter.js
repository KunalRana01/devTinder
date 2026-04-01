const express = require("express");
const router = express.Router();
const { authenticateUser } = require("../middlewares/auth");


router.post("/sendConnectionRequest", authenticateUser , async (req,res)=>{
    const user = req.user;
    res.send(user.firstname + "sent the connection request....");
});






module.exports = router;