'use strict';

//Load required modules
var Team = require('../models/team');
var teamVal = require('../lib/team-validator');
var emailer = require('../lib/emailer');
var hashing = require('../lib/hashing');

//=============================
//======= Register Team =======
//=============================
exports.register = async function(req, res, next) {
//TODO: registration closed
//TODO: registration on waitlist
  if (req.user.onTeam) {
    res.status(403).send({error: 'You are already on a team'});
  } else if (await teamVal.registrationFull()) {
    res.status(403).send({error: 'Registration is full'});
  } else {
    //Validate req.body
    var error = await teamVal.validateRegisterTeam(req.body, req.user);

    //If there were errors send 400 Bad Request response with the errors.
    //Else create the new team and send team invites.
    if(Object.keys(error).length > 0) {
      res.status(400).json(error);
    } else {
      //Create new Team document
      var newTeam = new Team();
      newTeam.teamName = req.body.teamName;
      newTeam.teamAlias = req.body.teamName.toLowerCase();
      newTeam.leader = req.user.email;
      newTeam.members = [];
      newTeam.members[0] = {email: req.user.email, status: 'confirmed'};
      for (var i=0; i<req.body.members.length; i++) {
        newTeam.members[i+1] = {email: req.body.members[i]};
        newTeam.members[i+1].declineHash = hashing.sha512(req.user.password, hashing.generateSalt(16));
      }
      newTeam.appIdea = req.body.appIdea;
      newTeam.technology = req.body.technology;
      newTeam.platform = req.body.platform;
      newTeam.state.status = "pending";
      newTeam.state.description = "Waiting for members to accept team invitation";

      //Save newTeam
      await newTeam.save()

      //Set user.onTeam
      req.user.onTeam = newTeam.teamAlias;
      await req.user.save()

      //Send team invites
      var context = {
        sender: (req.user.firstName + ' ' + req.user.lastName),
        teamName: newTeam.teamName,
      }
      for (var i=1; i<newTeam.members.length; i++) {
        context.memberEmail = newTeam.members[i].email,
        context.declineHash = newTeam.members[i].declineHash;
        await emailer.sendEmail(newTeam.members[i].email, 'Join Team : Hackathon Registration', 'join-team', context);
      }


      //Send response
      res.json('Registration form submitted and team invites sent')
    }
  }
}

//==================================
//======= Decline Invitation =======
//==================================
exports.declineInvite = async function(req, res, next) {
  //Find team the user wants to decline joining
  var team = await Team.findOne({teamAlias: req.params.teamName.toLowerCase()});

  //Find the position of the user in team.members
  var pos = team.getTeamMemberIndex(req.query.email);

  //If the user was found, and their hash matches member.decline hash, then
  //set member status to declined
  if (pos >= 0 && team.members[pos].declineHash == req.query.hash) {
    team.members[pos].status = 'declined';
    team.members[pos].declineHash = undefined;
    await team.save()
    res.locals.declineInviteAuthorized = true;
  }

  next();
}
