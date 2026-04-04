const express = require("express");
const router = express.Router();
const { authenticateUser } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequestModel");
const User = require("../models/userModel");

router.post("/request/send/:status/:toUserId", authenticateUser , async (req,res)=>{

    try{

        const fromUserId = req.user._id;
     
        const toUserId = req.params.toUserId;
     
        const status = req.params.status;

        const allowedStatus = ["interested" , "ignored"];
        
        if(!allowedStatus.includes(status)){
            return res.status(400).json({message : "Invalid statys type : " +  status});
        }

        //check whether the toUserId is a valid objectId
        const isToUserIdValid = await User.findById(toUserId);
        console.log(isToUserIdValid);

        if(!isToUserIdValid){
            throw new Error("Unknown error while sending the request , the user might not exist");
        }
        
        //Disallow user to send request to own
        if(fromUserId.toString() === toUserId){
            return res.status(400).json({
                message: "You cannot send a request to yourself"
            })
        }

        //Disallow bidirectional request...
        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or:[
                { fromUserId : fromUserId , toUserId: toUserId  },
                { fromUserId: toUserId, toUserId: fromUserId }
            ]

        });

        if (existingConnectionRequest) {
            throw new Error("Connection request already exists between these users");
        }


        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        })
        
        const data = await connectionRequest.save();

        return res.json({
            message : "Connection request sent successfully !",
            data
        })



    }catch(err){
        return res.status(400).json({
            error:err.message
        });
    }

});


router.post("/requests/review/:status/:requestId", authenticateUser , async (req,res)=>{

    try{    

        const loggedInUser = req.user._id;
        const {status , requestId} = req.params;

        const allowedStatus = ["accepted" , "rejected"];

        if (!allowedStatus.includes(status)){
            return res.status(400).json({
                message : "Invalid status request."
            })
        }

        //check if the requestId exists in the db..
        const connectionRequestExists = await ConnectionRequest.findOne({
            _id:requestId,
            toUserId : loggedInUser,
            status:"interested"
        })

        if(!connectionRequestExists){
            return res.status(400).json({
                message : "Connection request doesn't exist."
            })
        }


        connectionRequestExists.status = status;
        const data = await connectionRequestExists.save();

        res.json({
            message : `Connection request ${status}`,
            data
        })


    }catch(err){
        return res.json({
            error : err.message
        });
    }

})


module.exports = router;