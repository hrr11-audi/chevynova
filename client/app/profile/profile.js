angular.module('nova.profile', [])

.controller('ProfileController', function($rootScope, $scope, Climber, Update, $stateParams){
  $scope.updatingPic = false;

  $scope.getClimberInfo = function(climber){
    Climber.getClimberInfo(climber)
      .then(function(res){
        $scope.user = res;
      })
      .catch(function(err){
        console.log(err);
      });
  }($stateParams.username);

  $scope.imageUpload = function(event){
    var files = event.target.files; //FileList object
    var file = files[0];
    var reader = new FileReader();
    
    reader.onload = $scope.imageIsLoaded; 
    reader.readAsDataURL(file);
  }

  $scope.imageIsLoaded = function(e){
    $scope.$apply(function() {
      $scope.user.profileImg = e.target.result;
      $scope.updatingPic = false;
      Update.updateProfileImg(e.target.result)
        .then(function(res){
          console.log(res);
        });
      
      
    });
  }

  $scope.updatePic = function(){
    $scope.updatingPic = true;  
  }

});

