const mongoose=require('mongoose');

const productSchema=mongoose.Schema({
    products:{
        typeof:Array,
        default:[]
    },
   image:String,
   name:String,
   price:Number,
   discount:{
    typeof:Number,
    default:0
   },
   bgcolor:String,
   panelcolor:String,
   textcolor:String
})


module.exports=mongoose.model("product",productSchema);