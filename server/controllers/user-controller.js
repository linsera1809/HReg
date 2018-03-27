'use strict';

//Load required modules
var User = require('../models/user');
var userValidator = require('../lib/user-validator');
var emailer = require('../lib/emailer');
var passport = require('passport');

//=========================
//======= loginPost =======
//=========================
exports.loginPost = function(req, res, next) {
  //Authenticate user
  passport.authenticate('local', function(err, user, info) {
    if (err) {
      //Internal server error, throw to next handler
      return next(err);
    } else if (!user) {
      if (info.verified) {
        //The users's email has not been verified yet. Send 401 Unauthorized response
        return res.status(401).send('This account has not been verified');
      } else {
        //User credentials did not match. Send 401 Unauthorized response
        return res.status(401).send('The email or password is incorrect.');
      }
    } else {
      //User was authenticated. Log them in
      req.logIn(user, function(err) {
        if (err) {
          return next(err);
        } else {
          var returnToPage
          if (req.cookies.returnToPage) {
            returnToPage = req.cookies.returnToPage;
          } else {
            returnToPage = '/';
          }
          var data = {
            message: 'Login Successful',
            returnToPage: returnToPage
          }
          return res.json(data);
        }
      });
    }
  })(req, res, next);
}

//==========================
//======= signupPost =======
//==========================
exports.signupPost = async function(req, res, next) {
  //Validate req.body
  var error = await userValidator.validateAccountCreation(req.body);

  //If there were errors send 400 Bad Request response with the errors.
  //Else create the new user and send a verification email.
  if(Object.keys(error).length > 0) {
    res.status(400).json(error);
  } else {

    //TODO: This needs updated. user is no longer defined;

    //If there is a user already using the provided email then update the user
    //with the new information. NOTE: validateAccountCreation() would have
    //returned an error if the user was already verified.
    //Else create a new user.
    var user = await User.findOne({email: req.body.email})
    var newUser = new User();
    if (user) {
      newUser = user;
    }
    newUser.email = req.body.email
    newUser.firstName = req.body.firstName
    newUser.lastName = req.body.lastName
    newUser.cell = req.body.cell
    newUser.tshirt = req.body.tshirt
    newUser.role = req.body.role
    newUser.diet = req.body.diet
    newUser.password = req.body.password

    //Save newUser document
    await newUser.save();

    //Get fully created user that includes a validation hash
    var user = await User.findOne({email: newUser.email});

    //Send verification email
    var context = {
      name: newUser.firstName,
      userEmail: user.email,
      verifiedHash: user.verifiedHash,
      verifiedExpires: user.verifiedExpiresTime
    }
    await emailer.sendEmail(user.email, 'Confirm Account : Hackathon Registration', 'confirm-account', context);

    //Responde with email has been sent message
    res.send('A verification email has been sent to: ' + user.email + ' with further instructions');
  }
}

//================================
//======= verifySignupGet =======
//================================
exports.verifySignupGet = async function(req, res, next) {
  var error = {};

  //Validate that the Email is properly formed
  var message = userValidator.validateEmail(req.query.email);
  if (message != "") {
    error.email = message;
  }

  //If there was an error return 400 client error response
  //Else find the user
  if (Object.keys(error).length > 0) {
    res.status(400).json(error);
  } else {
    var user = await User.findOne({email: req.query.email});

    //If verify account is authorized then set user's verfied field to true and
    //auto login.
    //Else send 401 not authorized response
    if (userValidator.verifyAuthorized(user, req)) {
      user.verified = true;
      await user.save();
      await loginUser(user, req);
      next();
    } else {
      res.status(401).send('401 Not Authorized');
    }
  }
}

