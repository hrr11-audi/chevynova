angular.module('nova.profile', [])

.controller('ProfileController', function($rootScope, $scope, Climber, $stateParams){
  $scope.getClimberInfo = function(climber){
    Climber.getClimberInfo(climber)
      .then(function(res){
        $scope.user = res;
      })
      .catch(function(err){
        console.log(err);
      });
  }($stateParams.username);

});

