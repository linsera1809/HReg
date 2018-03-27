angular.module('hackathonRegistrationApp').component('forgotPassword', {
  templateUrl: 'forgot-password/forgot-password.template.html',
  controller: ['user', function forgotPasswordController(user) {
    var ctrl = this;

    ctrl.forgotPassword = function() {
      user.forgotPassword(ctrl.email).then(function(res) {
        if (res.status == 200) {
          ctrl.message = res.data;
          ctrl.error = undefined
        } else {
          ctrl.message = undefined;
          ctrl.error = res.data;
        }
      });
    }
  }]
});
