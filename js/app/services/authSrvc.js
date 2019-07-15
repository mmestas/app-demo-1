app.service('authSrvc', function ($http, apiSrvc, commonFnSrvc, blockUI, $q, $state) {

  this.getUserInfo = function(scope) {
    apiSrvc.getData('appDemo1GetUserInformation').then(function(response){
      if(response.data.isAuthenticated) {
        scope.userInfo = response.data;
        return scope.userInfo;
      }
    })
  };
  this.getUserInfoForProfile = function(scope) {
    apiSrvc.getData('appDemo1GetUserInformation').then(function(response){
      if(response.data.isAuthenticated) {
        scope.userInfo = response.data;
        var gpKey = response.data.gpKey;
        apiSrvc.getData('appDemo1GetUserProfile&gpKey='+gpKey).then(function(response){
          scope.profileInfo = response.data;
          return scope.profileInfo;
        });
        return scope.userInfo;
      }
    })
  };
  this.getUserInfoForCompanyInfo = function(scope, functionToGetCalled) {
    apiSrvc.getData('appDemo1GetUserInformation').then(function(response){
      if(response.data.isAuthenticated) {
        scope.userInfo = response.data;
        var userInfo = response.data;
        var gpKey = response.data.gpKey;
        if(userInfo.isConsultant) {
          if(functionToGetCalled) {
            functionToGetCalled();
          }

        }
        else {
          apiSrvc.getData('appDemo1GetCompanyProfile&gpKey='+userInfo.Company.gpKey).then(function(response) {
            scope.companyInfo = response.data;
            if(functionToGetCalled) {
              functionToGetCalled(scope.companyInfo);
            }
            return scope.companyInfo;
          })
        }

        return scope.userInfo;
      }
    })
  };

  this.getUserInfoForFunction = function(scope, functionToGetCalled) {

    apiSrvc.getData('appDemo1GetUserInformation').then(function(response){
      if(response.data.isAuthenticated) {
        scope.userInfo = response.data;
        functionToGetCalled();
      }
      else {}
    });
  };

}); //End of service
