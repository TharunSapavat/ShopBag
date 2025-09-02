const express = require('express');
const router = express.Router();
const productModel = require('../models/product-model'); // adjust path if needed
const isloggedin=require("../middlewares/isloggedin");
router.get('/', (req, res) => {
    let error = req.flash("error");
    res.render("index", { error });
});

router.get('/shop',isloggedin,async (req, res) => {
    try {
        const products = await productModel.find(); // fetch products from DB
        res.render('shop', { products }); // pass products to template
    } catch (err) {
        res.render('shop', { products: [] }); // fallback to empty array
    }
});
 
router.get('/logout',isloggedin,(req,res)=>{
    res.render("shop");
})

module.exports = router;