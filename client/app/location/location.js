angular.module('nova.location', [])
  .controller('LocationController', ['$scope', '$window', '$http', 'Location', function($scope,$window, $http, Location){

    // We are running hte process indicated in the Location Factory
    Location.getSortedListOfUsersByShortestDistance();

    
}])
