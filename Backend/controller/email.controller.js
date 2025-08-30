const nodemailer=require("nodemailer");
const otpModel = require("../models/OTP.model");
const userModel = require("../models/user.model");
class EmailClass{
   async sendEmail(req, res){
        try{
const {name, email, subject, message}=req.body;
if(!name || !email || !subject || !message){
    return res.status(400).json({ message: "Incomplete detail" });
}
const transporter = nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASS
    }
});
let mailOptions = {
    from: `"PakClassified Contact" ${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER,
    replyTo: email,
    subject: `PakClassified Inquiry - ${subject}`,
    html: `
        <h2>📩 New Inquiry from PakClassified</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <blockquote style="background:#f4f4f4;padding:10px;border-left:4px solid #2196F3;">
            ${message}
        </blockquote>
        <hr/>
        <p style="font-size:12px;color:#777;">
            This message was sent via the PakClassified contact form.
        </p>
    `
};

await transporter.sendMail(mailOptions);
res.status(200).json({message:"Email sent successfully!"});
        }catch(err){
            console.log(err.message)
            console.log("Error in sending Email")
            res.status(500).json({message:"Failed to sent Email!"})
        }
    }
    async sendOTP(req, res) {
        try{
            const {email}=req.body;
            if(!email){
                console.log("Email not found")
                res.status(400).json({message:"Email not found"});
                return
            }
            const userAlreadyExist= await userModel.findOne({email});
            if(userAlreadyExist){
                console.log("User already exist")
               return res.status(409).json({message:"User with this email already exist"})
            }
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  const expiryTime= Date.now()+ 5 * 60 * 1000;
   await otpModel.deleteMany({ email });
     const otp= await otpModel.create({
        otpCode:otpCode, expireAt:expiryTime, email:email
     })
    const transporter= nodemailer.createTransport({
        service:"gmail",
        auth:{
            user:process.env.EMAIL_USER,
            pass:process.env.EMAIL_PASS
        }
        
    });
    await transporter.sendMail({
        from:process.env.EMAIL_USER,
        to:email,
        subject:"Your verification code for PakClassified",
        html:`
        <h2 style="color:#01B075;">Welcome to PakClassified!</h2>
<p>Hi,</p>
<p>You requested an OTP to verify your email. Please use the code below:</p>

<div style="background:#f0f0f0; padding:15px; text-align:center; font-size:30px; font-weight:bold; color:#01B075; border-radius:5px;">
  ${otpCode}
</div>
<p>This OTP will expire in <strong>5 minutes</strong>.</p>
<p style="color:red;">Do not share this OTP with anyone.</p>
<p>Thank you,<br />PakClassified Team</p>
        `
    }) 

res.status(200).send(otp)
 
        }catch(err){
            console.log("Error in send OTP")
            res.status(500).json({message:"Server error failed to send OTP"})
        }
    }

  async recoverOTP(req, res) {
        try{
            const {email}=req.body;
            if(!email){
                console.log("Email not found")
                res.status(400).json({message:"Email not found"});
                return
            }
            const noUserFound= await otpModel.findOne({email});
            if(!noUserFound){
                return res.status(404).json({message:"No user found with"})
            }
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  const expiryTime= Date.now()+ 5 * 60 * 1000;
   await otpModel.deleteMany({ email });
     const otp= await otpModel.create({
        otpCode:otpCode, expireAt:expiryTime, email:email
     })
    const transporter= nodemailer.createTransport({
        service:"gmail",
        auth:{
            user:process.env.EMAIL_USER,
            pass:process.env.EMAIL_PASS     
        }
        
    });
    await transporter.sendMail({
        from:process.env.EMAIL_USER,
        to:email,
        subject:"Your verification code for PakClassified",
        html:`
        <h2 style="color:#01B075;">Welcome to PakClassified!</h2>
<p>Hi,</p>
<p>You requested an OTP to verify your email. Please use the code below:</p>

<div style="background:#f0f0f0; padding:15px; text-align:center; font-size:30px; font-weight:bold; color:#01B075; border-radius:5px;">
  ${otpCode}
</div>
<p>This OTP will expire in <strong>5 minutes</strong>.</p>
<p style="color:red;">Do not share this OTP with anyone.</p>
<p>Thank you,<br />PakClassified Team</p>
        `
    }) 

res.status(200).send(otp)
 
        }catch(err){
            console.log("Error in send OTP")
            res.status(500).json({message:"Server error failed to send OTP"})
        }
    }

   async otpVerify(req, res){
        try{
const {email, otp}=req.body;
const check= await otpModel.findOne({email});
if(!check){
res.status(400).send("This email don't requested for otp");
return
}
const expireTime = new Date(check.expireAt).getTime();
if(check.otpCode == otp && expireTime > Date.now()){
res.status(200).json("Valid OTP")
return
}
res.status(401).json({ message: "Invalid or expired OTP", body:req.body, date:Date.now() })
      }catch(err){
            console.log(err)
            res.status(500).send("Internal server error at otp verification")
        }
    }       
}
const emailClassObj= new EmailClass();
module.exports=emailClassObj;