function expertDetailsModalCtrl($scope, $rootScope, apiSrvc, commonFnSrvc, $mdDialog, $mdToast, expertDetails, envURL) {

  $scope.envURL = envURL;
  console.log($scope.envURL);
  $( document ).ready(function() {$(".myrating").rating({displayOnly: true, step: 0.5});});
  $scope.expertDetails = expertDetails;
  $scope.cancel = function() {$mdDialog.cancel();};
  $(".myrating").rating({displayOnly: true, step: 0.5});
  var dateString = expertDetails.joinDate.substr(6);
  var joinDate = new Date(parseInt(dateString));
  $scope.joinDate = joinDate;

  apiSrvc.getData('appDemo1GetConsultantRatings&gpKey='+expertDetails.gpKey).then(function(response){
    $scope.consultantRatings = response.data;
    console.log($scope.consultantRatings);
  });

  $scope.limitValue = 3;
  $scope.showAllReviews = function(lengthOfReviews) {
    if($scope.limitValue == lengthOfReviews) {
      $scope.limitValue = 3;
    }
    else {
      $scope.limitValue = lengthOfReviews;
        $(".referenceRating").rating({displayOnly: true, step: 0.5});
    }
  }

  //////////////////// Show Engagement Invite Modal  ////////////////////////
  $rootScope.openEIModal = false;
  $scope.closeAndOpenEIModal = function() {
    $rootScope.openEIModal = true;
    $mdDialog.cancel();
  }
  $rootScope.openSMModal = false;
  $scope.closeAndOpenSMModal = function() {
    $rootScope.openSMModal = true;
    $mdDialog.cancel();
  }
}
