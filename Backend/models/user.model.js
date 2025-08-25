const mongoose=require("mongoose")

const userSchema= mongoose.Schema({
    name:{
        type: String,
        required:true
    },
    email:{
        type:String,
        required:true,
    },
    image:{
        type:[String]
    },
    contact:{
        type:String,
        required:true
    },
    birthDate:{
        type:Date,
        
    },
    sequrityQuestion:{
        type:String
    },
    sequrityAnswer:{
        type:String
    },
    password:{
        type:String,
        required:true
    }
})
const userModel= mongoose.model("User", userSchema);
module.exports=userModel;