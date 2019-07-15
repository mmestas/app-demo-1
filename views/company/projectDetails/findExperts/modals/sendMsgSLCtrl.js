function sendMsgSLCtrl($scope, $rootScope, apiSrvc, commonFnSrvc, $mdDialog, slInfo, userInfo, projectInfo, envURL) {
  $scope.envURL = envURL;
  $scope.allowSendSLMessage = false;
  $scope.slInfoData = slInfo;
  $scope.userInfoData = userInfo;
  $scope.projectInfoData = projectInfo;

  $scope.hide = function() {$mdDialog.hide();};
  $scope.cancel = function() {$mdDialog.cancel();};
  $scope.backToDashboard = function() {
    $rootScope.closeAndGoToDash = true;
    $mdDialog.cancel();
  }
  $scope.makeAnonymous = false;
  $scope.sendSLMessage = function(slMessage, makeAnonymous) {
    apiSrvc.sendPostData('appDemo1ProcessConsultantSendMessage&gpKey ='+$scope.slInfoData.gpKey+'&projectKey='+$scope.projectInfoData.gpKey+'&messageAnonymous='+makeAnonymous+'&msg='+slMessage).then(function(response){
      $scope.allowSendSLMessage = true;
    });
  }
}
