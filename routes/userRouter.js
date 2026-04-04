const express = require("express");
const router = express.Router();
const { authenticateUser } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequestModel");

const USER_SAFE_DATA = "firstname lastname age gender photoUrl about";


router.get("/user/request/received", authenticateUser , async (req,res)=>{

    try{

        const loggedInUser = req.user;
        console.log("hi");
        const connectionRequests = await ConnectionRequest.find({
            toUserId : loggedInUser._id
        }).populate("fromUserId" , ["firstname" , "lastname" , "age" , "gender" , "photoUrl" , "about"]);

       
        return res.json({
            message : "Data fetched successfully",
            data: connectionRequests
        })

    }catch(err){
        return res.json({
            error:err.message
        })
    }

})

router.get("/user/request/connections", authenticateUser , async (req,res)=>{
    try{

        const loggedInUser = req.user;

        const connectionRequests = await ConnectionRequest.find({
            $or:[
                {toUserId : loggedInUser._id , status:"accepted"},
                {fromUserId : loggedInUser._id , status : "accepted"}
            ]

        }).populate("fromUserId", USER_SAFE_DATA).populate("toUserId" , USER_SAFE_DATA);

        const data = connectionRequests.map((row)=>{
            if(row.fromUserId._id.toString() === loggedInUser._id.toString()){
                return row.toUserId;
            }
            return row.fromUserId;
        });

        return res.json({
            data : connectionRequests
        });



    }catch(err){
        return res.json({
            error : err.message
        })
    }
});

module.exports = router;