// models/Message.js
const mongoose=require("mongoose")

const messageSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    sender:{
type:String,
enum:["user", "gpt"],
default:"user"
    },
    intent: {
      type: String,
      default: "unknown",
    },
    entities: {
      type: Object,
      default: {},
    },
    status: {
      type: String,
      enum: ["pending", "processed", "failed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const messageModel=mongoose.model("Message", messageSchema)
module.exports=messageModel;