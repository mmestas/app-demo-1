app.controller('adminCtrl', function($rootScope, $scope, $state, $stateParams, apiSrvc, commonFnSrvc, $filter, blockUI, $http, $mdDialog, $location, authSrvc, envSrvc, config) {

    $scope.csaInit = function() {      
      var verifyActiveAcct = function() {
        authSrvc.getUserInfo($scope);
      };
      commonFnSrvc.getAccountStatus($scope, verifyActiveAcct);
    }

    $scope.getUsersForImpersonation = function(username) {
       // .get(__env.apiUrl+'/index.asp?remotemethodaddon=appDemo1GetImpersonateUsers&username='+username)
        var objectToPost = {keyword: username};
        return $http
       // .get(__env.apiUrl+'/index.asp?remotemethodaddon=appDemo1GetImpersonateUsers&username='+username)
       .post(__env.apiUrl+'/index.asp?remotemethodaddon=appDemo1GetImpersonateUsers', { jsonData : JSON.stringify(objectToPost) })
       .then(function(response) {
         return response.data.data;
       });
    }

    $scope.setPerson = function(selectedUser) {
      $scope.selectedUser = selectedUser;
    }

    $scope.impersonateUser = function() {
      var userName = $scope.selectedUser.username;
      var gpKey = $scope.selectedUser.gpKey;
      // apiSrvc.getData('appDemo1ProcessImpersonateUser&username='+userName).then(function(response){
      apiSrvc.getData('appDemo1ProcessImpersonateUser&gpKey='+gpKey).then(function(response){
        if(response.errors.length > 0) {
          alert('there was an error');
        }
        else if(response.data.isConsultant) {
          $state.go('consultant');
        }
        else if(response.data.allowAccess) {
          $state.go('company');
        }
        else {}
      });
    }

    $scope.impersonateDemoCompanyUser = function() {
      apiSrvc.getData('appDemo1ProcessImpersonateCompanyUser').then(function(response){
        if(response.errors.length > 0) {}
        else {
          $state.go('company');
        }
      })
    }
    $scope.impersonateDemoConsultant = function() {
      apiSrvc.getData('appDemo1ProcessImpersonateConsultant').then(function(response){
        if(response.errors.length > 0) {}
        else {
          $state.go('consultant');
        }
      })
    }
});
