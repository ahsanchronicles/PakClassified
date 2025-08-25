const express= require("express");
const emailClassObj = require("../controller/email.controller");
const emailRouter=express.Router();

emailRouter.post("/", emailClassObj.sendEmail);
emailRouter.post("/otp", emailClassObj.sendOTP);
emailRouter.post("/otp-verify", emailClassObj.otpVerify);
module.exports=emailRouter;