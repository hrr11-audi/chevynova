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

.factory('HandleRequest', ['$http', '$rootScope', '$state', function($http, $rootScope, $state) {


    var getRequest = function(url) {
      return $http({
        method: 'GET',
        url: url
      });
    };

    var postRequest = function(url, data) {
      return $http({
        method: 'POST',
        url: url,
        data: data
      });
    };

    return {
      getRequest: getRequest,
      postRequest: postRequest
    };
  
}])

.factory('Location', ['$http', '$rootScope', function($http, $rootScope){

  //Most of the work starts on line 72 when we start a chain of callbacks calling getUserLocation
  // Because getUserLocation checks if 

  var checkGeoLocation = function() {
    if (navigator.geolocation) {
      console.log('Geolocation is supported!');
    }
    else {
      console.log('Geolocation is not supported for this Browser/OS version yet.');
    }
  }

  var sendTestRequest = function(userZipcode,cb){
    
    $http({
      method: 'POST',
      url: '/api/location', //Server should have /api/location path defined
      data: {userZipcode: userZipcode}
    }).success(function(data){
      console.log(data, 'this is from the location.js on client');
      cb(data)
    });
  }

  currentUserPosition = {};
  listOfDistancesToUserSorted = {};
  // listOfDistances is a list of lat and lng objects with user properties attached
  var listOfDistances = [];
  



  // This is the function that gets the user's location to use in the rest of the functions.
  // The call back is important to make sure the order is correct.
  var getUserLocation = function(cb) {  
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
  


  var getDistance = function(p1,p2,cb) {
    
  // We will get information from the database with a lat and lng property

    googleMapsObj1 =  new google.maps.LatLng(p1.lat, p1.lng);
    googleMapsObj2 = new google.maps.LatLng(p2.lat, p2.lng);
    var distance = google.maps.geometry.spherical.computeDistanceBetween(googleMapsObj1, googleMapsObj2);
    
    //distance in meters
    return distance;
  }

  var sortArrayObjects = function(array){
      // assumes our array is an array of objects with property distanceToUser that it sorts by
    return array.sort(function(a,b){
      return a.distanceToUser - b.distanceToUser;
    })
  }
  
  
  // Make ZipCode mandatory that way we can store their zip codes and filter by nearest zipCode
  
  getSortedListOfUsersByShortestDistance = function(userZipcode) {
    // We call this function to get the list of users sorted, we may want to pass in a userZipCode that we would get from the controller itself.
      // This is a chain of calls from the previous functions.
        // in our controller we want to run Location.getSortedListoFUsersByShortestDistance(optionalZipCode);
    getUserLocation(function(lat,lng){
     currentUserPosition.lat = lat;
     currentUserPosition.lng = lng;

      var listOfDistancesToUser = [];
      // Need to get user's zipcode. Probably  within whatever controller we use. 
      var userZipcode = userZipcode || 63108;

        sendTestRequest(userZipcode, function(listOfUsers){
          //We are getting a list of user's from the server 
          // We have a route whose only purpose is to get users filtered by location that we pass in.
            // Route exists in sendTestRequest api/location
          listOfUsers.forEach(function(user){
            var constructorObject = {};
            //getDistance finds  the lat and lng property of hte user object already so we only need to pass the user object that we get from the server.            
              // Now we can construct the array of objects that contain user and their distance to the current logged in user.
            constructorObject.distanceToUser = getDistance(currentUserPosition, user);
            constructorObject.user = user;
            listOfDistancesToUser.push(constructorObject);
          }); 

          // Now we have a list of distances to the user and we can sort by those distances
            var listOfDistancesToUserSorted = sortArrayObjects(listOfDistancesToUser);
            console.log(listOfDistancesToUserSorted, ' post sorting');
            // This array contains users that are sorted.
            return listOfDistancesToUserSorted; 
        });
      });
  }

  return {
    checkGeoLocation: checkGeoLocation,
    sendTestRequest: sendTestRequest,
    getUserLocation: getUserLocation,
    getDistance: getDistance,
    sortArrayObjects: sortArrayObjects,
    getSortedListOfUsersByShortestDistance: getSortedListOfUsersByShortestDistance
  };
  
}])
  

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
