app.service('commonFnSrvc', function ($http, apiSrvc, blockUI, $q, $state, $mdToast, $document) {

  // COMPANY functions
  this.appDemo1GetCompanyUsers = function(scope) {
    console.log('commonFnSrvc appDemo1GetCompanyUsers');
    apiSrvc.getData('appDemo1GetCompanyUsers').then(function(response){
        //rename later so only one scope
        scope.companyPointOfContacts = response.data;
        scope.companyUsers = response.data;
    })
  };
  this.appDemo1GetCompanyInformation = function(scope) {
    apiSrvc.getData('appDemo1GetCompanyInformation').then(function(response){
      scope.companySnapshots = response.data.CompanySnapshots;
      scope.companyInfoBoxes = response.data.CompanyInfoBoxes;
    });
  };
  this.appDemo1GetCompanyProfile = function(scope, userInfo) {
    apiSrvc.getData('appDemo1GetCompanyProfile&gpKey='+userInfo.Company.gpKey).then(function(response) {
      scope.companyInfo = response.data;
      scope.certificationList = response.data.certifications;
      scope.businessTypeList = response.data.businessTypes;
      scope.additionalNaicsCodes = response.data.additionalNaicsCodes;
    })
  };
  this.appDemo1GetProjectStatusList = function(scope) {
    apiSrvc.getData('appDemo1GetProjectStatusList').then(function(response){
      scope.projectStatusList = response.data;
    });
  };
  this.appDemo1GetPlanInformation = function(scope) {
    apiSrvc.getData('appDemo1GetPlanInformation').then(function(response){
      scope.planInformation = response.data;
      scope.feeAmt = response.data.Fee;
      scope.allowUpgrade = response.data.allowUpgrade;
    });
  };
  this.appDemo1GetCompanyCertifications = function(scope) {
    apiSrvc.getData('appDemo1GetCompanyCertifications').then(function(response){
      scope.companyCertifications = response.data;
    });
  };
  this.appDemo1GetBusinessTypes = function(scope) {
    apiSrvc.getData('appDemo1GetBusinessTypes').then(function(response){
      scope.businessTypes = response.data;
    });
  };
  this.getAccountStatus = function(scope, functionToGetCalled) {
    apiSrvc.getData('appDemo1GetAccountStatusInfo').then(function(response) {
      console.log('commonFnSrvc getAccountStatus called');
      scope.accountInfo = response.data;
      if(scope.accountInfo.membershipStatus === 'Active') {
        scope.activeAccount = true;
        functionToGetCalled(true);
      }
      else {
        scope.activeAccount = false;
        $state.go('expiredMembership');
      }
    });
  };

  // GLOBAL functions
  this.appDemo1GetStates = function(scope) {
    apiSrvc.getData('appDemo1GetStates').then(function(response){
      scope.statesList = response.data;
    });
  };
  this.appDemo1GetSecurityClearances = function(scope) {
    apiSrvc.getData('appDemo1GetSecurityClearances').then(function(response){
      scope.securityClearances = response.data;
    });
  };
  this.appDemo1GetBusinessTypes = function(scope) {
    apiSrvc.getData('appDemo1GetBusinessTypes').then(function(response){
      scope.businessTypes = response.data;
    });
  };
  this.appDemo1GetMobileCarriers = function(scope) {
    apiSrvc.getData('appDemo1GetMobileCarriers').then(function(response){
      scope.mobileCarriers = response.data;
    });
  };
  this.appDemo1GetRoles = function(scope) {
    apiSrvc.getData('appDemo1GetRoles').then(function(response){
      scope.roles = response.data;
    });
  };

  this.errorFunction = function (parentLocation, message, toastFunction) {
      // parentLocation is where the toast will appear
      // message is the html that will go in the toastTemplate
      // toastFunction is a function to be called when the toast closes
      $mdToast.show({
       hideDelay: 0,
       position: 'top right',
       parent : $document[0].querySelector(parentLocation),
       controller: 'toastCtrl',
       bindToController: true,
       locals: {
         toastMessage: message,
         toastFunction: toastFunction
       },
       templateUrl: '/views/globalModals/toastTemplate.html'
     }).then(function(result) {
       result();
     }).catch(function(error) {
     });
  };

});
