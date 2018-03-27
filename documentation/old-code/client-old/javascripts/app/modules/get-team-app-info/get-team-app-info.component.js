angular.module('hackathonRegistrationApp').component('getTeamAppInfo', {
  templateUrl: 'get-team-app-info/get-team-app-info.template.html',
  controller: [function getTeamAppInfoController() {
    var ctrl = this;

    ctrl.updateAppInfo = function() {
      ctrl.appInfo({
        appIdea: ctrl.appIdea,
        technology: ctrl.technology,
        platform: ctrl.platform
      });
    }

  }],
  bindings: {
    appInfo: '&',
  }
});
