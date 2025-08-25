const advModel = require("../models/advertisement.model");


class AdvertisementClass{
    createAdv=async(req, res)=>{
   try{
    const {name, price, description, features, startDate, endDate, category, city, type, img, sellerId}=req.body;
   if(typeof name !== 'string' || name.trim() === '') return res.status(400).json({ message: "Invalid name" });
if(typeof price !== 'number' || price < 0) return res.status(400).json({ message: "Invalid price" });
if(typeof category !== "string" || category.trim()==="") return res.status(400).json({ message: "Invalid category" });
if(typeof city !== "string" || city.trim()==="") return res.status(400).json({ message: "Invalid city" });
  if(!Array.isArray(img) || img.length === 0 || img.some(i => typeof i !== "string" || i.trim() === ""))
      return res.status(400).json({ message: "Invalid image array" });
if(typeof type !== "string" || type.trim()==="") return res.status(400).json({ message: "Invalid type" });
   const adv= await advModel.create({name:name.trim(), price, description:description.trim(), features, startDate, endDate, category:category.trim(), city:city.trim(), type:type.trim(), sellerId, img});
   if(adv){
   
    res.status(201).json({message:" Advertisement created successufully ", Advertisement:adv})
    return
   }
res.status(400).json({message:"Failed to create advertisement. "})
   }catch(err){
    console.log("Error: " + err.message);
    res.status(500).json({ message: " Internal server error. " });
   }
    }
      getCategoryCounts=async(req, res)=>{
          try{
          const result= await advModel.aggregate([
              {$group:{_id:"$category", count: {$sum:1}}}
          ])
          res.status(200).json(result);
          }
          catch(err){
              res.status(500).json({message:"Internal Server Error"})
          }
      }
    deleteAdv=async(req, res)=>{
        try{
            const id=req.params.id;
          const deleted= await advModel.findByIdAndDelete(id);
          if(deleted){
            res.status(200).json({message:"Product deleted"});
          }
          else{
            res.status(404).json({message:"Adv not found"});
          }
        }
        catch(err){
            res.status(500).json({message:"Internal server error"})
            console.log(err)
            
        }
    }
   getByIdAndUpdateAdv = async (req, res) => {
  try {
    const id = req.params.id;

    const updated = await advModel.findByIdAndUpdate(id, req.body, {
      new: true,        

    })
    if (!updated) {
      return res.status(404).json({ message: "Advertisement not found" });
    }

    res.status(200).json({ message: "Advertisement updated successfully", updated });
  } catch (err) {
    res.status(500).json({ message: "Internal server error.", error: err.message });
  }
};

    getAdv=async(req, res)=>{
        try{
            const filtered={};
           if(req.query.id) filtered._id=req.query.id;
            if(req.query.sellerId) filtered.sellerId=req.query.sellerId;
            if(req.query.city) filtered.city=req.query.city;
            if(req.query.name) filtered.name={ $regex: req.query.name, $options: 'i' };
            if(req.query.category) filtered.category=req.query.category;
        let query= advModel.find(filtered);
        if(req.query.sort==="desc"){
            query=query.sort({createdAt:-1});
        }
        if(req.query.limit){
            query=query.limit(parseInt(req.query.limit))
        }
         const adv=await query;
        if(adv && adv.length>0){
            res.status(200).json({message:"Advertisement found", Advertisements:adv})
            return
        }
        res.status(404).json({message:"No Advertisement found."})
        return
        }catch(err){
    res.status(500).json({ message: "Internal server error.", Error:err.message });
   }
    }
}
const advObj=new AdvertisementClass();
module.exports=advObj;