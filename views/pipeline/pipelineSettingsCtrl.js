app.controller('pipelineSettingsCtrl', function($rootScope, $scope, $state, $stateParams, apiSrvc, commonFnSrvc, Upload, upload, $filter, blockUI, $http, $mdDialog, $location, $timeout, $q, authSrvc, envSrvc, config, $compile) {

  $scope.pipelineSettingsInit = function() {
    var verifyActiveAcct = function(response) {
      if(response) {
        authSrvc.getUserInfoForCompanyInfo($scope);
        $scope.appDemo1GetPipelineStages();
      }
    }
    commonFnSrvc.getAccountStatus($scope, verifyActiveAcct);
  }

  $scope.appDemo1GetPipelineStages = function() {
    apiSrvc.getData('appDemo1GetPipelineStages').then(function(response){
      $scope.pipelineStages = response.data.companyStages;
      $scope.numberOfStages = response.data.numberOfStages;
    })
  }

  $scope.appDemo1SetPipelineStages = function(pipelineStages) {
    var numberOfStages = $scope.numberOfStages;
    objectToSend = {
      numberOfStages: numberOfStages,
      companyStages: pipelineStages
    }
    apiSrvc.sendPostData('appDemo1SetPipelineStages', objectToSend).then(function(response){
      if(response.errors.length > 0) {}
      else {
        $state.go('pipeline');
      }
    })
  }

});
