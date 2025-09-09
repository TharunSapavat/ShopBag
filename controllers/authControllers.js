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
            return res.render('index', { error: error.details[0].message });
        }

        // Check if user exists
        const existingUser = await userModel.findOne({ email: req.body.email });
        if (existingUser) {
            return res.render('index', { error: 'Email already registered' });
        }
//destructure
          const { email, fullname, password } = req.body;
//bcrypt
       bcrypt.genSalt(10,function(err,salt){
bcrypt.hash(password,salt,async function(err,hash){
     if(err) return res.send(err.message);
     else {
         const user = await userModel.create({
            email,
           password:hash,
            fullname
        });
     let token= generateToken(user);
      res.cookie("token",token);
      res.send("user created")
      
        // res.redirect('/dashboard');
     }
});
       });

        // Create new user
       
    } catch (err) {
        res.render('index', { error: 'Something went wrong' });
    }

};

module.exports.loginUser=async (req,res)=>{
let{email,password}=req.body;
let user=await userModel.findOne({email:email});
if(!user){
return res.send("Invalid credentials");
}
 bcrypt.compare(password,user.password,function(err,result){
     if(result){
       let token= generateToken(user);
       res.cookie("token",token);
     res.redirect('/shop');
     }
     else{
        req.flash("error","Invalid crendentials");
        res.redirect('/');
     }
 })
};

module.exports.logout=async(req,res)=>{
   res.cookie("token","");
   res.redirect('/');
};

 