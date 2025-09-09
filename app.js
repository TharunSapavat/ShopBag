const cookieparser = require('cookie-parser');
const db = require("./config/mongoose-connection");
const express = require('express');
const app = express();
const ownersRouter = require('./routes/ownersRouter');
const productsRouter = require('./routes/productsRouter');
const usersRouter = require('./routes/usersRouter');
const index = require('./routes/index');
const path = require('path');
require("dotenv").config();
const session = require('express-session');
const flash = require('connect-flash');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieparser());
app.use(express.static(path.join(__dirname, "public")));
app.set('view engine', 'ejs');

app.use(session({
  secret: 'tharun', // use a strong secret
  resave: false,
  saveUninitialized: false
}));
app.use(flash());

// ✅ Make flash messages available in EJS
app.use((req, res, next) => {
  res.locals.messages = {
    success: req.flash('success'),
    error: req.flash('error')
  };
  next();
});

const updateProfileRouter = require('./routes/updateprofile');
app.use('/profile', updateProfileRouter);

app.use('/', index);
app.use('/owners', ownersRouter);
app.use('/products', productsRouter);
app.use('/users', usersRouter);

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
