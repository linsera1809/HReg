'use strict';

//Load required modules
var teamController = require('../controllers/team-controller');
var authorize = require('../lib/authorize');
var express = require('express');
var router = express.Router();

router.post('/register-team', authorize.isLoggedIn, teamController.register);

// router.post('/register-team', authorize.isLoggedIn, function(req, res, next) {
//   res.json(req.body);
// });

module.exports = router;
