const messageModel = require("../models/Message.model");
const { createIntent } = require("../util/gpt");


const messageClass=class Message{


  async createMessage(req, res) {
  try {
    const { userId, text } = req.body;
    const messageCreated = await messageModel.create({
      userId,
      text,
    });

    if (messageCreated) {
     const gptOutput=await createIntent(text, userId);
if(gptOutput.reply){
 await messageModel.create({
        userId,
        text: gptOutput.reply,
        sender: "gpt",
        intent: gptOutput.intent,
        status: "processed",
      });
}
     

      res.status(201).json({ success: true, reply: gptOutput.reply || "no reply", intent: gptOutput.intent, intent_value:gptOutput.intent_value });
      return;
    } else {
      res.status(400).json({ message: "Failed to send message" });
      return;
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  }
}
    async getAllMessage(req, res){
        try{
const messages= await messageModel.find();
if(messages){
   return res.status(200).json({messages:messages});
}
else{
   return res.status(404).json({message:"No message Found"})
}
        }catch(err){
            console.log(err)
            res.status(500).send("Internal server error")
        }
    }
}
const messageClassObj= new messageClass();
module.exports=messageClassObj;