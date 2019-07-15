app.controller('designUICtrl', function($rootScope, $scope, $state, $stateParams, $location, $document,  $timeout, apiSrvc, commonFnSrvc, NgTableParams, Upload, upload, $filter, blockUI, $http, $mdDialog, $mdToast) {
console.log('UI Controller');

  $scope.openModal = function(ev) {
    $mdDialog.show({
      controller: BMCtrl,
      templateUrl: '/views/designUI/modals/basicModal.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose:true,
    });
  }
  function BMCtrl($scope, $rootScope, $mdDialog, apiSrvc) {
    $scope.hide = function() {$mdDialog.hide();};
    $scope.cancel = function() {$mdDialog.cancel();};
  };

});
