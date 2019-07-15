function osDetailsCtrl($scope, $rootScope, apiSrvc, commonFnSrvc, $mdDialog, opportunityDetails) {

  console.log(opportunityDetails);
  $scope.opportunityDetails = opportunityDetails;

  /********************************** CALLS **********************************/
  $scope.closeAndOpenAddOpp = function(opportunity) {
    $scope.openAddToPipeline = true;
    $mdDialog.cancel();
  }
  /**********************************  **********************************/

  $scope.hide = function() {$mdDialog.hide();};
  $scope.cancel = function() {$mdDialog.cancel();};

} //END
