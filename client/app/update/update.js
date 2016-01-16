angular.module('nova.update', [])

.controller('UpdateController', function($scope, $state, $rootScope, Update){
  $scope.user = { name: {first: '', last: ''} };
  $scope.update = function(){
    $rootScope.userName = $scope.user.first + $scope.user.last;
    Update.update($scope.user)
    .then(function (res) {
        $state.go('main');
      })
      .catch(function (error) {
        console.error(error);
      });
  };
});
