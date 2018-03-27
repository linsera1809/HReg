angular.module('hackathonRegistrationApp').component('registerTeamName', {
  templateUrl: 'register-team-name/register-team-name.template.html',
  controller: [function registerTeamNameController() {
    var ctrl = this;

    ctrl.assignTeamName = function() {
      ctrl.teamName({name: ctrl.name});
    }

  }],
  bindings: {
    teamName: '&'
  }
});
