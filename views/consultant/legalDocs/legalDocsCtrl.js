app.controller('consultantLegalDocsCtrl', function($scope, $rootScope, $state, $stateParams, $document, apiSrvc, commonFnSrvc,  NgTableParams, Upload, upload, $filter, blockUI, $http, $mdDialog, $mdToast, $timeout, $q,  $location, authSrvc, envSrvc, config) {

  $scope.myLegalDocsInit = function() {
    $scope.appDemo1GetConsultantEngagementDocuments();
    $scope.appDemo1GetConsultantPaymentDeliveryReceipts();
    $scope.appDemo1GetUserInformation();
  }

  $scope.appDemo1GetConsultantEngagementDocuments = function() {
    apiSrvc.getData('appDemo1GetConsultantEngagementDocuments').then(function(response){
      $scope.projectsWithSignatures = response.data;
    });
  }

  $scope.appDemo1GetConsultantPaymentDeliveryReceipts = function() {
    apiSrvc.getData('appDemo1GetConsultantPaymentDeliveryReceipts').then(function(response){
      $scope.consultantInvoices = response.data;
    });
  }


  $scope.appDemo1GetUserInformation = function() {
    apiSrvc.getData('appDemo1GetUserInformation').then(function(response){
      if(response.data.isAuthenticated) {
        $scope.userInfo = response.data;
        $scope.imageUrl = response.data.ImageFilename;
      }
    });
  }
});
