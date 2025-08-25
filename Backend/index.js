const cookieParser = require("cookie-parser");
const express=require("express");
const dbConnection = require("./config/dbConnection");
const userRoute = require("./routes/user.route");
const http=require("http");
const advRouter = require("./routes/advertisement.route");
const cors = require('cors');
const { Server } = require("socket.io");
const emailRouter = require("./routes/email.route");
const messageRouter = require("./routes/message.route");
require("dotenv").config()
const app=express();
const server=http.createServer(app);
const io=new Server(server, {
    cors:{
        origin:"http://localhost:5173",
        credentials: true,
        methods:["GET", "POST"]
    }
})
io.on("connection", (socket)=>{
    console.log("New user Connected!!", socket.id);
}) 
app.use((req, res, next)=>{
    req.io=io;
    next();
})
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:5173",  
  credentials: true                 
}))
app.use(express.json())
app.use(express.urlencoded({extended:true}))
const port=process.env.PORT;
app.use("/api/email", emailRouter)
app.use("/api/message", messageRouter)
app.use("/api/user", userRoute);
app.use("/api/advertisement", advRouter);
server.listen(port, async()=>{
    await dbConnection()
    console.log(`Server is running at localhost:${port}`)
})

