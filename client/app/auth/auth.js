angular.module('nova.auth', [])

.controller('AuthController', function ($scope, $rootScope, $window, $state, Auth, Notify) {
  $scope.user = {};
  $rootScope.unread = $rootScope.unread || 0;

  if (Auth.isAuth()) {
    $rootScope.hasAuth = true;
  }

  $scope.goToProfile = function(climber){
    ClimberProfile.climber.info = climber;
    $state.go('profile', {'userName':climber.first+climber.last});
  }

  $scope.signin = function () {
    Auth.signin($scope.user)
      .then(function (token) {
        $window.localStorage.setItem('com.nova', token);
        $rootScope.hasAuth = true;
        $state.go('main');
        // $scope.checkNotifications();
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  $scope.signup = function () {
    Auth.signup($scope.user)
      .then(function (token) {
        $window.localStorage.setItem('com.nova', token);
        $rootScope.hasAuth = true;
        $state.go('update');
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  $scope.checkNotifications = function() {
    if ($rootScope.hasAuth && $state.name !== 'notifications') {
      Notify.checkNotifications().then(function(resp) {
        $rootScope.unread = resp || 0;
      });
    }
  };
  // $scope.checkNotifications();
});
