app.controller('expiredMembershipCtrl', function($rootScope, $scope, $state, $stateParams, apiSrvc, commonFnSrvc, $http, Upload, upload, $filter, blockUI, $http, $mdDialog, $mdToast, $document, $location, authSrvc, envSrvc, config, $q) {

  $scope.exMem = {
    membership: ''
  };
  $scope.showMessageBox = true;
  $scope.showMessageSucessfullySent = false;
  $scope.showErrorMessage = false;

  $scope.sendEmailMembershipExpiredRequest = function(message) {

    upload({
        url: __env.apiUrl+'/index.asp?remotemethodaddon=appDemo1SendEmailMembershipExpiredRequest&RequestBinary=true',
        method: 'POST',
        data : {
          message : JSON.stringify(message),
        }
      }).then(function(response) {
        console.log(response);
        if(response.data.errors.length > 0) {
          $scope.showErrorMessage = true;
        }
        else {
          $scope.showMessageBox = false;
          $scope.showErrorMessage = false;
          $scope.showMessageSucessfullySent = true;
        }
      });


  };

});
