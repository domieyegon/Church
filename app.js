const express= require('express');
const path=require('path');
const bodyParser= require('body-parser');
const methodOverride= require('method-override');
const exphbs= require('express-handlebars');
const session=require('express-session');
const passport= require('passport');
const mongoose= require('mongoose');

const app = express();

//load routes
const index= require('./routes/index');
const user= require('./routes/users');
const bible= require('./routes/bible');


//loading the passport config
require('./config/passport')(passport);


//load the db config
const db= require('./config/database');


//load handlebars helpers
const {dateFormat, truncate, stripTags} =require('./helpers/help');

//connecting to Mongoose Database
mongoose.connect(db.mongoURI)
    .then(() => console.log('Connect to Database'))
    .catch(err => console.log(err));


//express handlebars middleware
app.engine('handlebars', exphbs({
    helpers: {
        truncate: truncate,
        stripTags: stripTags,
        dateFormat: dateFormat

    },
    defaultLayout: 'main'}));
app.set('view engine', 'handlebars');


//body parser middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//method override middleware
app.use(methodOverride('_method'));

app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}));

//passport middleware
app.use(passport.initialize());
app.use(passport.session());


// Set global variables
app.use(function (req, res, next) {
    res.locals.user = req.user || null;
    next();
});

//static path
app.use(express.static(path.join(__dirname, 'public')));

//use the routes
app.use('/', index);
app.use('/user', user);
app.use('/bible', bible);

const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log(`server started from port: ${port}`)
});