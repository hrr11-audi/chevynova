angular.module('nova.services', [])

.factory('Auth', function($http, $rootScope, $state, $window){

  var signin = function(user){
    return $http({
      method: 'POST',
      url: '/api/signin',
      data: user
    })
    .then(function(resp){
      console.log(resp.data);
      $window.localStorage.setItem('loggedInUser', resp.data.loggedInUser);
      $rootScope.loggedInUser = resp.data.loggedInUser;
      return resp.data.token;
    });
  };

  var signup = function(user){
    return $http({
      method: 'POST',
      url: '/api/signup',
      data: user
    })
    .then(function(resp){
      $rootScope.loggedInUser = resp.data.username;
      return resp.data.token;
    })
    .catch(function(err) {
      $state.go('signup');
    });
  };

  var signout = function(){
    $rootScope.hasAuth = false;
    $rootScope.loggedInUser = '';
    $window.localStorage.removeItem('com.nova');
    $window.localStorage.removeItem('loggedInUser');

    $state.go('signin');
  };

  var isAuth = function(){
    return !!$window.localStorage.getItem('com.nova');
  };

  return {
    signin: signin,
    signup: signup,
    signout: signout,
    isAuth: isAuth
  };
})

.factory('Climbers', function($http){

  var getClimbers = function(){
    return $http({
      method: 'GET',
      url: "/api/auth/user/climbers"
    }).then(function(res){
      return res.data;
    });
  };

  var getStatus = function() {
    return $http({
      method: 'GET',
      url: '/api/auth/user/flag'
    }).then(function(resp) {
      return resp.data;
    });
  };

  var updateStatus = function(climber) {
    climber = climber || false;
    return $http({
      method: 'PUT',
      url: '/api/auth/user/flag',
      data: {from: climber}
    }).then(function(resp) {
      return resp.data;
    });

  };

  return {
    getStatus: getStatus,
    updateStatus: updateStatus,
    getClimbers: getClimbers
  };

})

.factory('Update', function($http){
  var update = function(user){
    return $http.put('/api/auth/user/update', user)
    .then(function(response){
      return response.data;
    })
    .catch(function(err){
      console.error(err);
    });
  };
  var updateProfileImg = function(img){
    console.log(img);
    return $http({
      method: 'PUT',
      url:'/api/auth/user/updateProfileImg',
      data: {
        img: img
      }
    })
    .then(function(res){
      return res.data;
    });
  }

  return {
    update: update,
    updateProfileImg: updateProfileImg
  };

})

.factory('Notify', function($http, $rootScope) {

  var sendNotification = function(climber) {
    return $http({
      method: 'POST',
      url: '/api/auth/user/notifications/create',
      data: {targetUser: climber}
    }).then(function(res) {
      return res.data;
    });
  };

  var checkNotifications = function() {
    return $http({
      method: 'GET',
      url: '/api/auth/user/notifications/unread'
    }).then(function(resp) {
      return resp.data;
    });
  };

  var fetchAllNotifications = function() {
    return $http({
      method: 'GET',
      url: '/api/auth/user/notifications/incoming'
    }).then(function(res) {
      return res.data;
    });
  };

  var markAllNotificationsRead = function() {
    return $http({
      method: 'PUT',
      url: '/api/auth/user/notifications/read'
    }).then(function(resp) {
      console.log(resp.data);
      $rootScope.unread = 0;
      return resp.data;
    });
  };

  var replyToClimber = function(climber) {
    return $http({
      method: 'PUT',
      url: '/api/auth/user/notifications/reply',
      data: {
        notificationId: climber.id,
        reply: true
      }
    }).then(function(res) {
      return res.data;
    });
  };

  return {
    sendNotification: sendNotification,
    checkNotifications: checkNotifications,
    fetchAllNotifications: fetchAllNotifications,
    markAllNotificationsRead: markAllNotificationsRead,
    replyToClimber: replyToClimber
  };

})
.factory('Climber', function($http){
  var getClimberInfo = function(climber){
    console.log('inside Climber Factory');
    return $http({
      method: 'GET',
      url: '/api/auth/user/climber/'+climber
    }).then(function(res){
      return res.data;
    });
  };

  return {
    getClimberInfo: getClimberInfo
  };
});
