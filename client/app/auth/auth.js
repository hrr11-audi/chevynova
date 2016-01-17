angular.module('nova.auth', [])

.controller('AuthController', function ($scope, $rootScope, $window, $state, Auth, Notify, $firebaseObject) {
  $scope.user = {};
  $rootScope.unreadMessages = $rootScope.unreadMessages || 0;

  $scope.checkGeoLocation = function(cb) {
    if (navigator.geolocation) {
      console.log('Geolocation is supported!');
      $scope.getUserLocation(cb);
    }
    else {
      console.log('Geolocation is not supported for this Browser/OS version yet.');      
    }
  }

  $scope.getUserLocation = function(cb) {  
      var startPos;
      var geoSuccess = function(position) {
        startPos = position;
        cb(startPos.coords.latitude,startPos.coords.longitude);
      };
      var geoError = function(error) {
        console.log('Error occurred. Error code: ' + error.code);
        // error.code can be:
        //   0: unknown error
        //   1: permission denied
        //   2: position unavailable (error response from location provider)
        //   3: timed out
      };
      navigator.geolocation.getCurrentPosition(geoSuccess,geoError);

  }


  if (Auth.isAuth()) {
    $rootScope.hasAuth = true;
  }

  $scope.goToProfile = function(climber){
    ClimberProfile.climber.info = climber;
    $state.go('profile', {'userName':climber.first+climber.last});
  }

  $scope.signin = function () {
    $scope.checkGeoLocation(function(lat,lng){
      $scope.user.lat = lat;
      $scope.user.lng = lng;
    })
    Auth.signin($scope.user)
      .then(function (token) {
        var inbox = new Firebase('https://on-belay-1.firebaseio.com/inbox/' + $rootScope.loggedInUser);
        $window.localStorage.setItem('com.nova', token);
        $rootScope.hasAuth = true;
        //put an event listener on the user's urls
        inbox.on('child_changed', function(childSnapShot) {
          var conversation = new Firebase('https://on-belay-1.firebaseio.com/conversations/' + childSnapShot.key());
          var allMessages = {};
          conversation.on('value', function(snapshot) {
            allMessages[snapshot.key()] = snapshot.val();
          });
          for(var key in allMessages) {
            for(var k in allMessages[key]) {
              // console.log(allMessages[key][k]);
              console.log(allMessages[key][k][user][recipient] === $rootScope.loggedInUser && !allMessages[key][k][wasRead])
              if (allMessages[key][k][user][recipient] === $rootScope.loggedInUser && !allMessages[key][k][wasRead]) {
                //increment the notification count and get out of this loop
                $rootScope.unreadMessages++;
                break;
              }
            }
          }
        });
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
