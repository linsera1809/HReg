'use strict';

//Load required modules
var mongoose = require('mongoose');

//==== Schema =================================================================
var teamSchema = mongoose.Schema({
  teamName: {type: String, required: true, index: true, unique: true},
  teamAlias: {type: String, required: true, index: true, unique: true, lowercase: true},
  appIdea: {type: String},
  technology: {type: String},
  platform: {type: String},
  leader: {type: String},
  members: [{
    email: {type: String, required: true},
    status: {type: String, default: 'pending'},//possible status: pending, confirmed, declined, left
    declineHash: {type: String}
  }],
  state:{
    status:{type:String, required: true, index: true},//possible status: pending, registered, warning, deleted, waitlist
    description:{type: String}
  },
});

//==== Schema Methods ==========================================================

//Get Team Member
teamSchema.methods.getTeamMemberIndex = function(email) {
  for(var i = 0; i < this.members.length; i += 1) {
    if(this.members[i].email == email) {
      return i;
    }
  }
  return -1;
}

//==== Export User Model =======================================================
module.exports = mongoose.model('Team', teamSchema);
