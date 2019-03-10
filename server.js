const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const keys = require('./config/keys');
const cookieParser = require('cookie-parser');
const session = require('express-session');

// Load User Model
require('./models/User');

// Passport Config
require('./config/passport')(passport);

// Load Routes
const auth = require('./routes/auth');

const app = express();


// Mongoose Connect
mongoose
    .connect(keys.mongoURI, { useNewUrlParser: true } )
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

app.get('/', (req, res) => {
  res.send('It Works!');
});


app.use(cookieParser());
app.use(session({
  secret: 'dashfbhjdbhfbhaskhdbkj',
  resave: false,
  saveUninitialized: false
}));


// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());


// Set global vars
app.use((req, res, next) => {
    res.locals.user = req.user || null;
    next();
  });
  

// Use Routes
app.use('/auth', auth);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`)
});