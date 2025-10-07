const express=require('express');
const router=express.Router();
const ownerModel=require('../models/owner-model');
const productModel = require('../models/product-model');
const userModel = require('../models/user-model');

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
router.get('/admin', async (req, res) => {
    try {
        const totalProducts = await productModel.countDocuments();
        const totalUsers = await userModel.countDocuments();
        const totalOrders = 0; 
        const totalRevenue = 0;
        const success = req.flash("success") || '';
        
        res.render('admin', { 
            success,
            totalProducts,
            totalUsers,
            totalOrders,
            totalRevenue
        });
    } catch (error) {
        console.error('Error:', error);
        res.render('admin', { 
            success: '',
            totalProducts: 0,
            totalUsers: 0,
            totalOrders: 0,
            totalRevenue: 0
        });
    }
});

router.get('/',(req,res)=>{
    res.send("hey");
});
router.get('/create-product',(req,res)=>{
  const success = req.flash("success") || '';
  res.render("createproducts", { success });
})


module.exports=router;