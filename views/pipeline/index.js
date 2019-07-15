app.controller('pipelineCtrl', function($rootScope, $scope, $state, $stateParams, apiSrvc, commonFnSrvc, Upload, upload, $filter, blockUI, $http, $mdDialog, $location, $timeout, $q, authSrvc, envSrvc, config, $compile) {

  $scope.pipelineInit = function() {    
    var verifyActiveAcct = function(response) {
      if(response) {
        authSrvc.getUserInfoForCompanyInfo($scope);
        $scope.appDemo1GetPipelineStages();
        $scope.appDemo1GetPipelineOpportunities();
      }
    }
    commonFnSrvc.getAccountStatus($scope, verifyActiveAcct);
  };

  /*********************** GET METHODS ***********************/
  $scope.appDemo1GetPipelineStages = function() {
    apiSrvc.getData('appDemo1GetPipelineStages').then(function(response){
      $scope.pipelineStages = response.data.companyStages;
      $scope.numberOfStages = response.data.numberOfStages;
      $scope.visibleStages = [];
      angular.forEach($scope.pipelineStages, function(stage) {
        if(stage.hideColumn) {}
        else {
          $scope.visibleStages.push(stage);
        }
      })
      $scope.oppBlockWidth = 100 / $scope.visibleStages.length;
    })
  };
  $scope.appDemo1GetPipelineOpportunities = function() {
    apiSrvc.getData('appDemo1GetPipelineOpportunities').then(function(response){
      $scope.pipelineOpportunities = response.data;
      var data = response.data.map( d => {
        return {
          id: d.stageId,
          type: "item",
          name: d.name,
          closeDate: d.closeDate,
          contractType: d.contractType,
          description: d.description,
          gpKey: d.gpKey,
          naicsCode: d.naicsCode,
          office: d.office,
          opportunityLink: d.opportunityLink,
          position: d.position,
          stageId: d.stageId,
          value: d.value
        }
      })
      $scope.opportunityModel = {
            selected: null,
            templates: [
                {type: "item", id: 2},
                {type: "container", id: 1, columns: [[], []]}
            ],
            dropzones: {

            }
        };
      $scope.opportunityModel.dropzones.Pipeline = data;
    })
  };
  $scope.appDemo1GetPipelineOpportunitiesView = function() {
    apiSrvc.getData('appDemo1GetPipelineOpportunitiesView').then(function(response){
      $scope.pipelineOpportunitiesView = response.data;
    })
  };
  $scope.appDemo1GetPipelineBusinessTypes = function() {
    if($scope.pipelineBusinessTypes) {}
    else {
      apiSrvc.getData('appDemo1GetPipelineBusinessTypes').then(function(response){
        $scope.pipelineBusinessTypes = response.data;
      })
    }
  };
  $scope.appDemo1GetPipelineSetAsideTypes = function() {
    if($scope.pipelineSetAsideTypes) {}
    else {
      apiSrvc.getData('appDemo1GetBusinessTypes').then(function(response){
        $scope.pipelineSetAsideTypes = response.data;
      })
    }
  };
  $scope.appDemo1GetOpportunityContractTypes = function() {
    if($scope.contractTypes) {}
    else {
      apiSrvc.getData('appDemo1GetOpportunityContractTypes').then(function(response){
        $scope.contractTypes = response.data;
      })
    }
  };
  $scope.appDemo1GetPipelineAgencies = function() {
    if($scope.pipelineAgencies) {}
    else {
      apiSrvc.getData('appDemo1GetPipelineAgencies').then(function(response){
        $scope.pipelineAgencies = response.data;
      })
    }
  };

  /*********************** POST METHODS ***********************/
  $scope.appDemo1SetPipelineStages = function() {
    apiSrvc.sendPostData('appDemo1SetPipelineStages', objectToPost).then(function(response){
    })
  };

  /*********************** OPPORTUNITY DETAILS ***********************/
  $scope.openOpportunityDetails = function(item) {
    $state.go('pipelineOpportunity', {opportunityKey: item.gpKey});
  };
  $scope.selectRow = function(opportunity) {
    if(opportunity.selected) {
      opportunity.selected = false;
    }
     else {
       opportunity.selected = true;
     }
  };
  $scope.$watch('opportunityModel.dropzones', function(oldModel, newModel) {
    $scope.reorderedPipeline = [];
    if(newModel) {
        angular.forEach(newModel.Pipeline, function(row, index) {
          row.position = index;
          var newRow = {position:row.position, gpKey:row.gpKey};
          $scope.reorderedPipeline.push(newRow);
      })
      apiSrvc.sendPostData('appDemo1SetPipelineOpportunityPosition', $scope.reorderedPipeline).then(function(response){
      })
    }
  }, true);

  /*********************** ADD OPPORTUNITY MODAL ***********************/
  $scope.openAddOpportunityModal = function(ev) {
    $scope.appDemo1GetPipelineAgencies();
    $scope.appDemo1GetPipelineSetAsideTypes();
    $scope.appDemo1GetOpportunityContractTypes();
    $scope.updatePipeline = false;
    $mdDialog.show({
      controller: addOpportunityModalCtrl,
      templateUrl: '/views/pipeline/addOpportunityModal.html',
      parent:  angular.element(document.querySelector('#pipeline')),
      targetEvent: ev,
      clickOutsideToClose:true,
      scope: $scope,
      preserveScope: true,
      locals: {
        pipelineAgencies: $scope.pipelineAgencies,
        pipelineSetAsideTypes: $scope.pipelineSetAsideTypes
      },
      onRemoving: function (event, removePromise) {
        if($scope.updatePipeline) {
          $scope.appDemo1GetPipelineOpportunities();
        }
      }
    });
  };

  /*********************** PIPELINE TOUR ***********************/
  // var pipelineTour = {
  //     id: "pipeline-tour",
  //     steps: [
  //       {
  //         title: "Settings",
  //         content: "Here are the settings.",
  //         target: "pipelineSettings",
  //         placement: "left"
  //       },
  //       {
  //         title: "My content",
  //         content: "Here is where I put my content.",
  //         target: document.querySelector("#pipelineDropzones"),
  //         placement: "right"
  //       }
  //     ]
  //   };
  //   console.log(pipelineTour);
  //   // Start the tour!
  //   hopscotch.startTour(pipelineTour);

}); //End of Controller
