angular.module('hackathonRegistrationApp').component('teamRegistration', {
  templateUrl: 'team-registration/team-registration.template.html',
  controller: ['team', function teamRegistrationController(team) {
    var ctrl = this;

    ctrl.$onInit = function() {
      ctrl.team = {};
      ctrl.team.members = [];
    }

    ctrl.registerTeam = function() {
      ctrl.team.members = ctrl.team.members.filter(function(value) {
        return value;
      });
      team.registerTeam(ctrl.team).then(function(res) {
        if (res.status == 200) {
          ctrl.message = res.data;
          ctrl.error = undefined;
        } else {
          ctrl.message = undefined;
          ctrl.error = res.data;
        }
      });
    }
  }]
});
