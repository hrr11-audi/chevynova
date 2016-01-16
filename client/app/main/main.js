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
    console.log(user, $rootScope);
    params = [$rootScope.loggedInUser, user];
    params = params.sort(function(a, b) {
      return a > b;
    });
    params = params.join('-');
    console.log(params);

    var FIREBASE = new Firebase('https://on-belay-next.firebaseio.com/' + params);
    var conversations = $firebaseObject(FIREBASE);

    $scope.showChat = true;
    $scope.recipient = user;
    $scope.conversations = FIREBASE;
    $scope.chatsView = [];
    //pull the msgs
    // conversations.$bindTo($scope, 'chats' + params);
    // conversations.$bindTo($scope, 'chats2');

    $scope.conversations.on('child_added', function(snapshot) {
      $scope.chatsView.push(snapshot.val());
      console.log(snapshot.key());
      console.log($scope.chatsView);
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
  //Testing, delete later
  $scope.sendMessage = function() {
    //var param = $rootScope.loggedInUser + '-' + $scope.recipient;
    var conversations = new Firebase('https://on-belay-next.firebaseio.com/' + params);
    //var cons = $firebaseObject(conversations);

    //cons.$bindTo($scope, 'chats');

    conversations.push({
        wasRead: false,
        users: { sender: $rootScope.loggedInUser, recipient: $scope.recipient },
        text: $scope.message.text
      });

    $scope.message.text = '';

  };

});
