function addOpportunityModalCtrl($scope, $rootScope, apiSrvc, commonFnSrvc, $mdDialog, $timeout, $q, pipelineAgencies, pipelineSetAsideTypes) {

  $scope.hide = function() {$mdDialog.hide();};
  $scope.cancel = function() {$mdDialog.cancel();};
  $scope.pipelineAgencies = pipelineAgencies;
  $scope.pipelineSetAsideTypes = pipelineSetAsideTypes;
  $scope.newPipelineOpportunity = {
    name: '',
    agency: {},
    description:  '',
    opportunityLink:  '',
    businessTypes: [],
    contractType: '',
    naicsCode:  '',
    closeDate: '',
    value: null
  }

  $scope.getAgenciesForAutoComplete = function(agency) {
      var agencyResult = [];
      angular.forEach($scope.pipelineAgencies, function(item){
        var lcItem = angular.lowercase(item.name);
        var lcAgency = angular.lowercase(agency);
        if((lcItem.search(lcAgency) >= 0) && (!item.selected) ) {
            agencyResult.push(item);
        }
      });
      return agencyResult;
  };

  $scope.appDemo1SetPipelineOpportunity = function(opportunity) {
    console.log(opportunity);
    if(!opportunity.agency) {
      opportunity.agency = {};
    }
    apiSrvc.sendPostData('appDemo1SetPipelineOpportunity', opportunity).then(function(response){
        if(response.errors.length > 0) {
          $scope.updatePipeline = false;
        }
        else {
          $scope.updatePipeline = true;
          $scope.hide();
        }
    })
  }

}
