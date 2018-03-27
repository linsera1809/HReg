angular.module('hackathonRegistrationApp').component('userNav', {
  templateUrl: 'user-nav/user-nav.template.html',
  bindings: {
    userEmail: '@'  //string value, email of logged in user
  }
});
