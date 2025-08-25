const mongoose=require("mongoose");

const dbConnection=async()=>{
    try{
        await mongoose.connect(process.env.CONNECTION_STR);
        console.log("Connected to DB")
    }
catch(err){
    console.log("Failed to connect database")
    console.log(err.message)
}
}
module.exports=dbConnection