const express = require('express');
const router = express.Router();
const productModel = require('../models/product-model'); // adjust path if needed
const isloggedin=require("../middlewares/isloggedin");
const userModel = require('../models/user-model');
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');

// Configure multer for profile picture uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../public/images/profiles'));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: function (req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
    }
});
router.get('/', (req, res) => {
    let error = req.flash("error");
    res.render("index", { error,loggedin:false });
});

router.get('/addtocart/:productId', isloggedin, async(req, res) => {
    try {
        let user = await userModel.findOne({email: req.user.email});
        if (!user) {
            req.flash("error", "User not found");
            return res.redirect("/shop");
        }
        
        // Initialize cart array if it doesn't exist
        if (!user.cart) {
            user.cart = [];
        }
        
        // Add product to cart
        user.cart.push(req.params.productId);
        await user.save();
        
        req.flash("success", "Added to Cart");
        res.redirect("/shop");
    } catch (err) {
        console.error(err);
        req.flash("error", "Failed to add to cart");
        res.redirect("/shop");
    }
});

// Cart page
// Increase quantity
router.get('/cart/increase/:productId', isloggedin, async (req, res) => {
    try {
        const user = await userModel.findOne({ email: req.user.email });
        user.cart.push(req.params.productId);
        await user.save();
        res.redirect('/cart');
    } catch (err) {
        console.error(err);
        res.redirect('/cart');
    }
});

// Decrease quantity
router.get('/cart/decrease/:productId', isloggedin, async (req, res) => {
    try {
        const user = await userModel.findOne({ email: req.user.email });
        const index = user.cart.indexOf(req.params.productId);
        if (index > -1) {
            user.cart.splice(index, 1);
            await user.save();
        }
        res.redirect('/cart');
    } catch (err) {
        console.error(err);
        res.redirect('/cart');
    }
});

// Remove from cart
router.get('/cart/remove/:productId', isloggedin, async (req, res) => {
    try {
        const user = await userModel.findOne({ email: req.user.email });
        user.cart = user.cart.filter(id => id.toString() !== req.params.productId);
        await user.save();
        res.redirect('/cart');
    } catch (err) {
        console.error(err);
        res.redirect('/cart');
    }
});

router.get('/cart', isloggedin, async (req, res) => {
    try {
        const user = await userModel.findOne({ email: req.user.email })
            .populate('cart');

        // Group items and count quantities
        const itemCounts = {};
        user.cart.forEach(item => {
            const id = item._id.toString();
            if (!itemCounts[id]) {
                itemCounts[id] = {
                    ...item.toObject(),
                    quantity: 1
                };
            } else {
                itemCounts[id].quantity += 1;
            }
        });

        const cartItems = Object.values(itemCounts);
        const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        res.render('cart', { 
            cartItems,
            total,
            isLoggedIn: true
        });
    } catch (err) {
        console.error(err);
        res.render('cart', { 
            cartItems: [],
            isLoggedIn: true
        });
    }
});

 

router.get('/shop', isloggedin, async (req, res) => {
    try {
        const products = await productModel.find();
        const success = req.flash('success');
        res.render('shop', { 
            products,
            success: success || '',
            isLoggedIn: true
        });
    } catch (err) {
        res.render('shop', { 
            products: [],
            success: '',
            isLoggedIn: true
        });
    }
});
 
router.get('/logout',isloggedin,(req,res)=>{
    res.render("shop");
});

router.get('/cart', isloggedin, async (req, res) => {
   let user = await userModel.findOne({email:req.user.email}).populate("cart");
   
   res.render("cart",{user});
});

// Account routes
router.get('/account', isloggedin, async (req, res) => {
    try {
        const user = await userModel.findOne({ email: req.user.email });
        res.render('account', { 
            user,
            success: req.flash('success'),
            error: req.flash('error'),
            isLoggedIn: true
        });
    } catch (err) {
        console.error(err);
        req.flash('error', 'Failed to load account information');
        res.redirect('/shop');
    }
});

// Update profile picture
router.post('/account/update-picture', isloggedin, upload.single('profilePicture'), async (req, res) => {
    try {
        if (!req.file) {
            req.flash('error', 'Please select an image');
            return res.redirect('/account');
        }

        const user = await userModel.findOne({ email: req.user.email });
        // Store the path relative to public directory
        user.picture = '/images/profiles/' + req.file.filename;
        await user.save();

        req.flash('success', 'Profile picture updated successfully');
        res.redirect('/account');
    } catch (err) {
        console.error(err);
        if (err.message === 'Only image files are allowed!') {
            req.flash('error', err.message);
        } else {
            req.flash('error', 'Failed to update profile picture');
        }
        res.redirect('/account');
    }
});

// Update address
router.post('/account/update-address', isloggedin, async (req, res) => {
    try {
        const { street, city, state, pincode } = req.body;
        
        const user = await userModel.findOne({ email: req.user.email });
        user.address = { street, city, state, pincode };
        await user.save();

        req.flash('success', 'Address updated successfully');
        res.redirect('/account');
    } catch (err) {
        console.error(err);
        req.flash('error', 'Failed to update address');
        res.redirect('/account');
    }
});

module.exports = router;