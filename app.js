const cookieparser = require('cookie-parser');
const db=require("./config/mongoose-connection");
const express=require('express');
const app=express();
const ownersRouter=require('./routes/ownersRouter');
const productsRouter=require('./routes/productsRouter');
const usersRouter=require('./routes/usersRouter');
const index=require('./routes/index');
const path=require('path');
require("dotenv").config();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieparser());
app.use(express.static(path.join(__dirname,"public")));
app.set('view engine','ejs');



app.use('/',index);
app.use('/owners',ownersRouter);
app.use('/products',productsRouter);
app.use('/users',usersRouter);


app.listen(3000);