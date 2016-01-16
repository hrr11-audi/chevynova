angular.module('nova.main', [])


.controller('MainController', function($scope, $rootScope, Climbers, Notify, Auth, $state, $firebaseObject){


  // var param = '-K82b6x8j9uXqIclfUel';
  // var FIREBASE = new Firebase('https://on-belay.firebaseio.com/' + param);
  // var conversations = $firebaseObject(FIREBASE);
  // conversations.$bindTo($scope, 'data');

  $scope.activeClimbers = [];
  $scope.status = false;
  $scope.message = {};
  $scope.showChat = false;
  var params = '';

  $scope.displayChat = function(user) {
    params = [$rootScope.loggedInUser, user];
    params = params.sort(function(a, b) {
      return a > b;
    });
    params = params.join('-');

    var FIREBASE = new Firebase('https://on-belay-1.firebaseio.com/conversations/' + params);
    var conversations = $firebaseObject(FIREBASE);

    $scope.showChat = true;
    $scope.recipient = user;
    $scope.conversations = FIREBASE;
    $scope.chatsView = {};

    $scope.conversations.on('child_added', function(snapshot) {
      $scope.chatsView[snapshot.key()] = snapshot.val();
    });

  };

  $scope.goToProfile = function(climber){
    ClimberProfile.climber.info = climber;
    $state.go('profile', {'userName':climber.first+climber.last});
  }


  $scope.getActiveClimbers = function(){
    Climbers.getClimbers()
      .then(function(res) {
        $scope.activeClimbers = res;
        console.log($scope.activeClimbers);
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

  var called = false;

  //Testing, delete later
  $scope.sendMessage = function() {
    //var conversations = new Firebase('https://on-belay-1.firebaseio.com/' + params);

    // var inbox = new Firebase('https://on-belay-next.firebaseio.com/inbox')
    var MAIN = new Firebase('https://on-belay-1.firebaseio.com');
    var conversations = MAIN.child('conversations/' + params);
    var inbox = MAIN.child('inbox');
    var senderInbox = inbox.child($rootScope.loggedInUser);
    var recipientInbox = inbox.child($scope.recipient);

    conversations.push({
      wasRead: false,
      users: { sender: $rootScope.loggedInUser, recipient: $scope.recipient },
      text: $scope.message.text
    });

    senderInbox.child(params).push({
      hasMessages: true
    });

    recipientInbox.child(params).push({
      hasMessages: true
    });

    if(!called) {
      called = true;
      recipientInbox.child('unread').transaction(function(currentVal) {
        return(currentVal || 0) + 1;
      });
    }

    $scope.message.text = '';

  };

});
