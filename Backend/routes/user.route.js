const express=require("express");
const userObj = require("../controller/user.controller");
const auth = require("../middleware/auth.middleware");

const userRoute=express.Router();

userRoute.post("/register", userObj.createUser);
userRoute.post("/login",userObj.loginUser);
userRoute.get("/me", auth,(req, res) => {    
  res.json({ payLoad: req.user });
})
userRoute.get("/logout", userObj.logoutHandler);
userRoute.get("/all", userObj.findAllusers);
userRoute.get("/:id", userObj.findUserById);
userRoute.delete("/:id", userObj.deleteUser);
userRoute.put("/update/:id", userObj.findUserByIdAndUpdate)
userRoute.put("/update-password/:id", userObj.updatePassword);
module.exports=userRoute;