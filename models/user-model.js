const mongoose=require('mongoose');

 
const userSchema=mongoose.Schema({
    fullname: String,
    password: String,
    email: String,
    contact: Number,
    cart: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
    }],
    orders: {
        type: Array,
        default: []
    },
  
    address: {
        street: String,
        city: String,
        state: String,
        pincode: String
    }
})

module.exports=mongoose.model("user",userSchema);