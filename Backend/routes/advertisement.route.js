const express= require("express");
const advObj = require("../controller/advertisement.controller");
const auth = require("../middleware/auth.middleware");

const advRouter= express.Router();
advRouter.post("/create", advObj.createAdv );
advRouter.get("/", advObj.getAdv);
advRouter.get("/category-count", advObj.getCategoryCounts);
advRouter.delete("/delete/:id", advObj.deleteAdv);
advRouter.put("/update/:id", advObj.getByIdAndUpdateAdv)
module.exports=advRouter;
