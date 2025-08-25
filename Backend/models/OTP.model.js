const mongoose=require("mongoose")
const otpSchema= mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    otpCode:{
        type:String,
        required:true
    },
    expireAt:{
     type: Date
    }

})
const otpModel= mongoose.model("OTP", otpSchema);
module.exports=otpModel;