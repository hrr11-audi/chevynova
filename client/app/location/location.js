angular.module('nova.location', [])
  .controller('LocationController', ['$scope', '$window', '$http', function($scope,$window, $http){
  
  $scope.checkGeoLocation = function() {
    if (navigator.geolocation) {
      console.log('Geolocation is supported!');
    }
    else {
      console.log('Geolocation is not supported for this Browser/OS version yet.');
    }
  }

  $scope.sendTestRequest = function(userZipcode,cb){
    $http({
      method: 'POST',
      url: '/api/location', //Server should have /api/location path defined
      data: {userZipcode: userZipcode}
    }).success(function(data){
      console.log(data, 'this is from the location.js on client');
      cb(data)
    });
  }

  $scope.currentUserPosition = {};

  $scope.getUserLocation = function(cb) {  
      var startPos;
      var geoSuccess = function(position) {
        startPos = position;
        document.getElementById('startLat').innerHTML = startPos.coords.latitude;
        document.getElementById('startLon').innerHTML = startPos.coords.longitude;
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
  


  $scope.getDistance = function(p1,p2,cb) {
  
    googleMapsObj1 =  new google.maps.LatLng(p1.lat, p1.lng);
    googleMapsObj2 = new google.maps.LatLng(p2.lat, p2.lng);
    var distance = google.maps.geometry.spherical.computeDistanceBetween(googleMapsObj1, googleMapsObj2);
    console.log(distance);
    //distance in meters
    return distance;
  }

  // WE will need to store an object on every user on some event that represents their latlng
  // From there this can make a request to the server get their 

  $scope.listOfDistancesToUserSorted = {};
  var testObject2 = {lat: 38.6444652, lng: -90.2615356 };
  // listOfDistances is a list of lat and lng objects with user properties attached
  var listOfDistances = [];
  // Make ZipCode mandatory that way we can store their zip codes and filter by nearest zipCode
  // array of objects that contain user distances from here we can filter and sort

  $scope.getUserLocation(function(lat,lng){
    $scope.currentUserPosition.lat = lat;
    $scope.currentUserPosition.lng = lng;
    var listOfDistancesToUser = [];
    $scope.sendTestRequest(63108, function(listOfUsers){

    listOfDistances.forEach(function(user){
      var constructorObject = {};
      //$scope.getDistance finds  the lat and lng property of hte user object already so we only need to pass the user object
      constructorObject.distanceToUser = $scope.getDistance($scope.currentUserPosition, user);
      constructorObject.user = user;
      listOfDistancesToUser.push(constructorObject);
    });

    });
    // Now we have a list of distances to the user

    

    
    // Now we have a list of distances from the current user. 
    function quickSortArrayObjects(array){

      var sorted = false;

      while(!sorted){
        sorted = true;
        for (var i = 0; i < array.length; i++){
            if(array[i+1].distanceToUser <= array[i].distanceToUser ){
              var a = array[i+1];
              array[i+1] = array[i];
              array[i] = a;
              sorted = false;
          }
        }
      }
        return array;
    }

    var listOfDistancesToUserSorted = quickSortArrayObjects(listOfDistancesToUser);

    $scope.listOfDistancesToUserSorted = listOfDistancesToUserSorted;

  });
  
  $scope.checkGeoLocation();

    
}])
