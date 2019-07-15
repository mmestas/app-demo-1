function replyToMsgCtrl($scope, $rootScope, $mdDialog, apiSrvc, commonFnSrvc, msgReplyData, consultantData, $location, authSrvc, envSrvc, config) {

  $scope.msgReplyData = msgReplyData;
  $scope.consultantData = consultantData;
  $scope.hide = function() {$mdDialog.hide();};
  $scope.cancel = function() {$mdDialog.cancel();};

  $scope.reply = function(msgReplyData, msg) {
    console.log(msgReplyData);
    console.log(msg);
    $scope.errorMsg = false;
    $scope.msgSentSuccess = false;
    apiSrvc.sendPostData('appDemo1ProcessCompanyUserSendMessage&gpKey='+msgReplyData.fromUser.gpKey+'&projectKey='+$scope.msgReplyData.projectGpKey+'&msg='+msg).then(function(response){
      $scope.errorMsg = false;
      $scope.msgSentSuccess = false;
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
