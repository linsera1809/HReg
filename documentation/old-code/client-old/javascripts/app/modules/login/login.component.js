angular.module('hackathonRegistrationApp').component('login', {
  templateUrl: 'login/login.template.html',
  controller: ['user', '$window', function loginController(user, $window) {
    var ctrl = this;
    ctrl.creds = {};

    ctrl.login = function() {
      user.login(ctrl.creds).then(function(res) {
        if (res.status == 200) {
          if (res.data.returnToPage) {
            $window.location.href = res.data.returnToPage;
          } else {
            $window.location.href = '/';
          }
        } else {
          ctrl.error = res.data;
        }
      });
    }
  }]
});
