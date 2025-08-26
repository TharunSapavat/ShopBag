const mongoose=require('mongoose');

 
const ownerSchema=mongoose.Schema({
    fullname:String,
    password:String,
   email:String,
   contact:Number,
   products:{
    typeof:Array,
    default:[]
   },
picture:String,
gstin:String
})

module.exports=mongoose.model("owner",ownerSchema);