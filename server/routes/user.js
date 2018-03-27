'use strict';

//Load required modules
var userController = require('../controllers/user-controller');
var authorize = require('../lib/authorize');
var express = require('express');
var router = express.Router();

//======================================
//======= Unauthenticated Routes =======
//======================================

/* POST Login */
router.post('/login', authorize.isNotLoggedIn, userController.loginPost);

/* POST Signup */
router.post('/signup', authorize.isNotLoggedIn, userController.signupPost);

/* POST Forgot Password */
router.post('/forgot-password', authorize.isNotLoggedIn, userController.forgotPasswordPost);

/* POST Reset Password */
router.post('/reset-password', authorize.isNotLoggedIn, userController.resetPasswordPost);

//===================================
//======= Authenticated Pages =======
//===================================

/* POST Change Password  */
router.post('/change-password', authorize.isLoggedIn, userController.changePasswordPost);

/* GET logout */
router.get('/logout', authorize.isLoggedIn, userController.logoutGet);

/* POST Delete Account  */
router.get('/delete-account', authorize.isLoggedIn, userController.deleteAccountPost);

module.exports = router;
