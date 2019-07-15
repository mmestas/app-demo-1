function IOMsgCtrl($scope, $rootScope, $mdDialog, apiSrvc, commonFnSrvc, projectData, consultantData, authSrvc, envSrvc, config) {
  $scope.projectData = projectData;
  $scope.consultantData = consultantData;
  $scope.hide = function() {$mdDialog.hide();};
  $scope.cancel = function() {$mdDialog.cancel();};

  $scope.sendMessage = function(companyInfo, msg) {
    $scope.errorMsg = false;
    $scope.msgSentSuccess = false;
    apiSrvc.getData('appDemo1ProcessCompanyUserSendMessage&gpKey='+companyInfo.owner.gpKey+'&projectKey='+projectData.gpKey+'&msg='+msg).then(function(response){
      console.log(response);
      if(response.errors.length > 0) {
        $scope.errorMsg = true;
      }
      else {
        $scope.msgSentSuccess = true;
      }
    });
  }

}
