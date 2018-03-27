'use strict';

//Load required modules
var Team = require('../models/team');
var User = require('../models/user');
var userValidator = require('../lib/user-validator');

exports.validateName = async function(teamName){
    var errorMessage = "";
    if(!teamName || teamName == ""){
        errorMessage = "Missing Team Name";
    }else if(await Team.findOne({teamAlias:teamName.toLowerCase()})){
        errorMessage = teamName + " is already taken.";
    }
    return errorMessage;
}
/*
exports.validateFirst = function(first){
    var errorMessage = "";
    if(!first || first == ""){
        errorMessage = "Missing First Name";
    }else if(!/^[ A-Za-z]*$/.test(first)){
        errorMessage = "First Name doesn't match format requirements. Only use letters.";
    }
    return errorMessage;
}

exports.validateLast = function(last){
    var errorMessage = "";
    if(!last || last == ""){
        errorMessage = "Missing Last Name";
    }else if(!/^[ A-Za-z]*$/.test(last)){
        errorMessage = "Last Name doesn't match format requirements. Only use letters.";
    }
    return errorMessage;
}
*/
exports.validateEmail = async function(email){
    var errorMessage
    errorMessage = userValidator.validateEmail(email);

    if(errorMessage == "" && await User.findOne({email: email, onTeam: {$ne:null}})){
        errorMessage = email + " already registered to a team.";
    }
    return errorMessage;
}
/*
exports.validateCell = function(cell){
    var errorMessage = "";
    if(!cell || cell == ""){
        errorMessage = "Missing cell";
    }else if(!/^[ 0-9]{10,10}$/.test(cell)){
        errorMessage = "Cell doesn't match format requirements. Only accepts 10 digits.";
    }
    return errorMessage;
}

exports.validateSize = function(size){
    var errorMessage = "";
    if(!size || size == ""){
        errorMessage = "Missing size";
    }else if(size != 'XS' && size != 'S' && size != 'M' && size != 'L' && size != 'XL' && size != 'XXL' && size != 'XXXL'){
        errorMessage = "Size doesn't match one of the given sizes.";
    }
    return errorMessage;
}

exports.validateRole = function(role){
    var errorMessage = "";
    if(!role || role == ""){
        errorMessage = "Missing role";
    }else if(!/^[a-zA-Z0-9!"#$%&'()*+,.\/:;<=>?@\[\] ^_`{|}~-]*$/.test(role)){
        errorMessage = "Role doesn't match format requirements.";
    }
    return errorMessage;
}


//Optional on registration

exports.validateAllergies = function(allergies){
    var errorMessage = "";
    if(!/^[a-zA-Z0-9!"#$%&'()*+,.\/:;<=>?@\[\] ^_`{|}~-]*$/.test(allergies)){
        errorMessage = "Allergies doesn't match format requirements.";
    }
    return errorMessage;
}

exports.validateAppIdea = function(appIdea){
    var errorMessage = "";
    if(!/^[a-zA-Z0-9!"#$%&'()*+,.\/:;<=>?@\[\] ^_`{|}~-]*$/.test(appIdea)){
        errorMessage = "App Idea doesn't match format requirements.";
    }
    return errorMessage;
}

exports.validateTechnology = function(technology){
    var errorMessage = "";
    if(!/^[a-zA-Z0-9!"#$%&'()*+,.\/:;<=>?@\[\] ^_`{|}~-]*$/.test(technology)){
        errorMessage = "Technology doesn't match format requirements.";
    }
    return errorMessage;
}

exports.validatePlatform = function(platform){
    var errorMessage = "";
    if(!/^[a-zA-Z0-9!"#$%&'()*+,.\/:;<=>?@\[\] ^_`{|}~-]*$/.test(platform)){
        errorMessage = "Platform doesn't match format requirements.";
    }
    return errorMessage;
}

//May need to escape input to avoid injection
// exports.escapeContents = function(input){}
*/
