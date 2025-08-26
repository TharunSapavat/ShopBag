const mongoose=require('mongoose');
const config=require("config");
const dbgr=require("debug")("development:mongoose");


mongoose.connect(`${config.get("MONGODB_URI")}/ShopBag`)
.then(function(){
    dbgr("mongoose connected successfullly ")})
.catch(function(error){
       dbgr("error connecting mongoose",error.message)});

module.exports=mongoose.connection;