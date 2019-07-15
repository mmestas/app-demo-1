app.controller('loginCtrl', function($rootScope, $scope, $state, $stateParams, apiSrvc, commonFnSrvc, NgTableParams, Upload, upload, $filter, blockUI, $http, $mdDialog, $location, authSrvc, envSrvc, config) {


  $scope.signUpLanding = function() {
    $scope.appDemo1GetUserInformation();
  }
  $scope.signInInit = function() {
    $scope.appDemo1GetUserInformation();
  }
  /************************************************************************************************************/
  /************************************************** SIGN IN *************************************************/
  /************************************************************************************************************/
  $scope.signInSubmit = function(signIn, invalid) {
    $scope.showLoginError = false;
    if(signIn.rememberme) {
    }
    else {
      signIn.rememberme = false;
    }
    if(invalid) {
    }
    else {
      apiSrvc.sendPostData('appDemo1ProcessLogin', signIn).then(function(response){
        $rootScope.isConsultant = response.data.isConsultant;
        $rootScope.isCompany = !response.data.isConsultant;
        var userInfo = response.data;

        if(response.errors.length > 0) {
          $scope.showLoginError = true;
        }
        else if(response.data.isInImpersonateGroup && !response.data.allowAccess) {
          $state.go('csaDashboard');
        }
        else if(response.data.isConsultant) {
          $state.go('consultant');
          $scope.showLoginError = false;
        }
        else if(response.data.allowAccess) {
          // $state.go('company'); //6.20.19

          var verifyAccount = function(result) {
            if(result) {
              $state.go('company');
            }
            else {
              console.log('not verified');
            }
          }
          commonFnSrvc.getAccountStatus($scope, verifyAccount);

          $scope.showLoginError = false;
        }
      });
    }
  }
  $scope.forgotPassLink = function() {
    $scope.hideSignInForm = true;
  }
  $scope.returnToSignIn = function() {
    $scope.hideSignInForm = false;
  }
  $scope.sendPassword = function(email, invalid) {
    if(invalid) {
    }
    else {
      apiSrvc.getData('appDemo1ProcessForgetPassword&email='+email).then(function(response){
        if(response.errors == 0) {
          $scope.passwordEmailSent = true;
          $state.go('signUp');
        }
        else {
          $scope.passwordEmailSent = false;
        }

      });
    }
  }
  $scope.appDemo1GetUserInformation = function() {
    apiSrvc.getData('appDemo1GetUserInformation').then(function(response){
      $rootScope.isConsultant = response.data.isConsultant;
      $rootScope.isCompany = !response.data.isConsultant;
      $rootScope.authenticated = response.data.isAuthenticated;
      $rootScope.allowedAccess = response.data.allowAccess;
      if(response.data.isAuthenticated && response.data.isConsultant) {console.log('is Consultant'); $state.go('consultant');}
      if(response.data.isAuthenticated && !response.data.isConsultant && response.data.allowAccess) {console.log('is Company'); $state.go('company');}
      if(response.data.isAuthenticated && !response.data.isConsultant && !response.data.allowAccess) {console.log('Company Sign Up'); $state.go('step2-Company');}
      else {}
    });
  }
  /************************************************************************************************************/
  /************************************* Sign Up - Go to SignUp Landing ************************************/
  /************************************************************************************************************/
  $scope.goToSignUpLanding = function() {
    $state.go('signUp');
  }
  /************************************************************************************************************/
  /************************************* Sign Up - Go to Company SignUp ************************************/
  /************************************************************************************************************/
  $scope.goToStep1 = function() {
    $state.go('step1-Company', {codeId: null});
  }

  /************************************************************************************************************/
  /************************************* Sign Up - Go to Consultant SignUp ************************************/
  /************************************************************************************************************/
  $scope.goToConsultantSignUp = function() {
    // $state.go('consultantSignUp', {codeId: null});
    $state.go('consultantSignUp');
  }


//End of Controller
});
