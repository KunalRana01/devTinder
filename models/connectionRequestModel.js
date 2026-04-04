const mongoose = require("mongoose");

const {Schema}  = mongoose;

const connectionRequestSchema = new Schema ({

    fromUserId : {
        type : mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"user"
    },
    toUserId :{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:"user"
    },
    status : {
        type:String,
        required: true,
        enum : {
            values : ["interested" , "ignore" , "accepted" , "rejected"],
            message : `{VALUE} is incorrect status type`
        }
    }


} , {timestamps:true});

//Make queries faster for both fromUserId and toUserId fields...
connectionRequestSchema.index({fromUserId : 1 , toUserId : 1});

const ConnectionRequest = mongoose.model("ConnectionRequest" ,  connectionRequestSchema);

module.exports = ConnectionRequest;