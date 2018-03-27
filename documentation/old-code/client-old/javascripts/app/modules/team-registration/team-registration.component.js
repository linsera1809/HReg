angular.module('hackathonRegistrationApp').component('teamRegistration', {
  templateUrl: 'team-registration/team-registration.template.html',
  controller: ['team', function teamRegistrationController(team) {
    var ctrl = this;

    ctrl.$onInit = function() {
      ctrl.NUM_OF_STEPS = 4;
      ctrl.stepOneClass = "";
      ctrl.stepTwoClass = "hidden";
      ctrl.stepThreeClass = "hidden";
      ctrl.stepFourClass = "hidden";
      ctrl.currentStep = 1;
      ctrl.team = {};
      // ctrl.team.members = [];
    }

    ctrl.nextStep = function() {
      if (ctrl.currentStep < ctrl.NUM_OF_STEPS) {
        switch(ctrl.currentStep) {
          case 1:
            ctrl.stepOneClass = "slide-out-left";
            ctrl.stepTwoClass = "slide-in-right";
            break;
          case 2:
            ctrl.stepTwoClass = "slide-out-left";
            ctrl.stepThreeClass = "slide-in-right";
            break;
          case 3:
            ctrl.stepThreeClass = "slide-out-left";
            ctrl.stepFourClass = "slide-in-right";
            break;
        }
        ctrl.currentStep++;
      }
    }

    ctrl.prevStep = function() {
      if (ctrl.currentStep > 1) {
        switch(ctrl.currentStep) {
          case 2:
            ctrl.stepOneClass = "slide-in-left";
            ctrl.stepTwoClass = "slide-out-right";
            break;
          case 3:
            ctrl.stepTwoClass = "slide-in-left";
            ctrl.stepThreeClass = "slide-out-right";
            break;
          case 4:
            ctrl.stepThreeClass = "slide-in-left";
            ctrl.stepFourClass = "slide-out-right";
            break;
        }
        ctrl.currentStep--;
      }
    }

    ctrl.teamName = function(name) {
      ctrl.team.name = name;
    }

    ctrl.teamMembers = function(members) {
      ctrl.team.members = members;
    }

    ctrl.appInfo = function (appIdea, technology, platform) {
      ctrl.team.appIdea = appIdea;
      ctrl.team.technology = technology;
      ctrl.team.platform = platform;
    }

    ctrl.registerTeam = function() {
      team.registerTeam(ctrl.team);
    }

  }],
  bindings: {
    employmentTypes: '@',
    locations: '@',
    tshirtSizes: '@'
  }
});
