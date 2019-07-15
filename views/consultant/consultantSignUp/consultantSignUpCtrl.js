app.controller('consultantSignUpCtrl', function($rootScope, $scope, $state, $stateParams, $window, apiSrvc, commonFnSrvc, NgTableParams, Upload, upload, $filter, blockUI, $http, $mdDialog, linkedInService, $location, $anchorScroll, authSrvc, envSrvc, config, $localStorage, $sessionStorage) {

  eScope = $scope;

  $scope.$storage = $localStorage;

  $scope.consultantSignUpInit = function() {
    if(!$scope.$storage.consultantInfo) {
      $scope.$storage.consultantInfo = {};
      $scope.$storage.consultantInfo.accountInfo = {};
    }

    if($scope.$storage.consultantInfo) {
      if(!$scope.$storage.consultantInfo.accountInfo ){
        $scope.$storage.consultantInfo.accountInfo = {};
      }
    }
    var url = $location.path().split('/');
    var baseUrl = new $window.URL($location.absUrl()).origin;
    var stateUrl = url[1];
    var liCode = $location.search().code;
    var signUpURL = baseUrl+'/'+stateUrl+'/';
    $scope.absUrl = $location.absUrl()+'/';
    $scope.signUpURL = $location.protocol()+'://'+$location.host()+'/'+$location.path()+'/';
    var referralCodeURL = url[2];
    if(referralCodeURL) {
      $scope.$storage.consultantInfo.accountInfo.referralCode = referralCodeURL;
    }

    if(liCode) {
      postLinkedInInfoToGetToken(liCode, signUpURL);
    }

  };

  $scope.liAuth = function() { //Redirect to LinkedIn Login
    var absUrl = $scope.absUrl; //Use this for redirect_url?
    //Need to get client ID from env.js!!! don't hardcode
    window.location.href = "https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=77etqxtilgudcw&redirect_uri=https://www.app1urlapp.com/signUp/&scope=r_liteprofile%20r_emailaddress%20w_member_social";
  }

  function postLinkedInInfoToGetToken(liCode, signUpURL) { //Call Server to get Auth Token
    var parameters = {
      authorizationCode: liCode,
      redirectUri: signUpURL,
      firstName: $scope.$storage.consultantInfo.accountInfo.firstName,
      lastName: $scope.$storage.consultantInfo.accountInfo.lastName,
      email: $scope.$storage.consultantInfo.accountInfo.email,
      password: $scope.$storage.consultantInfo.accountInfo.password,
      companyName: $scope.$storage.consultantInfo.accountInfo.companyName,
      referralCode: $scope.$storage.consultantInfo.accountInfo.referralCode
    };
    apiSrvc.sendPostData('appDemo1SetLinkedInConsultantSignUp', parameters).then(function(response) {
      if(response.errors.length  > 0) {
      }
      else {
        $scope.$storage.consultantInfo = {};
        $state.go('consultant');
      }
    })
  };

  $scope.showLinkedInStep = false;

  $scope.duplicateEmails = false;

  $scope.goToStepLinkedIn = function(consultantInfo) {
    $scope.duplicateEmails = false;
    if(consultantInfo.firstName && consultantInfo.lastName && consultantInfo.email && consultantInfo.password) {
      var email = {
        email: consultantInfo.email
      }
      apiSrvc.sendPostData('appDemo1SetVerifyConsultantSignUp', email).then(function(response) {
        if(response.errors.length > 0) {
          $scope.duplicateEmails = true;
        }
        else {
          $scope.showLinkedInStep = true;
        }
      });
    }
    else {
      //error
    }


  };

  $scope.appDemo1SetConsultantSignUpWithoutLinkedIn = function(consultantInfo, signUpLocation) {
    var parameters = {
      firstName: consultantInfo.firstName,
      lastName: consultantInfo.lastName,
      email: consultantInfo.email,
      password: consultantInfo.password,
      companyName: consultantInfo.companyName,
      referralCode: consultantInfo.referralCode
    }
    apiSrvc.sendPostData('appDemo1SetConsultantSignUp', parameters).then(function(response) {
      if(response.errors > 0) {
      }
      else {
        $scope.$storage.consultantInfo = {};
        $state.go('consultant', {signUpLocation: signUpLocation});
      }
    })
  };

  $scope.goToConsultantMarketingSignUp = function() {
    $location.hash('marketingConsultantSignUp');
    $anchorScroll();
  }
// End of Controller
});
