angular.module('hackathonRegistrationApp').factory('team', ['$http', '$window', '$httpParamSerializer', function($http, $window, $httpParamSerializer) {
  var team = {};

  team.registerTeam = function(teamData) {
    return $http.post('/api/register-team', teamData).then(
      function success(res) {
        return res;
      }, function error(res) {
        return res;
      }
    );
  }

  //Return factory instance
  return team;
}]);
