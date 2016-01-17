angular.module('nova.notifications', [])

  .controller('NotificationCtrl', function($scope, Notify, Climbers) {
    $scope.notifications = [];


    /*$scope.getAllNotifications = function() {
      Notify.fetchAllNotifications()
        .then(function(res) {
          $scope.notifications = res;
        })
        .catch(function(err) {
          console.error(err);
        });
    }();

    $scope.readAllNotifications = function() {
      Notify.markAllNotificationsRead()
        .then(function(res) {
          console.log(res);
        })
        .catch(function(err) {
          console.error(err);
        });
    }();*/

    $scope.climbOn = function(climber) {
      Notify.replyToClimber(climber)
        .then(function(res) {
          console.log(res);
          // Turn flags off for both users
          Climbers.updateStatus(climber)
            .then(function(res) {
              console.log(res);
            })
            .catch(function(err) {
              console.error(err);
            });
        })
        .catch(function(err) {
          console.error(err);
        });
    };

  });
