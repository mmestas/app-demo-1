function infoModalCtrl($scope, $rootScope, apiSrvc, commonFnSrvc, $mdDialog, $filter, dialogInfo) {
  $scope.dialogInfo = dialogInfo;
  $scope.hide = function() {$mdDialog.hide();};
  $scope.cancel = function() {$mdDialog.cancel();};

} //END
