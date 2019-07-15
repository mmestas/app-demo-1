app.controller('consultantInviteValidationCtrl', function($rootScope, $scope, $state, $stateParams, apiSrvc, commonFnSrvc, $mdDialog, $mdToast, $location, authSrvc, envSrvc, config) {
  $scope.consultantInviteInit = function() {
    var parameterVariable = $location.search();
    $scope.ConsultantInvitationId = parameterVariable.ConsultantInvitationId;
    $scope.consultantInviteValidation();
  }

  $scope.consultantInviteValidation = function() {
    apiSrvc.getData('appDemo1ConsultantInviteValidation&ConsultantInvitationId='+$scope.ConsultantInvitationId).then(function(response){
      if(response.errors.length > 0) {
        console.log('there was an error');
      }
      else {
        $rootScope.userInfo = response.data;
      }
    });
  }
//**********************************************************************************************************//
//********************************************* AGREE TO TERMS *********************************************//
//**********************************************************************************************************//
  $scope.agreeToTerms = function(password) {
    console.log(password);
      apiSrvc.getData('appDemo1SetInvitedConsultant&password='+password).then(function(response){
        console.log(response);
        if(response.errors.length > 0) {
        }
        else {
          $state.go('consultant');
        }
    });
  }


}); //End of Controller
