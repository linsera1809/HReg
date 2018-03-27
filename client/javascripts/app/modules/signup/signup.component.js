angular.module('hackathonRegistrationApp').component('signup', {
  templateUrl: 'signup/signup.template.html',
  controller: ['user', function signupController(user) {
    var ctrl = this;

    ctrl.$onInit = function() {
      ctrl.user = {};
      ctrl.error = [];
      ctrl.terms = false;
    }

    ctrl.$onChanges = function() {
      ctrl.tshirtSizes = ctrl.tshirtSizes.split(',');
    }

    ctrl.signup = function() {
      user.signup(ctrl.user).then(function(res) {
        if (res.status == 200) {
          ctrl.message = res.data;
          ctrl.error = undefined;
        } else {
          ctrl.message = undefined;
          ctrl.error = res.data;
        }
      });
    }
  }],
  bindings: {
    tshirtSizes: '@'
  }
});
