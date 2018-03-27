angular.module('hackathonRegistrationApp').factory('user', ['$http', function($http) {
  var user = {};

  //=====================
  //======= Login =======
  //=====================
  user.login = function(credentials) {
    return $http.post('/user/login', credentials).then(
      function success(res) {
        return res;
      }, function error(res) {
        return res;
      }
    );
  }

  //=====================
  //======= Signup =======
  //=====================
  user.signup = function(credentials) {
    return $http.post('/user/signup', credentials).then(
      function success(res) {
        return res;
      }, function error(res) {
        return res;
      }
    );
  }

  //===============================
  //======= Change Password =======
  //===============================
  user.changePassword = function(credentials) {
    return $http.post('/user/change-password', credentials).then(
      function success(res) {
        return res;
      }, function error(res) {
        return res;
      }
    );
  }

  //===============================
  //======= Forgot Password =======
  //===============================
  user.forgotPassword = function(email) {
    return $http.post('/user/forgot-password', {email: email}).then(
      function success(res) {
        return res;
      }, function error(res) {
        return res;
      }
    );
  }

  //==============================
  //======= Reset Password =======
  //==============================
  user.resetPassword = function(passwordData) {
    var data = {
      password: passwordData.password,
      confirmPassword: passwordData.confirmPassword
    }
    return $http.post('/user/reset-password/' + passwordData.query, data).then(
      function success(res) {
        return res;
      }, function error(res) {
        return res;
      }
    );
  }

  //Return factory instance
  return user;
}]);
