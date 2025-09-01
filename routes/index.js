const express = require('express');
const router = express.Router();
const productModel = require('../models/product-model'); // adjust path if needed

router.get('/', (req, res) => {
    let error = req.flash("error");
    res.render("index", { error });
});

router.get('/shop', async (req, res) => {
    try {
        const products = await productModel.find(); // fetch products from DB
        res.render('shop', { products }); // pass products to template
    } catch (err) {
        res.render('shop', { products: [] }); // fallback to empty array
    }
});
 

module.exports = router;