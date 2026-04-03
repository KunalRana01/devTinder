const mongoose = require("mongoose");
const { __esModule } = require("validator/lib/isAlpha");

const {Schema}  = mongoose;

const connectionRequestSchema = new Schema ({

    fromUserId : {
        type : mongoose.Schema.Types.ObjectId,
        required:true
    },
    toUserId :{
        type: mongoose.Schema.Types.ObjectId,
        required: true
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