angular.module('hackathonRegistrationApp').component('resetPasswordForm', {
  templateUrl: 'reset-password-form/reset-password-form.template.html',
  controller: ['user', '$window', function resetPasswordFormController(user, $window) {
    var ctrl = this;
    ctrl.reset = {};
    ctrl.error = [];

    ctrl.resetPassword = function() {
      ctrl.reset.query = $window.location.search;
      user.resetPassword(ctrl.reset).then(function(res) {
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
