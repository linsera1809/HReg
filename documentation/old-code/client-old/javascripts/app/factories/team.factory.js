angular.module('hackathonRegistrationApp').factory('team', ['$http', '$window', '$httpParamSerializer', function($http, $window, $httpParamSerializer) {
  var team = {};

  team.registerTeam = function(teamData) {
    return $http.post('/api/register-team', teamData).then(
      function success(response) {
        $window.location.href = '/dev-output/?' + $httpParamSerializer(teamData);
      }, function error(response) {
        $window.location.href = '/dev-output/?' + $httpParamSerializer(response.data);
      }
    );
  }

  //Return factory instance
  return team;
}]);
