angular.module('hackathonRegistrationApp').component('loginButton', {
  templateUrl: 'login-button/login-button.template.html',
  controller: ['$interval', function loginButtonController() {
    var ctrl = this;

    ctrl.$onInit = function() {
      ctrl.showLogin = false;
    }

    ctrl.countdownOver = function(over) {
      if (over) {
        ctrl.showLogin = true;
      }
    }
  }],
  bindings: {
    countdownTimestamp: '@',  //Timestamp to coundown to
  }
});
