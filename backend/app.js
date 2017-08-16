const express       = require('express');
const path          = require('path');
const favicon       = require('serve-favicon');
const logger        = require('morgan');
const cookieParser  = require('cookie-parser');
const bodyParser    = require('body-parser');
const session       = require('express-session');
const mongoose      = require('mongoose');
const configDB      = require('./bin/dbconfig');

const passport      = require('passport');
const flash         = require('connect-flash');

const expressLayouts= require('express-ejs-layouts');

// Create our express application.
const app = express();

mongoose.Promise = global.Promise;
mongoose.connect(configDB.url);

// We dont need this for right now
// var router = require('router'); //routes

// view engine setup
// app.set('views', path.join(__dirname, '../frontend/'));
app.set('view engine', 'ejs');
app.use(expressLayouts);

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

// Passport configuration
require('./passport')(passport);


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public'))); //idk wtf this does lol

// Figures out which user is who. This comes before passport.
app.use(session({ secret: 'anystring goes here',
                  saveUninitialized: true,
                  resave: true }));

// Using passport as our user middleware
app.use(passport.initialize());
// Make sure you have our session before our passport.
app.use(passport.session());
// To display error messages in our application.
app.use(flash());

// Come back to this later
//To prevent errors from Cross Origin Resource Sharing, we will set
//our headers to allow CORS with middleware like so:
// app.use(function(req, res, next) {
//  res.setHeader(‘Access-Control-Allow-Origin’, ‘*’);
//  res.setHeader(‘Access-Control-Allow-Credentials’, ‘true’);
//  res.setHeader(‘Access-Control-Allow-Methods’, ‘GET,HEAD,OPTIONS,POST,PUT,DELETE’);
//  res.setHeader(‘Access-Control-Allow-Headers’, ‘Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers’);
// //and remove cacheing so we get the most recent comments
//  res.setHeader(‘Cache-Control’, ‘no-cache’);
//  next();
// });


//Routes
require('./routes')(app, passport);

//Inline routes
// app.use('/', (req, res) => {
//   console.log(req.cookies);
//   res.send("This is the appppppp");
//   console.log("=============");
//   console.log(req.session);
// });

// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   var err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });
//
// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};
//
//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

module.exports = app;
