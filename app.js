const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars'); //template engine (res.render)
const flash = require('connect-flash');
const session = require('express-session');
const bodyParser = require('body-parser'); //get info from forms
const methodOverride = require('method-override'); //for put/delete requests
const passport = require('passport');
const mongoose = require('mongoose');

const app = express();

//Load Routes
const ideas = require('./routes/ideas');
const users = require('./routes/users');

//Passport Config
require('./config/passport')(passport);
//DB config
const db = require('./config/database');

//map global promise - get rid of warning
mongoose.Promise = global.Promise;

//connect to mongoose db (local)
mongoose.connect(db.mongoURI, {
  useNewUrlParser: true
})
.then(()=> console.log('MongoDB connected...'))
.catch(err => console.log(err));

//handlebars middleware
app.engine('handlebars', exphbs({
  defaultLayout:'main'
}));
app.set('view engine', 'handlebars');

//body-parser middleware
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//Static folder (public)
app.use(express.static(path.join(__dirname, 'public')));

//Method Override middleware
app.use(methodOverride('_method'));

//express-session middleware
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true,
}));

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

//Global Variables
app.use(function(req, res, next){
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

//get, post, put, delete -- diff types of requests
app.get('/', (req, res)=>{
  const title = "hello";
  res.render("index", {
    title: title
  });
});

app.get('/about', (req, res) =>{
  res.render("about");
});


//Use Routes
app.use('/ideas', ideas);
app.use('/users', users);

const port = process.env.PORT || 3000; //always have process.... for heroku

app.listen(port, ()=>{ //es6 arrow function
  console.log(`Sever started on port ${port}`); //es6 back ticks so you dont need '+' to use variable
});
