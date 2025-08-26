const express=require('express');
const router=express.Router();
const ownerModel=require('../models/owner-model');

  if(process.env.NODE_ENV==="development"){
router.post('/create',async(req,res)=>{
 let owners=await ownerModel.find();
 if(owners.length>0) return res.status(503).send("You dont have permisiion to create");
 let{fullname,email,password}=req.body;
const createdOwner=await ownerModel.create({
fullname,
password,
email,
})
res.status(201).send("Owner created");
});
  }


router.get('/',(req,res)=>{
    res.send("hey");
});


module.exports=router;