'use strict';

//Load required modules
var hashing = require('../lib/hashing.js')
var mongoose = require('mongoose');
var moment = require('moment-timezone');

//==== Schema =================================================================
var userSchema = mongoose.Schema({
  email: {type: String, lowercase: true, required: true, unique: true, index: true},
  firstName: {type: String, required: true},
  lastName: {type: String, required: true},
  cell: {type: Number, required: true},
  tshirt: {type: String, required: true},
  role: {type: String, required: true},
  diet: {type: String},
  teamInvitations: {type: [String]},
  onTeam: {type: String},
  password: {type: String, required: true},
  salt: {type: String},
  verified: {type: Boolean, default: false},
  verifiedHash: {type: String},
  verifiedExpires: {type: Date},
  resetHash: {type: String},
  resetExpires: {type: Date}
});

//==== Virtual Attributes ======================================================

//Add virtual attribute verifiedExpiresTime
userSchema.virtual('verifiedExpiresTime').get(function() {
  return moment(this.verifiedExpires).tz('America/New_York').format('h:mm a z');
});

//Add virtual attribute resetExpiresTime
userSchema.virtual('resetExpiresTime').get(function() {
  return moment(this.resetExpires).tz('America/New_York').format('h:mm a z');
});

//==== Schema Methods ==========================================================

//Hash password before saving
userSchema.pre('save', function(next) {
  //If there is a password field and it has been modified then hash the password
  //before saving and make sure resetHash and resetExpires are undefined
  if (this.password && this.isModified('password')) {
    var salt = hashing.generateSalt(16);
    var hashedPassword = hashing.sha512(this.password, salt);
    this.password = hashedPassword;
    this.salt = salt;
    this.resetHash = undefined;
    this.resetExpires = undefined;
  }

  //If account has not been verified then create/update verification hash
  //Else set verfiedHash and verifiedExpires to undefined
  if (!this.verified) {
    this.verifiedHash = hashing.sha512(this.password, hashing.generateSalt(16));
    this.verifiedExpires = moment(new Date()).add(20, 'minutes'); /* reset hash expires 20 minutes after creation */
  } else {
    this.verifiedHash = undefined;
    this.verifiedExpires = undefined;
  }

  next();
});

//Check if password is valid
userSchema.methods.validPassword = function(password) {
  return this.password == hashing.sha512(password, this.salt);
};

//Set password reset hash
userSchema.methods.setResetHash = function() {
  //If resetHash is expired then set a new hash
  if (this.resetExpires == undefined || this.resetExpires < new Date()) {
    this.resetHash = hashing.sha512(this.password, hashing.generateSalt(16));
    this.resetExpires = moment(new Date()).add(20, 'minutes'); /* reset hash expires 20 minutes after creation */
  }
  return this.save()
}


//==== Export User Model =======================================================
module.exports = mongoose.model('User', userSchema);
