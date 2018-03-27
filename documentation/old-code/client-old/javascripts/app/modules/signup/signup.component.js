angular.module('hackathonRegistrationApp').component('signup', {
  templateUrl: 'signup/signup.template.html',
  controller: ['user', function signupController(user) {
    var ctrl = this;
    ctrl.creds = {};
    ctrl.error = [];

    ctrl.signup = function() {
      user.signup(ctrl.creds).then(function(res) {
        if (res.status == 200) {
          ctrl.message = res.data;
          ctrl.error = [];
        } else {
          ctrl.message = undefined;
          ctrl.error = res.data;
        }
      });
    }
  }]
});
