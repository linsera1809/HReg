angular.module('hackathonRegistrationApp').component('selectLeaders', {
  templateUrl: 'select-leaders/select-leaders.template.html',
  controller: [function selectLeadersController() {
    var ctrl = this;

    ctrl.toggleLeader = function (index) {
      ctrl.members[index].leader = !ctrl.members[index].leader
    }

  }],
  bindings: {
    members: '=',
  }
});
