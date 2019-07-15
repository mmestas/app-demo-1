function errorModalCtrl($scope, $rootScope, apiSrvc, commonFnSrvc, $mdDialog, $filter, dialogErrorMsg) {
  $scope.dialogErrorMsg = dialogErrorMsg;
  $scope.hide = function() {$mdDialog.hide();};
  $scope.cancel = function() {$mdDialog.cancel();};

} //END
