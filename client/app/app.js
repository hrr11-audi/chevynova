angular.module('nova', [
  'nova.auth',
  'nova.services',
  'ui.router',
  'nova.main',
  'nova.update',
  'nova.notifications',
  'firebase'
])

.config(function($stateProvider, $urlRouterProvider, $httpProvider){
  $urlRouterProvider.otherwise("/signin");
  $stateProvider
    .state('main', {
      url: "/main",
      templateUrl: "app/main/main.html",
      controller: "MainController"
    })
    .state('signin', {
      url: "/signin",
      templateUrl: "app/auth/signin.html",
      controller: "AuthController"
    })
    .state('signup', {
      url: "/signup",
      templateUrl: "app/auth/signup.html",
      controller: "AuthController"
    })
    .state('update', {
      url: "/update",
      templateUrl: "app/update/update.html",
      controller: "UpdateController"
    })
    .state('logout', {
      url: "/logout",
      controller: function($scope, Auth){
        Auth.signout();
      }
    })
    .state('notifications', {
      url: "/notifications",
      templateUrl: "app/notifications/notifications.html",
      controller: "NotificationCtrl"
    });

    $httpProvider.interceptors.push('AttachTokens');
})

.factory('AttachTokens', function($window){
  var attach = {
    request: function(object) {
      var jwt = $window.localStorage.getItem('com.nova');
      if (jwt) {
        object.headers['x-access-token'] = jwt;
      }
      object.headers['Allow-Control-Allow-Origin'] = '*';
      return object;
    }
  };
  return attach;
})

.run(function($rootScope, $state, $window, Auth) {
  $rootScope.loggedInUser =  $window.localStorage.getItem('loggedInUser');
  console.log($rootScope);
  $rootScope.$on('$stateChangeStart', function(evt, toState, toParams, fromState, fromParams){
    if (toState.name === 'signin') {
      return;
    }
    if (!Auth.isAuth() && toState.name !== 'signup'){
      evt.preventDefault();
      $state.go('signin');
    }
  });
});
