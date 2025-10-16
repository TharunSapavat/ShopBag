const userModel = require('../models/user-model');
const bcrypt=require("bcrypt");
const jwt = require('jsonwebtoken');
const {generateToken}=require("../utils/generatetoken");
const Joi = require('joi');


const validateUser = (user) => {
    const schema = Joi.object({
        fullname: Joi.string().min(3).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required()
    });
    return schema.validate(user);
}



module.exports.registerUser=async function(req,res){
 try {
        // Validate user input
        const { error } = validateUser(req.body);
        if (error) {
            req.flash('error', error.details[0].message);
            return res.redirect('/');
        }

        // Check if user exists
        const existingUser = await userModel.findOne({ email: req.body.email });
        if (existingUser) {
            req.flash('error', 'Email already registered');
            return res.redirect('/');
        }
//destructure
          const { email, fullname, password } = req.body;
//bcrypt
       bcrypt.genSalt(10,function(err,salt){
bcrypt.hash(password,salt,async function(err,hash){
     if(err) {
         req.flash('error', 'Something went wrong');
         return res.redirect('/');
     }
     else {
         const user = await userModel.create({
            email,
           password:hash,
            fullname
        });
     let token= generateToken(user);
      res.cookie("token",token);
      req.flash('success', 'Account created successfully!');
      res.redirect('/shop');
     }
});
       });

        // Create new user
       
    } catch (err) {
        req.flash('error', 'Something went wrong');
        res.redirect('/');
    }

};

module.exports.loginUser=async (req,res)=>{
let{email,password}=req.body;
let user=await userModel.findOne({email:email});
if(!user){
    req.flash('error','Invalid user name or password');
return  res.redirect('/');
}
 bcrypt.compare(password,user.password,function(err,result){
     if(result){
       let token= generateToken(user);
       res.cookie("token",token);
       
       // Role-based redirect
       if(user.role === 'admin' || user.role === 'co-admin'){
           res.redirect('/owners/admin');
       } else {
           res.redirect('/shop');
       }
     }
     else{
        req.flash("error","Invalid credentials");
        res.redirect('/');
     }
 })
};

module.exports.logout=async(req,res)=>{
   res.cookie("token","");
   res.redirect('/');
};

 