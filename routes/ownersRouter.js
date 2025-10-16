const express=require('express');
const router=express.Router();
const ownerModel=require('../models/owner-model');
const productModel = require('../models/product-model');
const userModel = require('../models/user-model');
const isAdmin = require('../middlewares/isAdmin');
const isFullAdmin = require('../middlewares/isFullAdmin');

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
router.get('/admin', isAdmin, async (req, res) => {
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
            totalRevenue,
            currentUser: req.user // Pass current user to check role
        });
    } catch (error) {
        console.error('Error:', error);
        res.render('admin', { 
            success: '',
            totalProducts: 0,
            totalUsers: 0,
            totalOrders: 0,
            totalRevenue: 0,
            currentUser: req.user
        });
    }
});

router.get('/',(req,res)=>{
    res.send("hey");
});
router.get('/create-product', isAdmin, (req,res)=>{
  const success = req.flash("success") || '';
  res.render("createproducts", { 
    success,
    currentUser: req.user 
  });
})

// View all products
router.get('/products', isAdmin, async (req, res) => {
    try {
        const products = await productModel.find();
        res.render('products', { 
            products,
            currentUser: req.user
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.render('products', { 
            products: [],
            currentUser: req.user
        });
    }
});

// Delete product
router.post('/delete-product/:id', isAdmin, async (req, res) => {
    try {
        await productModel.findByIdAndDelete(req.params.id);
        req.flash('success', 'Product deleted successfully');
        res.redirect('/owners/products');
    } catch (error) {
        req.flash('error', 'Failed to delete product');
        res.redirect('/owners/products');
    }
});

// View all users - FULL ADMIN ONLY
router.get('/users', isFullAdmin, async (req, res) => {
    try {
        const users = await userModel.find().select('-password');
        res.render('users', { 
            users,
            currentUser: req.user // Pass current admin user
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.render('users', { 
            users: [],
            currentUser: req.user
        });
    }
});

// Make user co-admin - FULL ADMIN ONLY
router.post('/make-coadmin/:id', isFullAdmin, async (req, res) => {
    try {
        await userModel.findByIdAndUpdate(req.params.id, { role: 'co-admin' });
        req.flash('success', 'User promoted to co-admin');
        res.redirect('/owners/users');
    } catch (error) {
        req.flash('error', 'Failed to update user role');
        res.redirect('/owners/users');
    }
});

// Make user admin - FULL ADMIN ONLY
router.post('/make-admin/:id', isFullAdmin, async (req, res) => {
    try {
        await userModel.findByIdAndUpdate(req.params.id, { role: 'admin' });
        req.flash('success', 'User promoted to admin');
        res.redirect('/owners/users');
    } catch (error) {
        req.flash('error', 'Failed to update user role');
        res.redirect('/owners/users');
    }
});

// Remove admin/co-admin role - FULL ADMIN ONLY
router.post('/remove-admin/:id', isFullAdmin, async (req, res) => {
    try {
        // Prevent admin from removing their own admin role
        if (req.params.id === req.user._id.toString()) {
            req.flash('error', 'You cannot remove your own admin role');
            return res.redirect('/owners/users');
        }
        
        await userModel.findByIdAndUpdate(req.params.id, { role: 'user' });
        req.flash('success', 'Admin privileges removed');
        res.redirect('/owners/users');
    } catch (error) {
        req.flash('error', 'Failed to update user role');
        res.redirect('/owners/users');
    }
});

// Delete user - FULL ADMIN ONLY
router.post('/delete-user/:id', isFullAdmin, async (req, res) => {
    try {
        // Prevent admin from deleting themselves
        if (req.params.id === req.user._id.toString()) {
            req.flash('error', 'You cannot delete your own account from here');
            return res.redirect('/owners/users');
        }
        
        await userModel.findByIdAndDelete(req.params.id);
        req.flash('success', 'User deleted successfully');
        res.redirect('/owners/users');
    } catch (error) {
        req.flash('error', 'Failed to delete user');
        res.redirect('/owners/users');
    }
});


module.exports=router;