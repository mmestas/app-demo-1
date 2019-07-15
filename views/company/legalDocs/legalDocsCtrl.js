app.controller('legalDocsCtrl', function($scope, $rootScope, $state, $stateParams, $document, apiSrvc, commonFnSrvc,  NgTableParams, Upload, upload, $filter, blockUI, $http, $mdDialog, $mdToast, $timeout, $q, $location, authSrvc, envSrvc, config) {

  $scope.legalDocsInit = function() {  
    var verifyActiveAcct = function(response) {
      if(response) {
        $scope.appDemo1GetCompanyEngagementDocuments();
        authSrvc.getUserInfo($scope);
      }
    }
    commonFnSrvc.getAccountStatus($scope, verifyActiveAcct);
  }

  $scope.appDemo1ProcessLogout = function() {
    apiSrvc.getData('appDemo1ProcessLogout').then(function(response){
      $state.go('signIn');
    });
  }
  $scope.appDemo1GetCompanyEngagementDocuments = function() {
    apiSrvc.getData('appDemo1GetCompanyEngagementDocuments').then(function(response){
      $scope.projectsWithSignatures = response.data;
    });
  }
  $scope.appDemo1GetCompanyApprovedPaymentDeliveryReceipts = function() {
    if($scope.approvedPayments) {

    }
    else {
      apiSrvc.getData('appDemo1GetCompanyApprovedPaymentDeliveryReceipts').then(function(response) {
        $scope.approvedPayments = response.data;
      });
    }

  }

}); //End of Controller
