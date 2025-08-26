const mongoose=require('mongoose');

 
const userSchema=mongoose.Schema({
    fullname:String,
    password:String,
   email:String,
   
   contact:Number,
   cart:{
    typeof:Array,
    default:[]
   },
   orders:{
    typeof:Array,
    default:[]
   },
picture:String,
})

module.exports=mongoose.model("user",userSchema);