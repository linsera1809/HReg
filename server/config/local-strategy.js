'use strict';

//Load required modules
var User = require('../models/user');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

//Serialize the user for the session
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

//Deserialize the user
passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

//Use Local Strategy
passport.use('local', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, function (email, password, done) {
  User.findOne({ email: email }, function (err, user) {
    if (err) {
      return done(err);
    } else if (!user) {
      return done(null, false, {email: 'Incorrect email.'});
    } else if (!user.validPassword(password)) {
      return done(null, false, {password: 'Incorrect password.' });
    } else if (!user.verified) {
      return done(null, false, {verified: 'User email has not been verified'});
    } else {
      return done(null, user);
    }
  });
}));
