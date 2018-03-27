angular.module('hackathonRegistrationApp').component('changePassword', {
  templateUrl: 'change-password/change-password.template.html',
  controller: ['user', function changePasswordController(user) {
    var ctrl = this;
    ctrl.creds = {};
    ctrl.error = [];

    ctrl.changePassword = function() {
      user.changePassword(ctrl.creds).then(function(res) {
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
