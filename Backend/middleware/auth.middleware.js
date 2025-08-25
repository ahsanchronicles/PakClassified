const jwt = require("jsonwebtoken");
const auth=(req, res, next)=>{
    const cookiee= process.env.myCookie;
const token= req.cookies[cookiee];
if(!token){
    res.status(401).json({
  success: true,
  warning: "Login required!",
});
    return
}
try{    
    const decoded= jwt.verify(token, process.env.mySecret);
    req.user=decoded;
    next();
    return
}
catch(err){
    res.status(403).json({message:"Invalid token!"})
}
}
module.exports=auth;