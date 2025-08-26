const mongoose=require('mongoose');

 
const userSchema=mongoose.schema({
    fullname:String,
    password:String,
   email:String,
   isadmin:Boolean,
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