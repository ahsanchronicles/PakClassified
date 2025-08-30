const mongoose=require("mongoose");
const bcrypt=require("bcrypt")
const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const messageModel = require("../models/Message.model");
const { createIntent, finalGPTResponse } = require("../util/gpt");

class UserClass{
        createUser= async(req, res)=>{
  try{  
  const {name, email, password, birthDate, sequrityQuestion, sequrityAnswer, contact, image}=req.body;
  const checkUser= await userModel.findOne({email});
  if(checkUser){
      res.status(409).json({message:"User with this email already exist."})
      return
  }
  if(name &&  email && password && birthDate && sequrityQuestion && sequrityAnswer && contact && image){
      const hashPassword= await bcrypt.hash(password, 10);
    const user= await userModel.create({name, email, password:hashPassword, birthDate, sequrityQuestion, sequrityAnswer, contact, image});

    const payLoad={
      id: user._id,
    name:user.name,
    email:user.email,
    image:user.image
  }
    const token= jwt.sign(payLoad, process.env.mySecret, {expiresIn:"1d"});
      res.cookie(process.env.myCookie, token)
    res.status(201).json({message:"User created successully",token:token, payLoad:payLoad});
    return
  }
  else{
      res.status(400).json({ message: "Required fields are missing" });
  }
  }
  catch(err){
      console.log("Error: "+ err.message)
      res.status(500).json({message:"Internal server error."})
  }
      }

    findUserById=async(req, res)=>{
   try{
    
    const id=req.params.id;
      const user=await userModel.findById(id, "name email contact sequrityQuestion birthDate image")
      if(!user){
        res.status(404).json({message:`User not found with this id ${id}`})
        return
      }else{
     
        res.status(200).json({message:"User found.", user:user})
      }

   }
   catch(err){
    console.log("Error: "+err.message);
    res.status(500).json({message:"Internal server error."})
   }
    }

findUserByIdAndUpdate = async (req, res) => {
  try {
    const id = req.params.id;
    const { name, email, birthDate, sequrityQuestion, sequrityAnswer, contact, image } = req.body;
    const changedData={}
const oldUserData=await userModel.findById(id).lean();
    const user = await userModel.findByIdAndUpdate(
      id,
      { name, email, birthDate, sequrityQuestion, sequrityAnswer, contact, image },
      { new: true }
    );

    if (!user) {
     
      // const Reply= await finalGPTResponse(`Backend response: No user found, it looks user is not login`)
      // // Save GPT message in DB
      // await messageModel.create({
      //   userId: id,
      //   text: Reply.reply,
      //   sender: "gpt",
      //   status: "processed"
      // });
      return res.status(404).json({ message: Reply });
    }
if(oldUserData.name != user.name) changedData.name={old:oldUserData.name, new:user.name}
if(oldUserData.image != user.image) changedData.image={old:oldUserData.image, new:user.image }
if(oldUserData.contact != user.contact) changedData.contact={old:oldUserData.contact, new:user.contact }
if(oldUserData.birthDate != user.birthDate) changedData.birthDate={old:oldUserData.birthDate, new:user.birthDate}
    const safeData = {
      name: user.name,
      email: user.email,
      sequrityQuestion: user.sequrityQuestion,
      birthDate: user.birthDate,
      _id: user._id,
      contact: user.contact,
      image: user.image,
    };

  // const Reply= await finalGPTResponse(`Backend response: User profile Changed successfully, changed fields: ${JSON.stringify(changedData)}`)

  //   // Save GPT message in DB
  //   await messageModel.create({
  //     userId: user._id,
  //     text: Reply.reply,
  //     sender: "gpt",
  //     status: "processed"
  //   });

    res.status(200).json({ message: Reply, user: safeData });
  } catch (err) {
    console.log("Error: " + err.message);
  const Reply= await finalGPTResponse(`Backend response: Failed to update user profile, internal server error`)

    if (req.params.id) {
      await messageModel.create({
        userId: req.params.id,
        text: Reply.reply,
        sender: "gpt",
        status: "failed"
      });
    }

    res.status(500).json({ message: Reply });
  }
};
findUserByEmail=async (req, res)=>{
  try{
const {email}=req.body;
const user= await userModel.findOne({email});
if(!user){
  res.status(404).json({message:"No user found"})
}else{
  res.status(200).json(user)
}
  }catch(err){
    console.log(err.message)
    res.status(500).send("Internal server error in find user by email")
  }
}
    deleteUser=async(req, res)=>{
    try{
      const id=req.params.id;
      const user=await userModel.findByIdAndDelete(id);
       if(user){
    res.status(201).json({message:"User deleted successully"});
    return
   }
   res.status(404).json({message:`User not found with this id ${id}`})
   }catch(err){
      console.log("Error: "+ err.message);
      res.status(500).json({message:"Internal server error."})
   }
  }
  updatePassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;

    const user = await userModel.findById(id);
    if (!user) return res.status(404).json({ message: "User not found." });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Current password is incorrect." });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password updated successfully." });
  } catch (err) {
    console.log("Error: " + err.message);
    res.status(500).json({ message: "Internal server error." });
  }
}
forogtUpdatePasswod=async (req, res)=>{
  try{
    console.log(req.body)
const {id, password}=req.body;
   if (!id || !password) {
      return res.status(400).json({ message: "ID and new password required" });
    }
      if (password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters long" });
    }
    
const hash= await bcrypt.hash(password, 10);
const updated=await userModel.findByIdAndUpdate(id, 
  { password: hash },
  { new: true, runValidators: true }
)
console.log("update", updated)

   if (!updated) {
      return res.status(404).json({ message: "User not found!" });
    }
    res.status(200).json({ message: "Password updated successfully!" });

  }catch(err){
    console.log(err.message)
    res.status(500).json({message:"Internal server error"})
  }
}
 logoutHandler = async (req, res) => {
  try {
   res.clearCookie(process.env.myCookie, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
    })
    res.status(200).json({ message: "Logout successful" });
  } catch (err) {
    console.log("Logout error", err);
    res.status(500).json({message:"Internal server error"})
  }
}


findAllusers=async(req, res)=>{
  try{
const users= await userModel.find({},"name email contact sequrityQuestion birthDate");
if(users && users.length>0){
  res.status(200).send({message:"Users found.", users:users})
  return  
}else{
  res.status(404).json({message:"Users not found"})
}
  }catch(err){
      console.log("Error: "+ err.message);
      res.status(500).json({message:"Internal server error."})
  }
}
loginUser=async(req, res)=>{
  try{
const {email, password}=req.body;
const user= await userModel.findOne({email});
if(!user){
return res.status(401).json({ message: "Incorrect email or password." });
}
const isValid=await bcrypt.compare(password, user.password);
const payLoad={
  id: user._id,
  name:user.name,
  email:user.email,
  dob:user.birthDate,
  contact:user.contact,
  image:user.image
}

if(user && isValid){
    const token= jwt.sign(payLoad, process.env.mySecret, {expiresIn:"1d"});
    res.cookie(process.env.myCookie, token);
    res.status(200).json({message:"Login successfull", token:token, payLoad:payLoad})
}else{
return res.status(401).json({ message: "Incorrect email or password." });  
}

  }
  catch(err){
      console.log("Error: "+ err.message);
      res.status(500).json({message:"Internal server error."})
  }
}
}
const userObj= new UserClass();
module.exports=userObj;