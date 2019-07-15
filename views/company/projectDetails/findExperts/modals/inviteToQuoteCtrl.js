function EICtrl($scope, $rootScope, $mdDialog, apiSrvc, commonFnSrvc, slInfo, userInfo, projectInfo, referenceFile, Upload, upload, envURL) {

  $scope.envURL = envURL;
  $scope.slInfoData = slInfo;
  $scope.userInfoData = userInfo;
  $scope.consultantKeys = [{gpKey: slInfo.gpKey}];
  $scope.projectInfoData = projectInfo;
  $scope.referenceFile = referenceFile;
  $scope.invite = {};
  $scope.invite.NDA = false;
  //New 3.22.18 //Ability to Set Start Date 30 days in past 6.18.19
  var today = new Date();
  var aMonthAgo = today.getDate() - 30;
  var startDateMin =  new Date();
  // today.setDate(aMonthAgo); //This is to set the date in the past
  startDateMin.setDate(aMonthAgo); //This is to set the date in the past
  $scope.QuoteDeadlineMin = today;
  $scope.getQuoteDeadline = function(quoteDeadline) {
    var date = quoteDeadline;
    var dateMin = angular.copy(quoteDeadline);
    dateMin.setDate(date.getDate() + 1);
    // $scope.StartDateMin = dateMin;
  }
  $scope.StartDateMin = startDateMin;
  $scope.getStartDate = function(startDate) {
     var date = startDate;
     var dateMin = angular.copy(startDate);
     var dateMax = angular.copy(startDate);
     dateMin.setDate(date.getDate() + 1);
     $scope.EndDateMin = dateMin;
     dateMax.setDate(dateMax.getDate() - 1);
     // $scope.QuoteDateMax = dateMax;
  }
  $scope.getEndDate = function(endDate) {
    var date = endDate;
    var dateMin = angular.copy(endDate);
    var dateMax = angular.copy(endDate);
    dateMin.setDate(date.getDate() + 1);
    $scope.EndDateFinal = dateMin;
    dateMax.setDate(dateMax.getDate() - 1);
    $scope.StartDateMax = dateMax;

  }
  $scope.taskSize = function(taskSize, tasks) {
    var workDescription = tasks[0].workDescription
    if(taskSize == 1) {
      $scope.displayMultipleTaskInputs = false;
      $scope.tasks = [{"id": 'task1', "gpKey": "", "workDescription": workDescription }];
    }
    else if(taskSize == 2) {
      $scope.displayMultipleTaskInputs = true;
    }
    else {
      $scope.displayMultipleTaskInputs = false;
    }
  }
  $scope.tasks = [{"id": 'task1', "workDescription": '', "gpKey": "" }];
  $scope.addTaskInput = function() {
    var newItemNo = $scope.tasks.length+1;
    $scope.tasks.push({'id':'task'+newItemNo, "gpKey" : ""});
  }
  $scope.removeTaskInput = function() {
    var lastItem = $scope.tasks.length-1;
    $scope.tasks.splice(lastItem);
  };
  $scope.hide = function() {
    $mdDialog.hide();
  };
  $scope.cancel = function() {
    $mdDialog.cancel();
  };
  $scope.backToDashboard = function() {
    $rootScope.closeAndGoToDash = true;
    $mdDialog.cancel();
  }
  $scope.sendITQMessage = function(obj, file1, file2, file3) {
    obj.taskType = 1;
    $scope.inviteCongratulations = false;
    obj.tasks = $scope.tasks;
    var objToPost = {};
    objToPost.jsonData = JSON.stringify(obj);
    var consultantKeyString = JSON.stringify($scope.consultantKeys);

    if(file1) {
      objToPost.referenceFile1 = file1;
    }
    if(file2) {
      objToPost.referenceFile2 = file2;
    }
    if(file3) {
      objToPost.referenceFile3 = file3;
    }
    upload({
      // url: __env.apiUrl+'/index.asp?remotemethodaddon=appDemo1SetProjectEngagement&RequestBinary=true&gpKey='+$scope.slInfoData.gpKey+'&projectKey='+$scope.projectInfoData.gpKey,
      url: __env.apiUrl+'/index.asp?remotemethodaddon=appDemo1SetProjectEngagement&RequestBinary=true&consultantKeys='+consultantKeyString+'&projectKey='+$scope.projectInfoData.gpKey,
      method: 'POST',
      data : objToPost
    })
    .then(function(response) {
      $scope.inviteCongratulations = true;
    });
  }

  // var workDescription = document.getElementByClassName("gp-itqWorkDescription");
  var workDescription = angular.element('itqWorkDescription');

  workDescription.onpaste = function(e){
    console.log(e);
      //do some IE browser checking for e
      var max = workDescription.getAttribute("maxlength");
      console.log(max);
      e.clipboardData.getData('text/plain').slice(0, max)
  };


};
