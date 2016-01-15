angular.module('nova.main', [])

.controller('MainController', function($scope, $rootScope, Climbers, Notify, Auth, $firebaseObject){
  // var param = '-K82b6x8j9uXqIclfUel';
  // var FIREBASE = new Firebase('https://on-belay.firebaseio.com/' + param);

  // var conversations = $firebaseObject(FIREBASE);

  // conversations.$bindTo($scope, 'data');

  $scope.activeClimbers = [];
  $scope.status = false;

  $scope.getActiveClimbers = function(){
    Climbers.getClimbers()
      .then(function(res) {
        $scope.activeClimbers = res;
      })
      .catch(function(err) {
        console.error(err);
      });
  }();

  $scope.getStatus = function() {
    Climbers.getStatus().then(function(res) {
      $scope.status = res.status;
    });
  }();

  $scope.updateStatus = function() {
    Climbers.updateStatus().then(function(res) {
      console.log(res);
    });
  };

  $scope.climbOn = function(climber) {
    Notify.sendNotification(climber)
      .then(function(res) {
        console.log(res);
      })
      .catch(function(err) {
        console.error(err);
      });
  };
  //Testing, delete later
  $scope.contactMe = function(id) {
  var param = $rootScope.loggedInID + '-' + id;
  var conversations = new Firebase('https://on-belay.firebaseio.com/' + param);

  var cons = $firebaseObject(conversations);

  cons.$bindTo($scope, 'data');

  conversations.push(
    { wasRead: false,
        users: { sender: 'Delphine', recipient: 'Sean' },
        text: 'Octopus'
    }
  );
/*
      { wasRead: false,
        users: { sender: 'Delphine', recipient: 'Santosh' },
        text: 'Starfish'
      }*/
  };

});
