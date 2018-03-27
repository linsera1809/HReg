'use strict';

//Load required modules
var authorize = require('../lib/authorize');
var userController = require('../controllers/user-controller');
var teamController = require('../controllers/team-controller');
var express = require('express');
var router = express.Router();


/**
 * Set res.locals.lastPageURL to what was stored previously in
 * req.cookies.lastPageURL. Then reset lastPageURL cookie to current URL.
 * This way we can track the last page a user was on.
 * One use case for this is so login page can set a returnToPage cookie
 * so the user can be taken back to the page they were on once they have gone
 * through the login process.
 */
router.use(function(req, res, next) {
  if (req.cookies.lastPageURL) {
    res.locals.lastPageURL = req.cookies.lastPageURL;
  }
  res.cookie('lastPageURL', req.originalUrl)
  next();
});

/**
 * If there is a user attach their email to res.local.email for use when
 * rendering pages. Else set res.local.email to false
 */
router.use(function(req, res, next){
    if (req.user) {
      res.locals.email = req.user.email;
    } else {
      res.locals.email = false;
    }
    next();
});

//============================
//======= Public Pages =======
//============================

/* GET home page. */
router.get('/', function(req, res, next) {
  if (req.user) {
    res.redirect('/dashboard')
  } else {
    res.render('layout', {
      page: 'index',
      title: 'Hackathon Registration',
      registrationOpens: process.env.REGISTRATION_OPENS || 'May 1, 2018 12:00:00'
    });
  }

});

/* Get decline team invitation page. */
router.get('/:teamName/decline-invitation', teamController.declineInvite, function(req, res, next) {
  if (res.locals.declineInviteAuthorized) {
    res.render('layout', {
      page: 'decline-invite',
      title: 'Decline Invitation',
      message: 'You have declined the invitation to join team ' + req.params.teamName
    });
  } else {
    next();
  }
})

//=====================================
//======= Unauthenticated Pages =======
//=====================================

/* GET login page. */
router.get('/login', authorize.isNotLoggedIn, function(req, res) {
  res.cookie('returnToPage', res.locals.lastPageURL);  //Page to return to after login
  res.render('layout', {
    page: 'login',
    title: 'Login'
  });
});

/* GET create account page. */
router.get('/create-account', authorize.isNotLoggedIn, function(req, res) {
  res.render('layout', {
    page: 'create-account',
    title: 'Create Account',
    tshirtSizes: (process.env.TSHIRT_SIZES || 'XS,S,M,L,XL,XXL,XXXL')
  });
});

/* Get verify signup. */
router.get('/verify-signup', authorize.isNotLoggedIn, userController.verifySignupGet, function(req, res) {
  res.render('layout', {
    page: 'account-verified',
    title: 'Account Confirmation',
    message: 'Your account has been confirmed'
  });
});

/* GET forgot password page. */
router.get('/forgot-password', authorize.isNotLoggedIn, function(req, res) {
  res.render('layout', {
    page: 'forgot-password',
    title: 'Forgot Password'
  });
});

/* GET reset password page. */
router.get('/reset-password', authorize.isNotLoggedIn, userController.resetPasswordGet, function(req, res, next) {
  if (res.locals.resetAuthorized) {
    res.render('layout', {
      page: 'reset-password',
      title: 'Reset Password'
    });
  } else {
    next();
  }
});

//===================================
//======= Authenticated Pages =======
//===================================

/* GET change password page. */
router.get('/dashboard', authorize.isLoggedIn, function(req, res) {
  res.render('layout', {
    page: 'dashboard',
    title: 'Registration Dashboard'
  });
});

/* GET change password page. */
router.get('/change-password', authorize.isLoggedIn, function(req, res) {
  res.render('layout', {
    page: 'change-password',
    title: 'Change Password'
  });
});

/* GET team-registration page. */
router.get('/team-registration', authorize.isLoggedIn, authorize.notOnTeam, function(req, res, next) {
  res.render('layout', {
    page: 'team-registration',
    title: 'Team Registration',
    minMemberCount: (process.env.MIN_MEMBER_COUNT || 3),
    maxMemberCount: (process.env.MAX_MEMBER_COUNT || 6),
  });
});

//=================================
//======= Development Pages =======
//=================================
router.get('/dev-output', function(req, res, next) {
  if ((process.env.NODE_ENV || 'development') == 'development') {
    res.render('layout', {
      page: 'dev-output',
      title: 'dev-output',
      output: req.query,
    });
  } else {
    next();
  }
});


module.exports = router;
