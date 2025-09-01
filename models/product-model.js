const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, default: 0 },
    description: { type: String, default: "" },
    image: { type: Buffer },
    bgcolor: { type: String, default: "#f3f4f6" },
    panelcolor: { type: String, default: "#fff" },
    textcolor: { type: String, default: "#222" }
});

module.exports = mongoose.model('Product', productSchema);