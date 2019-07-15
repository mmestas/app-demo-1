function aysModalCtrl($scope, $rootScope, apiSrvc, commonFnSrvc, $mdDialog, projectData) {
  $scope.project = projectData;
  $scope.hide = function() {$mdDialog.hide();};
  $scope.cancel = function() {$mdDialog.cancel();};

  $scope.yesDelete = function() {
       apiSrvc.getData('appDemo1ProcessProjectDelete&gpKey='+projectData.gpKey).then(function(response) {
         $scope.projectIsDeleted = true;
         $scope.hide();
       })
     }

}
