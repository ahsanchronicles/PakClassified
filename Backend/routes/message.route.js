const express = require("express")
const messageClassObj = require("../controller/message.controller")

const messageRouter= express.Router()
messageRouter.post("/", messageClassObj.createMessage);
messageRouter.get("/", messageClassObj.getAllMessage);
module.exports=messageRouter;