'use strict';

exports.isLoggedIn = function(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect('/login');
  }
}

exports.isNotLoggedIn = function(req, res, next) {
  if (!req.isAuthenticated()) {
    next();
  } else {
    res.redirect('/dashboard');
  }
}

exports.notOnTeam = function(req, res, next) {
  if (!req.user.onTeam) {
    next();
  } else {
    res.redirect('/dashboard')
  }
}
