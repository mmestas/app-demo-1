app.controller('teammateMatchCtrl', function($rootScope, $scope, $state, $stateParams, apiSrvc, commonFnSrvc, Upload, upload, $filter, blockUI, $http, $mdDialog, $location, $q, $timeout, authSrvc, envSrvc, config) {

  $scope.teammateMatchInit = function() {  
    var verifyActiveAcct = function(response) {
      if(response) {
        authSrvc.getUserInfo($scope);
        $scope.appDemo1GetTeamMateMatchOpportunities();
        $scope.appDemo1GetTeamMateMatchSearchs();
      }
    }
    commonFnSrvc.getAccountStatus($scope, verifyActiveAcct);
  };
  //Get the Company Info
  $scope.appDemo1GetCompanyProfile = function(userInfo) {
    apiSrvc.getData('appDemo1GetCompanyProfile&gpKey='+userInfo.Company.gpKey).then(function(response) {
      console.log(response.data);
      $scope.companyInfo = response.data;
      $rootScope.companyInfo = response.data;
    })
  }

  $scope.appDemo1GetTeamMateMatchOpportunities = function() {
    apiSrvc.getData('appDemo1GetTeamMateMatchOpportunities').then(function(response) {
      $scope.opportunities = response.data;
    })
  }
  //Saved Searches
  $scope.appDemo1GetTeamMateMatchSearchs = function() {
    apiSrvc.getData('appDemo1GetTeamMateMatchSearchs').then(function(response) {
      $scope.savedSearches = response.data;
    })
  }
  $scope.appDemo1SetTeamMateMatchSearch = function() {

  }
  $scope.appDemo1ProcessTeamMateSearch = function(values) {
    console.log(values);
    if(!values.rfpNumber) {
      values.rfpNumber = '';
    }
    if(!values.opportunity.name) {
      values.opportunity.name = '';
      values.opportunity.gpKey = '';
      values.opportunity.source = null;
    }
    var objectToPost = {
      name: values.opportunity.name,
      gpKey: values.opportunity.gpKey,
      source: values.opportunity.source,
      rfpNumber: values.rfpNumber
    }
    apiSrvc.sendPostData('appDemo1ProcessTeamMateSearch', objectToPost).then(function(response){
      console.log(response);
    });
  }
  $scope.appDemo1ProcessSendTeamMateMessage = function() {

  }



  // Open the Modal //
  // $scope.openModal = function(ev, result) {
  //   $mdDialog.show({
  //     controller: modalCtrl,
  //     templateUrl: '/views/teammateMatch/modal.html',
  //     parent: angular.element(document.querySelector('.gp-detailWrapper')),
  //     targetEvent: ev,
  //     clickOutsideToClose:true,
  //     locals: {
  //         result: result
  //     },
  //     onRemoving: function (event, removePromise) {
  //     }
  //   });
  // };

  $scope.teammateMatchInit();
});
