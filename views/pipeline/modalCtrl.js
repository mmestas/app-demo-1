function pipelineModalCtrl($scope, $rootScope, apiSrvc, commonFnSrvc, $mdDialog, $timeout, $q, onAdded, onCanceled) {
    $scope.placeholderImg = "https://via.placeholder.com/100x100";
    $scope.addedToPipeline = false;
    $scope.isLoading = false;
    $scope.values = {
        agency_name: "",
        opportunity_name: "",
        opp_desc: "",
        opp_link: "",
        set_aside: "",
        contract_type: "", 
        naics: "",
        close_date: "",
        estimate_contract_value: ""
    };
    $scope.setasidelist = [{
        "name": "Option",
        "value": ""
    }];
    $scope.values.set_aside = $scope.setasidelist[ 0 ];
    $scope.agencies = [{
        "name": "Select Agency Name",
        "value": ""
    }];
    $scope.values.agency_name = $scope.agencies[ 0 ];

    $scope.hide = function() {$mdDialog.hide();};
    $scope.cancel = function() {
        $mdDialog.cancel();
        onCanceled();
    };
    $scope.submit = function() {
        console.log("pipelineModalCtrl submit called");
        var values = {
          name: $scope.values.opportunity_name,
          agency: $scope.values.agency_name,
          description: $scope.values.opp_desc,
          opportunityLink: $scope.opp_link,
          businessTypes: $scope.values.set_aside,
          contractType: $scope.values.contract_type,
          naicsCode: $scope.values.naics,
          closeDate: $scope.values.close_date,
          value: $scope.values.estimate_contract_value
        };
          
       $scope.isLoading = true;
      apiSrvc.sendPostData("appDemo1SetPipelineOpportunity", values).then(function(response) {
          $scope.addedToPipeline = true;
          $scope.isLoading = false;
          onAdded();
      }).catch(function(err) {
          console.error( err );
      });

    }
    $scope.onChangeSetAside = function( value ) {
        console.log("onChangeSetAside ", value);
        $scope.values.set_aside = value;
    }
    $scope.onChangeAgencyName = function(value) {
        console.log("onChangeAgencyName ", value);
        $scope.values.agency_name = value;
    }


    $q.all([
        apiSrvc.getData("appDemo1GetPipelineBusinessTypes"),
        apiSrvc.getData("appDemo1GetPipelineAgencies")
    ]).then(function(response) {
      $scope.setasidelist = $scope.setasidelist.concat( response[0].data );
      $scope.agencies = $scope.agencies.concat( response[1].data );
    });
}
