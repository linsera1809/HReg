'use strict';

//Load required modules
var Team = require('../models/team');
var User = require('../models/user');
var userValidator = require('../lib/user-validator');

//##############################################################################
//##### Validate Register Team
//##############################################################################
exports.validateRegisterTeam = async function(team, user) {
  var error = {};
  var errorMessage;

  //Validate Team Name
  errorMessage = await exports.validateName(team.teamName);
  if(errorMessage){
    error.teamName = errorMessage;
  }

  Object.assign(error, await exports.validateMembers(team.members, user));

  return error;
}

//##############################################################################
//##### Validate Team Name
//##############################################################################
exports.validateName = async function(teamName){
    var errorMessage;
    if(!teamName || teamName == ""){
        errorMessage = "Missing Team Name";
    }else if(await Team.findOne({teamAlias:teamName.toLowerCase()})){
        errorMessage = teamName + " is already taken.";
    }
    return errorMessage;
}

//##############################################################################
//##### Validate Team Members
//##############################################################################
exports.validateMembers = async function(members, user) {
  const MIN_MEMBER_COUNT = process.env.MIN_MEMBER_COUNT || 3;
  const MAX_MEMBER_COUNT = process.env.MAX_MEMBER_COUNT || 6;
  var error = {};
  var errorMessage;

  //NOTE: members does not include the team leader, aka the user who is
  //submitting the form. Thus the length + 1.
  //1) Check the number of team members is greater than MIN_MEMBER_COUNT
  //2) Check the number of team members is greater than MAX_MEMBER_COUNT
  //3) Do individual member validation
  if (members.length + 1 < MIN_MEMBER_COUNT) {
    error.members = "Must have at least " + MIN_MEMBER_COUNT + " members.";
  } else if (members.length + 1 > MAX_MEMBER_COUNT) {
    error.members = "Can't have more than " + MAX_MEMBER_COUNT + " members.";
  } else {
    for(var i=0; i<members.length; i++) {
      errorMessage = undefined;
      // Validate that there are no duplicate members
      var pos = members.indexOf(members[i])
      if (pos >= 0 && pos < i) {
        errorMessage = "This member is a duplicate";
      }

      //If no error then Validate member
      if (!errorMessage) {
        errorMessage = await exports.validateMember(members[i], user);
      }

      //If there was an error, assign to error.members[i]
      if (errorMessage) {
        if (!error.members) {
          error.members = []
        }
        error.members[i] = errorMessage;
      }
    }
  }

  return error;
}

//##############################################################################
//##### Validate Team Member
//##############################################################################
exports.validateMember = async function(memberEmail, user){
    var errorMessage;

    //Validate that the leader, aka the user who is submitting the form is not
    //included in members.
    if (memberEmail == user.email) {
      errorMessage = 'The leader should not be included in the members list. Leader is automatically added when when form is submitted.';
    }

    //If no error then Validate memberEmail is properly formed
    if (!errorMessage) {
      errorMessage = userValidator.validateEmail(memberEmail);
    }

    //If no error then Validate that the member is not already on a team
    if(!errorMessage && await User.findOne({email: memberEmail, onTeam: {$ne:null}})){
        errorMessage = memberEmail + " already registered to a team.";
    }

    return errorMessage;
}

//##############################################################################
//##### Registration Full
//##############################################################################
exports.registrationFull = async function() {
  var teams = await Team.find({$or: [{'state.status': 'registered'}, {'state.status': 'warning'}]});
  if (teams.length < (process.env.MAX_TEAM_COUNT || 50)) {
    return false;
  } else {
    return true;
  }
}
