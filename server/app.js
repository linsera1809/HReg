'use strict';

//Load required modules
var pages = require('./routes/pages');
var user = require('./routes/user');
var api = require('./routes/api');
var localStrategy = require('./config/local-strategy');
var path = require('path');
var mongoose = require('mongoose');
var express = require('express');
var logger = require('winston');
var morgan = require('morgan');
var passport = require('passport');
var session = require('express-session');
var mongoStore = require('connect-mongo')(session);
var favicon = require('serve-favicon');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

//Setup mongoose connection
mongoose.Promise = global.Promise;
var mongoDB = process.env.MONGODB_URI || 'mongodb://localhost/Hackathon2018';
mongoose.connect(mongoDB);
var db = mongoose.connection;
db.on('error', function(err) {logger.error('MongoDB connection error:' + err);});

//Create an Express application
var app = express();

//Set registration opens date
var registrationOpens = process.env.REGISTRATION_OPENS || 'May 1, 2018 12:00:00'
app.set('registrationOpens', new Date(registrationOpens))

//Set registration closes date
var registrationCloses = process.env.REGISTRATION_CLOSES || 'July 1, 2018 12:00:00'
app.set('registrationCloses', new Date(registrationCloses))

//Setup view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//Setupt morgan to use winston
logger.stream = {
    write: function(message, encoding){
      logger.silly(message.substring(0,message.lastIndexOf('\n')));
    }
};
app.use(morgan('dev', {'stream': logger.stream}));

//Bind bodyParser and cookieParser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

//Bind passportjs middleware
app.use(session({
  secret: 'SpotAndCerebrumHackathon2018',
  resave: false,
  saveUninitialized: false,
  store: new mongoStore({
    mongooseConnection: db
  })
}));
app.use(passport.initialize());
app.use(passport.session());

//Route HTTP Requests for favicon and static files
app.use(favicon(path.join(__dirname, '../public/images/favicons', 'favicon.ico')));
app.use(express.static(path.join(__dirname, '../public')));

//If registration is not open then redirect all non-homepage requests to the homepage
app.use(function(req, res, next) {
  var now = new Date();
  if (req.originalUrl != '/' && now.getTime() <= app.settings.registrationOpens.getTime()) {
    res.redirect('/');
  } else {
    next();
  }
});

//Route all other HTTP Requests
app.use('/user', user);
app.use('/api', api);
app.use('/', pages);

//404 Error Page
app.use(function(req, res, next) {
  res.status(404).render('layout.ejs', {
    title: '404 Page Not Found',
    page: '404'
  });
});

//Error Handler
app.use(function(err, req, res) {
  res.status(500).send('Internal Server Error: ' + err);
});

module.exports = app;