//==================================
//======= forgotPasswordPost =======
//==================================
exports.forgotPasswordPost = async function(req, res, next) {
  //Validate that the Email is properly formed
  var message = userValidator.validateEmail(req.body.email)

  //If email is properly formed lookup email in the User collection
  //Else return error message
  if (message == "") {
    //Lookup email in the User Collection
    var user = await User.findOne({email: req.body.email});

    //If the user was found set their reset hash and email them the link to
    //reset their password.
    //Else send an email to the provided address saying there was no account
    //associated with this address.
    var context;
    if (user) {
      await user.setResetHash();
      context = {
        hasAccount: true,
        name: user.firstName,
        userEmail: user.email,
        resetHash: user.resetHash,
        resetExpires: user.resetExpiresTime
      }

    } else {
      context = {
        hasAccount: false
      }
    }
    await emailer.sendEmail(req.body.email, 'Reset Password - Hackathon Registration ', 'reset-password', context);

    //Respond with email has been sent message
    res.status(200).send('An email has been sent to ' + req.body.email + ' with further instructions');
  } else {
    res.status(400).send(message)
  }
}

//================================
//======= resetPasswordGet =======
//================================
exports.resetPasswordGet = async function(req, res, next) {

  //Validate that the Email is properly formed
  var message = userValidator.validateEmail(req.query.email);

  //If there wasn't an error find the user
  if (message == "") {
    var user = await User.findOne({email: req.query.email});
  }

  //Check if reset password is authorized and save in res.locals.resetAuthorized
  res.locals.resetAuthorized = userValidator.resetAuthorized(user, req);

  //Continue to next middleware function
  next();
}

//=================================
//======= resetPasswordPost =======
//=================================
exports.resetPasswordPost = async function(req, res, next) {
  var error = {};

  //Validate that the Password is properly formed and matches the confirm password
  var message = userValidator.validateNewPassword(req.body.password, req.body.confirmPassword);
  if (message != "") {
    error.password = message;
  }

  //Validate that the Email is properly formed
  var message = userValidator.validateEmail(req.query.email);
  if (message != "") {
    error.email = message;
  }

  //If there was an error return 400 client error response
  //Else find the user
  if (Object.keys(error).length > 0) {
    res.status(400).json(error);
  } else {
    var user = await User.findOne({email: req.query.email});

    //If reset password is authorized then reset user's password and log them in
    //Else send 401 not authorized response
    if (userValidator.resetAuthorized(user, req)) {
      user.password = req.body.password;
      await user.save();
      await loginUser(user, req);
      res.send('Password has been updated');
    } else {
      res.status(401).send('401 Not Authorized');
    }
  }
}

//==================================
//======= changePasswordPost =======
//==================================
exports.changePasswordPost = function(req, res, next) {
  //If there is an authenticated user then change their password
  //Else send a 401 Unauthorized response
  if (req.user) {
    var error = {};

    //Check that the old password matches current password
    if (!req.user.validPassword(req.body.oldPassword)) {
      error.oldPassword = 'Old password is incorrect'
    }

    //Validate that the Password is properly formed and matches the confirm password
    var message = userValidator.validateNewPassword(req.body.password, req.body.confirmPassword);
    if (message != "") {
      error.password = message;
    }

    //If there was an error send a 400 Bad Request response with the errors.
    //Else check that the old password matches
    if (Object.keys(error).length > 0) {
      res.status(400).json(error);
    } else {
      req.user.password = req.body.password;
      req.user.save(function(err) {
        if (err) {
          //Internal server error, throw to next handler
          next(err);
        } else {
          //Send 200 OK response
          res.send('Password has been changed');
        }
      });
    }
  } else {
    res.status(401).send('401 Not Authorized');
  }
}

//=========================
//======= logoutGet =======
//=========================
exports.logoutGet = function(req, res, next) {
  req.logout();
  res.redirect('/');
}

//=============================
//======= deleteAccount =======
//=============================
exports.deleteAccountPost = async function(req, res, next) {
  await User.remove(req.user);
  res.send('Your account has been removed')
}

//####### Helper Methods
//##############################################################################

//=========================
//======= loginUser =======
//=========================
function loginUser(user, req) {
  return new Promise(function (resolve, reject) {
    req.logIn(user, function(err) {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}
