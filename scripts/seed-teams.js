var User = require('../server/models/user');
var Team = require('../server/models/team');
var hashing = require('../server/lib/hashing');
var mongoose = require('mongoose');

//Setup mongoose connection
mongoose.Promise = global.Promise;
var mongoDB = process.env.MONGODB_URI || 'mongodb://localhost/Hackathon2018';
mongoose.connect(mongoDB);
var db = mongoose.connection;
db.on('error', function(err) {logger.error('MongoDB connection error:' + err);});

//Team A
var teamA = new Team();
teamA.teamName = 'TeamA';
teamA.teamAlias = 'teama';
teamA.leader = 'alio2@nationwide.com';
teamA.members = [
  {email: 'alio2@nationwide.com', status: 'confirmed'},
  {email: 'onielm8@nationwide.com', status: 'confirmed'},
  {email: 'taltoj1@nationwide.com', declineHash: hashing.sha512('This is so much fun!', hashing.generateSalt(16))}
];
teamA.state = {
  status: 'pending',
  description: 'Waiting for members to accept team invitation'
}
teamA.appIdea = 'A really cool idea';
teamA.technology = 'MEAN';
teamA.platform = 'AWS';

console.log('saving team');
teamA.save(function(err) {
  if (err) {
    console.log(err);
  }
  console.log('team saved');
});

console.log('updating user leader');
User.findOne({email: teamA.leader}, function(err, doc) {
  if (err) {
    console.log(err);
  } else {
    doc.onTeam = teamA.teamAlias;
    doc.save(function(err) {
      if (err) {
        console.log(err);
      }
      console.log('user leader updated')
    })
  }
});

console.log('updating user member[1]');
User.findOne({email: teamA.members[1].email}, function(err, doc) {
  if (err) {
    console.log(err);
  } else {
    doc.onTeam = teamA.teamAlias;
    doc.save(function(err) {
      if (err) {
        console.log(err);
      }
      console.log('user member[1] updated')
      mongoose.connection.close();
    });
  }
});
