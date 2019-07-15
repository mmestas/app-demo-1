function replyMsgCtrl($scope, $rootScope, $mdDialog, apiSrvc, commonFnSrvc, projectData, userInfoData) {
  $scope.projectData = projectData;
  console.log(projectData);
  $scope.userInfoData = userInfoData;
  $scope.hide = function() {$mdDialog.hide();};
  $scope.cancel = function() {$mdDialog.cancel();};
  $scope.errorMsg = false;
  $scope.msgSentSuccess = false;
  $scope.reply = function(projectData, msg) {
    $scope.errorMsg = false;
    $scope.msgSentSuccess = false;
    apiSrvc.sendPostData('appDemo1ProcessConsultantSendMessage&gpKey='+projectData.fromUser.gpKey+'&projectKey='+projectData.projectGpKey+'&msg='+msg).then(function(response){
      if(response.errors.length > 0) {
        $scope.errorMsg = true;
      }
      else {
        $scope.msgSentSuccess = true;
      }
    });
  }
}
