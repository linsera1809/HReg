var User = require('../server/models/user');
var mongoose = require('mongoose');

//Setup mongoose connection
mongoose.Promise = global.Promise;
var mongoDB = process.env.MONGODB_URI || 'mongodb://localhost/Hackathon2018';
mongoose.connect(mongoDB);
var db = mongoose.connection;
db.on('error', function(err) {console.log('MongoDB connection error:' + err)});

//Default
var defaultUser = new User();
defaultUser.verified = true;
defaultUser.email = 'default@nationwide.com';
defaultUser.firstName = 'De';
defaultUser.lastName = 'Fault';
defaultUser.cell = '1234567890';
defaultUser.tshirt = 'M';
defaultUser.role = 'Tester';
defaultUser.diet = 'None';
defaultUser.password = 'Howdy1234';

console.log('saving Default');
defaultUser.save(function(err) {
  if (err) {
    console.log(err);
  }
  console.log('Default saved');
});

//Osman
var osman = new User();
osman.verified = true;
osman.email = 'alio2@nationwide.com';
osman.firstName = 'Osman';
osman.lastName = 'Ali';
osman.cell = '1234567890';
osman.tshirt = 'M';
osman.role = 'Designer';
osman.diet = 'None';
osman.password = 'Howdy1234';

console.log('saving Osman');
osman.save(function(err) {
  if (err) {
    console.log(err);
  }
  console.log('Osman saved');
});

//Melanie
var melanie = new User();
melanie.verified = true;
melanie.email = 'onielm8@nationwide.com';
melanie.firstName = 'Melanie';
melanie.lastName = 'O\'Neill';
melanie.cell = '1234567890';
melanie.tshirt = 'M';
melanie.role = 'Developer';
melanie.diet = 'None';
melanie.password = 'Howdy1234';

console.log('Saving Melanie');
melanie.save(function(err) {
  if (err) {
    console.log(err);
  }
  console.log('Melanie saved');
  mongoose.connection.close();
});
