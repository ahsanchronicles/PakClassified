const mongoose=require("mongoose")
const ticketSchema=mongoose.Schema({
    contact_number:{
        type:String,
        minlength: 11,
        maxlength: 11,
        required:true
    },
    intent:{
        type:String,
        required:true
    },
    user_message:{
        type:String,
        required:true
    },
    issue:{
        type:String,
        required:true
    },
    status:{
        type:String,
        enum:["open", "resolved", "escalated"],
        default:"open"
    },
mood: {
  type: String,
  enum: ["angry", "happy", "sad", "furious", "neutral"],
  default: "neutral"
},
troubleShoot_attempts:[{
    type:Object
}]
}, {timestamps:true})
const ticketModel= mongoose.model("Ticket",ticketSchema );
module.exports={
    ticketModel
}
