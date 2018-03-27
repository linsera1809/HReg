'use strict';

//Load required modules
var User = require('../models/user');

//##############################################################################
//##### Validate Account Creation
//##############################################################################
exports.validateAccountCreation = async function(user) {
  var error = {};

  //Check that First Name has a value
  if (!user.firstName || user.firstName == "") {
    error.firstName = 'The First Name field is required';
  }

  //Validate Last name
  if (!user.lastName || user.lastName == "") {
    error.lastName = 'The Last Name field is required';
  }

  //Validate Cell Phone
  if (!user.cell || user.cell == "") {
    error.cell = 'The Cell Phone field is required';
  } else if (user.cell.length != 10) {
    error.cell = 'The Cell phone number is not 10 digits long';
  }

  //Validate T-Shirt size
  var tshirtSizes = process.env.TSHIRT_SIZES || 'XS,S,M,L,XL,XXL,XXXL';
  tshirtSizes = tshirtSizes.split(',');
  if (!user.tshirt) {
    error.tshirt = 'The T-Shirt field is required';
  } else if (tshirtSizes.indexOf(user.tshirt) < 0) {
    error.tshirt = 'T-Shirt size is not a valid size';
  }

  //Validate Team Role
  if (!user.role) {
    error.role = 'The Team Role field is required';
  }

  //Validate Agreed to Terms and conditions
  if (!user.terms) {
    error.terms = 'Need to agree to the terms and conditions';
  }

  //Validate that the Email is properly formed and is not in use by a verified user
  var message = exports.validateEmail(user.email);
  if (message != "") {
    error.email = message;
  } else {
    //See if there is a user that is alraedy using the Email
    var userDocument = await User.findOne({email: user.email})

    //If there is a user with the Email and they have verified their account
    //assign an email error
    if (userDocument && userDocument.verified) {
      error.email = 'That email is already taken'
    }
  }

  //Validate that the Password is properly formed and matches the confirm password
  var message = exports.validateNewPassword(user.password, user.confirmPassword);
  if (message != "") {
    error.password = message;
  }

  return error;
}

//##############################################################################
//##### Validate Email
//##############################################################################
exports.validateEmail = function(email) {
  var errorMessage = "";

  //1) Check that the email field isn't empty
  //2) Check that email is an @nationwide.com email
  if (!email || email == "") {
    errorMessage = 'The Email field is required';
  } else if (!isNationwideEmail(email)) {
    errorMessage = 'Must be a valid @nationwide.com email';
  }

  return errorMessage;
}

//True if ____________@nationwide.com email
//=============================================================================
function isNationwideEmail(email) {
  return /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@nationwide\.com$/.test(email.toLowerCase());
}

//##############################################################################
//##### Validate New Password
//##############################################################################
exports.validateNewPassword = function(password, confirmPassword) {
  var errorMessage = "";

  //1) Check that password has a value
  //2) Check that confirmPassword has a value
  //3) Check that password contains only valid characters
  //4) Else check that password is strong enough
  //5) Else check that password matches confirm password
  if (!password || password == "") {
    errorMessage = 'The Password field is required';
  } else if (!confirmPassword || confirmPassword == "") {
    errorMessage = 'The Confirm Password field at is required';
  } else if (!isValidPassword(password)) {
    errorMessage = 'Password contains invalid characters';
  } else if (!isStrongPassword(password)) {
    errorMessage = 'Password is not strong enough';
  } else if (password != confirmPassword){
    errorMessage = 'Passwords do not match';
  }

  return errorMessage;
}

//True if password contains only these characters:
//a-z, A-Z, 0-9, !@#$%^&*()+=._-
//=============================================================================
function isValidPassword(password) {
  return /^[a-zA-Z0-9!@#\$%\^\&*\(\)+=._-]*$/.test(password)
}

//True if password is 8 characters long and contains 3 of the following:
// - Contains at least 1 lowercase alphabetical character
// - Contains at least 1 uppercase alphabetical character
// - Contains at least 1 numeric character
// - Contains at least 1 special character
//=============================================================================
function isStrongPassword(password) {
  var count = 0;
  var strongPassword = false;

  //1) Contains at least 1 lowercase alphabetical character
  if (/^.*[a-z]+.*$/.test(password)) {
    count++;
  }

  //2) Contains at least 1 uppercase alphabetical character
  if (/^.*[A-Z]+.*$/.test(password)) {
    count++;
  }

  //3) Contains at least 1 numeric character
  if (/^.*[0-9]+.*$/.test(password)) {
    count++;
  }

  //4) Contains at least 1 special character
  if(/^.*[!@#\$%\^\&*\(\)+=._-]+.*$/.test(password)) {
    count++;
  }

  //5) Password is at least 8 characters long and 3 of the above 4 conditions
  //were met
  if (password.length >= 8 && count >= 3) {
    strongPassword = true;
  }

  return strongPassword;
}
//##############################################################################
//##### Validate Reset Password is Authorized
//##############################################################################

exports.resetAuthorized = function(user, req) {
  //Reset is authorized if
  //  - A user with req.email was found
  //  - User has a resetHash
  //  - User's resetHash matches query.hash
  //  - User's resetHash hasn't expired
  return (user && user.resetHash && user.resetHash == req.query.hash && user.resetExpires > new Date())
}

//##############################################################################
//##### Validate Verify Account Email is Authorized
//##############################################################################
exports.verifyAuthorized = function(user, req) {
  //Verificiation is authorized if
  //  - A user with req.email was found
  //  - User has a resetHash
  //  - User's resetHash matches query.hash
  //  - User's resetHash hasn't expired
  return (user && user.verifiedHash && user.verifiedHash == req.query.hash && user.verifiedExpires > new Date())
}
