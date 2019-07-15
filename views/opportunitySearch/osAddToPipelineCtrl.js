function osAddToPipelineCtrl($scope, $rootScope, apiSrvc, commonFnSrvc, $mdDialog, $filter, opportunityDetails) {

  console.log(opportunityDetails);
  $scope.opportunityDetails = opportunityDetails;

  /********************************** CALLS **********************************/
  $scope.addOpportunityToPipeline = function(value) {
    console.log('add opp', opportunityDetails.gpKey);
    console.log(opportunityDetails);
    console.log(value);

    var agencyObj = {
      name: opportunityDetails.agency.name,
      imageUrl: opportunityDetails.agency.imageFilename,
      gpKey: opportunityDetails.agency.gpKey
    };

    var convertedDate = $filter('dateConverter')(opportunityDetails.closeDate);
    console.log(convertedDate);

  var opportunity =  {
      name: opportunityDetails.name ,
      agency: agencyObj ,
      opportunityLink: opportunityDetails.opportunityLink ,
      naicsCode: opportunityDetails.naicsCode ,
      closeDate: convertedDate ,
      value: value ,
      description: opportunityDetails.description ,
      businessType: opportunityDetails.setAside ,
      contractType: {}
    }
    console.log(opportunity);
    apiSrvc.sendPostData("appDemo1SetPipelineOpportunity", opportunity).then(function(response) {
      console.log(response);
      if(response.errors.length > 0) {

      }
      else {
        $scope.hide();
      }
    });

    // $mdDialog.hide();
  }
  /**********************************  **********************************/

  $scope.hide = function() {$mdDialog.hide();};
  $scope.cancel = function() {$mdDialog.cancel();};

} //END
