const mongoose =require("mongoose")
const advSchema=mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    sellerId:{
 type: mongoose.Schema.Types.ObjectId,
 required:true,
        ref:"user"
    },
    price:{
        type:Number,
        required:true,
        min:0
    },
    description:{
        type:String,
        trim:true
    },
    features:{
        type:[String],
        default:[]
    },
    startDate:{
        type:Date
    },
    endDate:{
        type:Date
    },
    category:{
        type:String,
        required:true,
        trim:true
    },
    city:{
        type:String,
        required:true,
        trim:true
    },
    type:{
        type:String,
        required:true
    },
    img:{
        type:[String],
        validate: v=>Array.isArray(v) && v.length>0,
        required:true
    }

},{timestamps:true})
const advModel=mongoose.model("Advertisement", advSchema);
module.exports=advModel;