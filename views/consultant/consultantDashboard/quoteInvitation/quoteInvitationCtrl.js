app.controller('quoteInvitationCtrl', function ($rootScope, $scope, $state, $stateParams, apiSrvc, commonFnSrvc, NgTableParams, Upload, upload, $filter, blockUI, $http, $mdDialog, textAngularManager, $document, $mdToast, $timeout, $location, authSrvc, envSrvc, config) {

  //**********************************************************************************************************//
  //********************************************* QUOTE INVITATION *******************************************//
  //**********************************************************************************************************//
  $scope.quoteInvitationInit = function () {
    authSrvc.getUserInfo($scope);
    if(!$stateParams.engagementData) {
      $scope.appDemo1GetConsultantEngagement();
    }
    else {
      $scope.engagementData = $stateParams.engagementData
      $scope.defineEngagementDataResults($stateParams.engagementData);
    }

  }

  $scope.appDemo1ProcessLogout = function () {
    apiSrvc.getData('appDemo1ProcessLogout').then(function (response) {
      $state.go('signIn');
    });
  }

  $scope.quoteTypeOptions = [
    { id: 1, name: 'Fixed', value: 1 },
    { id: 2, name: 'Hourly', value: 2 },
    { id: 3, name: 'Recurring', value: 3 }
  ];

  $scope.changeQuoteType = function (quoteType) {
    if (quoteType.value === 1) {
      $scope.qtFixed = true;
      $scope.qtHourly = false;
      $scope.qtRecurring = false;
      $scope.arrayLenght = 1;
      $scope.qtFix =
        [{
          milestonePrice: 0,
          supportingNarrative: ''
        }]

      $scope.qtHour =[];
      $scope.qRecurring = {}
    }
    else if (quoteType.value === 2) {
      $scope.qtFixed = false;
      $scope.qtHourly = true;
      $scope.qtRecurring = false;
      $scope.arrayLenght = 1;
      $scope.qtHour =
        [{
          freelanceHourlyRate: angular.copy($scope.engagementData.engagementRate),
          hoursQuoted: 0,
          supportingNarrative:''
        }]
      $scope.qtFix = [];
      $scope.qRecurring = {};
    }
    else if (quoteType.value === 3) {
      $scope.qtFixed = false;
      $scope.qtHourly = false;
      $scope.qtRecurring = true;
      $scope.qtHour = [];
      $scope.qtFix = [];
      $scope.qRecurring = {}
      //$scope.periodselection = $scope.recurringPeriods[0];
    }
}

  // Recurring Objects
  $scope.recurringPeriods = [
    { id: 1, name: 'Weekly', value: 1 },
    { id: 2, name: 'Bi-Weekly', value: 2 },
    { id: 3, name: 'Monthly', value: 3 }
  ];
  //$scope.periodselection = $scope.recurringPeriods[0];
  //

  $scope.appDemo1GetConsultantEngagement = function () {
    $rootScope.hideEngagementRecurringDate = false;
    apiSrvc.getData('appDemo1GetConsultantEngagement&gpkey=' + $stateParams.engagementKey).then(function (response) {
      $scope.engagementData = response.data;
      $scope.defineEngagementDataResults($scope.engagementData);
    });
  }


  $scope.defineEngagementDataResults = function(engagementData) {
    $scope.gpKey = engagementData.gpKey;
    var quoteDeadlineDate = $filter('dateConverter')(engagementData.quoteDeadline);
    var quoteDeadlineDaysLeft = $filter('daysLeft')(quoteDeadlineDate);

    if (engagementData.consultantSubmitted) {
      $rootScope.inviteSubmitted = true;
      if(!engagementData.companyApproved && !engagementData.companyRejected && (quoteDeadlineDaysLeft >= 0)) {
          $rootScope.hideSubmit = false;
        }
        else {
          $rootScope.hideSubmit = true;
        }

        $rootScope.hideEngagementRecurringDate = true;
        //
        $scope.qtFixed = false;
        $scope.qtHourly = false;
        $scope.qtRecurring = false;

        if (engagementData.quoteInvitationInfo.quoteType===1) {
          $scope.quoteType = $scope.quoteTypeOptions[0];
          $scope.qtFix = angular.copy(engagementData.quoteInvitationInfo.qFix);
          $scope.qtFixed = true;
        } else if (engagementData.quoteInvitationInfo.quoteType===2) {
          $scope.quoteType = $scope.quoteTypeOptions[1];
          $scope.qtHour = angular.copy(engagementData.quoteInvitationInfo.qHours);
          $scope.qtHourly = true;
        } else if (engagementData.quoteInvitationInfo.quoteType===3) {
          $scope.quoteType = $scope.quoteTypeOptions[2];
          $scope.qtRecurring = true;
          // load the data
          $scope.qRecurring.deliverableDescription = engagementData.quoteInvitationInfo.qRecurring.deliverableDescription;
          $scope.qRecurring.numberPeriods = engagementData.quoteInvitationInfo.qRecurring.numberPeriods;
          $scope.qRecurring.periodAmount = engagementData.quoteInvitationInfo.qRecurring.periodAmount;
          // $scope.qRecurring.autoBillStartDate = engagementData.quoteInvitationInfo.qRecurring.autoBillStartDate;
          //1.30.19 convert date for md-select
          $scope.qRecurring.autoBillStartDate = $filter('dateConverter')(engagementData.quoteInvitationInfo.qRecurring.autoBillStartDate);
          //
          if(engagementData.quoteInvitationInfo.qRecurring.recurringPeriod===1){
            $scope.qRecurring.periodselection = $scope.recurringPeriods[0];
          } else if(engagementData.quoteInvitationInfo.qRecurring.recurringPeriod===2){
            $scope.qRecurring.periodselection = $scope.recurringPeriods[1];
          } else if(engagementData.quoteInvitationInfo.qRecurring.recurringPeriod===3){
            $scope.qRecurring.periodselection = $scope.recurringPeriods[2];
          }
          //

        }
        //
    }
    else if(quoteDeadlineDaysLeft < 0) {
      $rootScope.hideSubmit = true;
    }
    else {
      $rootScope.hideSubmit = false;
      $scope.qtFixed = true;
      $scope.qtHourly = false;
      $scope.qtRecurring = false;
      $scope.quoteType = $scope.quoteTypeOptions[0];
      //
      $scope.qtFix =
        [{
          milestonePrice: 0,
          supportingNarrative: ''
        }]
      //
    }
    if (!engagementData.engagementRate) {
      engagementData.engagementRate = engagementData.consultant.freelanceHourlyRate;
    }
  }

  $scope.goToConsultantDash = function () { $state.go('consultant.invites'); }

  $scope.consultantSendEngagementMessage = function (eData, message) {
    apiSrvc.getData('appDemo1ProcessConsultantSendEngagementMessage&engagementKey=' + eData.gpKey + '&gpkey=' + eData.companyUser.gpKey + '&msg=' + message).then(function (response) {
      if (response.errors.length > 0) {
      }
      else {
        $scope.msgSentSuccess = true;
      }
    });
  }
  /************************************ MODALS *********************************/

  $scope.requestInfoModal = function (engagementData) {
    $scope.engData = engagementData;
    $mdDialog.show({
      controller: requestInfoModalCtrl,
      templateUrl: '/views/consultant/modals/requestInfo.html',
      parent: angular.element(document.querySelector('.gp-dashWrapper')),
      clickOutsideToClose: false,
      locals: {
        eData: $scope.engData
      },
      onRemoving: function () {
        if ($rootScope.goBackToDash) {
          $state.go('consultantDashboard');
        }
        else {
        }
      }
    });
  }
  function requestInfoModalCtrl($scope, $rootScope, $mdDialog, apiSrvc, commonFnSrvc, eData) {
    $scope.engInfoData = eData;
    $rootScope.goBackToDash = false;
    $scope.hide = function () { $mdDialog.hide(); };
    $scope.cancel = function () { $mdDialog.cancel(); };
    $scope.msgSentSuccess = false;
    $scope.consultantSendEngagementMessage = function (eInfo, message) {
      apiSrvc.getData('appDemo1ProcessConsultantSendEngagementMessage&engagementKey=' + eInfo.gpKey + '&gpkey=' + eInfo.companyUser.gpKey + '&msg=' + message).then(function (response) {
        if (response.errors.length > 0) {
        }
        else {
          $scope.msgSentSuccess = true;
        }
      });
    }
    $scope.backToDashboard = function () {
      $rootScope.goBackToDash = true;
      $mdDialog.cancel();
    }
  }

  // Start - Modal

  $scope.quoteSubmittedModal = function () {
    $rootScope.goBackToDash = false;
    $mdDialog.show({
      controller: quoteSubmittedModalCtrl,
      templateUrl: '/views/consultant/modals/quoteSubmitted.html',
      parent: angular.element(document.querySelector('.gp-dashWrapper')),
      clickOutsideToClose: false,
      onRemoving: function () {
        if ($rootScope.goBackToDash) {
          $state.go('consultant.invites');
        }
        else {
        }
      }
    });
  }
  function quoteSubmittedModalCtrl($scope, $rootScope, $mdDialog) {
    $rootScope.goBackToDash = false;
    $scope.hide = function () { $mdDialog.hide(); };
    $scope.cancel = function () { $mdDialog.cancel(); };
    $scope.backToDashboard = function () {
      $rootScope.goBackToDash = true;
      $mdDialog.cancel();
    }
  }
  //
  $scope.quoteRejectedModal = function () {
    $rootScope.goBackToDash = false;
    $mdDialog.show({
      controller: quoteRejectedModalCtrl,
      templateUrl: '/views/consultant/modals/quoteRejected.html',
      parent: angular.element(document.querySelector('.gp-dashWrapper')),
      clickOutsideToClose: false,
      onRemoving: function () {
        if ($rootScope.goBackToDash) {
          $state.go('consultant.invites');
        }
        else {
        }
      }
    });
  }
  function quoteRejectedModalCtrl($scope, $rootScope, $mdDialog) {
    $rootScope.goBackToDash = false;
    $scope.hide = function () { $mdDialog.hide(); };
    $scope.cancel = function () { $mdDialog.cancel(); };
    $scope.backToDashboard = function () {
      $rootScope.goBackToDash = true;
      $mdDialog.cancel();
    }
  }
  //
  $scope.openIOSendMsgModal = function (project) {
    $scope.project = project;
    $mdDialog.show({
      controller: IOMsgCtrl,
      scope: $scope,
      preserveScope: true,
      templateUrl: '/views/consultant/consultantDashboard/interestedOpportunities/sendIOMessage.html',
      clickOutsideToClose: true,
      parent: angular.element(document.querySelector('.gp-dashWrapper')),
      locals: {
        projectData: $scope.project,
        consultantData: $scope.consultantInfo
      }
    });
  }
  $scope.openReplyToMsgModal = function (msgReply) {
    $scope.msgReply = msgReply;
    $mdDialog.show({
      controller: replyToMsgCtrl,
      templateUrl: '/views/consultant/consultantDashboard/systemNotifications/replyToMsgModal.html',
      clickOutsideToClose: true,
      parent: angular.element(document.querySelector('.gp-dashWrapper')),
      locals: {
        msgReplyData: $scope.msgReply,
        consultantData: $scope.consultantInfo,
      }
    });
  }
  //**********************************************************************************************************//
  //************************************************** INFO MODALS ************************************************//
  //**********************************************************************************************************//
  $scope.infoRecurringPeriod = function(ev) {
    $scope.infoObject = {
      msg: 'Choose the timing of your payments',
      title: 'Recurring Period',
    }
    $scope.infoModal(ev);
  };
  $scope.infoRecurringPeriodAmount = function(ev) {
    $scope.infoObject = {
      msg: 'Choose the amount of each payment',
      title: 'Rate',
    }
    $scope.infoModal(ev);
  };
  $scope.infoAutoBill = function(ev) {
    $scope.infoObject = {
      msg: 'Choose the date you want to automatically generate an invoice to your client',
      title: 'Auto Bill',
    }
    $scope.infoModal(ev);
  };
  $scope.infoNumberOfPeriods = function(ev) {
    $scope.infoObject = {
      msg: 'Choose the number of times your invoice will be submitted',
      title: 'Number of Periods',
    }
    $scope.infoModal(ev);
  };
  $scope.infoModal = function(ev) {
    $mdDialog.show({
      controller: infoModalCtrl,
      templateUrl: '/views/globalModals/infoModal.html',
      parent: angular.element(document.querySelector('body')),
      targetEvent: ev,
      clickOutsideToClose:true,
      locals: {
           dialogInfo: $scope.infoObject
         }
    });
  };
  //**********************************************************************************************************//
  //*********************************************  WYSIWYG EDITOR ********************************************//
  //**********************************************************************************************************//
  $scope.version = textAngularManager.getVersion();
  $scope.versionNumber = $scope.version.substring(1);
  $scope.orightml = 'Enter Text Here';
  $scope.htmlcontent = $scope.orightml;
  $scope.disabled = false;


  //**********************************************************************************************************//
  //********************************************* CODE OSCAR MENDOZA ********************************************//
  //**********************************************************************************************************//


  /**
   * validation of arranged for user data in option hours
   */

  $scope.arrayLenght = 1;
  //$scope.Quotetotal = 0;

  $scope.qtFix =
    [{
      price: '',
      milestone: ''
    }]

  $scope.QuoteTotalFixed = function(){
      var total = 0;
      for(var i = 0; i < $scope.qtFix.length; i++){
          var qtFix = $scope.qtFix[i];
          total += (qtFix.milestonePrice);
      }
      return total;
  }

$scope.QuoteTotalHours = function(){
    var total = 0;
    for(var i = 0; i < $scope.qtHour.length; i++){
        var qtHour = $scope.qtHour[i];
        total += (qtHour.hoursQuoted);
    }
    return total;
}

$scope.PriceTotalHours = function(){
  var total = 0;
  for(var i = 0; i < $scope.qtHour.length; i++){
      var qtHour = $scope.qtHour[i];
      total += (qtHour.freelanceHourlyRate * qtHour.hoursQuoted);
  }
  return total;
}

$scope.RecurringTotal = function(){
  var total = 0;
  if (($scope.qRecurring.periodAmount) && ($scope.qRecurring.numberPeriods)) {
    total = $scope.qRecurring.periodAmount * $scope.qRecurring.numberPeriods;
  }
  return total;
}

// qFix Functions
$scope.addqtFix = function () {
  $scope.qtFix.push({
    milestonePrice: 0,
    supportingNarrative: ''
  });
  $scope.arrayLenght = $scope.qtFix.length;
};

$scope.removeqtFix = function (index) {
    $scope.qtFix.splice(index, 1);
    $scope.arrayLenght = $scope.qtFix.length;
  };

  // qHours Functions

  $scope.addqtHours = function () {
    $scope.qtHour.push({
      freelanceHourlyRate: angular.copy($scope.engagementData.engagementRate),
      supportingNarrative: '',
      hoursQuoted: 0
    });
    $scope.arrayLenght = $scope.qtHour.length;
  };

  $scope.removeqtHours = function (index) {
    $scope.qtHour.splice(index, 1);
    $scope.arrayLenght = $scope.qtHour.length;
  };

  //

  $scope.qRecurring =

    {
      recurringPeriod: 0,
      periodAmount: 0,
      autoBillStartDate: '',
      numberPeriods: 0,
      deliverableDescription: '',
    };

  // Recurring Functions

  $scope.getStartDate = function (autoBillStartDate) {
    var date = autoBillStartDate;
    var dateMax = angular.copy(autoBillStartDate);
    dateMax.setDate(dateMax.getDate());
    $scope.qRecurring.autoBillStartDate = dateMax;
  }


  $scope.SubmitQuote = function () {

    var qRecurringToSend={};
    var isValidForm = true;

    if ($scope.quoteType.id===1){
      //
      angular.forEach($scope.qtFix, function(fixTask) {
        if(fixTask.milestonePrice===0 || !fixTask.milestonePrice){
          isValidForm = false;
        }
      })
      if(!isValidForm){
        $mdToast.show(
          $mdToast.simple({parent : $document[0].querySelector('#quoteInvitationSubmitSection')})
          .textContent('Please enter a valid price. Use numbers only.')
          .hideDelay(3000)
          .theme("warning-toast")
          .position('top')
         );
        }
        //
    } else if ($scope.quoteType.id===2){
      //
      angular.forEach($scope.qtHour, function(hourTask) {
        if(hourTask.freelanceHourlyRate===0 || hourTask.hoursQuoted===0 || !hourTask.freelanceHourlyRate){
          isValidForm = false;
        }
      })
      if(!isValidForm){
        $mdToast.show(
          $mdToast.simple({parent : $document[0].querySelector('#quoteInvitationSubmitSection')})
          .textContent('Please enter a valid hourly rate or hours quoted. (Use numbers only)')
          .hideDelay(3000)
          .theme("warning-toast")
          .position('top')
         );
        }
        //
    }  else if ($scope.quoteType.id===3){
      //
      if((!$scope.qRecurring.periodselection) || ($scope.qRecurring.periodselection.id===0 )) {
        isValidForm = false;
      }
      if($scope.qRecurring.periodAmount===0 || !$scope.qRecurring.periodAmount){
        isValidForm = false;
      }
      if($scope.qRecurring.numberPeriods===0 ){
        isValidForm = false;
      }

      if(!isValidForm){
        $mdToast.show(
          $mdToast.simple({parent : $document[0].querySelector('#quoteInvitationSubmitSection')})
          .textContent('Please enter a valid value. Use numbers only')
          .hideDelay(3000)
          .theme("warning-toast")
          .position('top')
         );
        }
        //
    }

    if (isValidForm) {
      if(($scope.qRecurring) && ($scope.quoteType) && ($scope.quoteType.id==3) && ($scope.qRecurring.periodselection && ($scope.qRecurring.periodselection.id))){
        qRecurringToSend.autoBillStartDate = $scope.qRecurring.autoBillStartDate;
        qRecurringToSend.deliverableDescription = $scope.qRecurring.deliverableDescription;
        qRecurringToSend.numberPeriods = $scope.qRecurring.numberPeriods;
        qRecurringToSend.periodAmount = $scope.qRecurring.periodAmount;
        qRecurringToSend.recurringPeriod = $scope.qRecurring.periodselection.id;
      }

      dataSend = {
        "quoteType": $scope.quoteType.id,
        "qFix": $scope.qtFix,
        "qHours": $scope.qtHour,
        "qRecurring": qRecurringToSend,
        "gpKey": $scope.gpKey
      }
      dataSend = JSON.parse(JSON.stringify(dataSend))
      apiSrvc.sendPostData('appDemo1SetConsultantEngagementQuoteInvitation', dataSend).then(function (response) {
        $scope.engagementData.consultantSubmitted = true;

        $scope.quoteSubmittedModal();
        //
      });
    }




  };


  $scope.declineQuote = function(){
    apiSrvc.getData('appDemo1ProcessConsultantEngagementReject&gpkey=' + $stateParams.engagementKey).then(function (response) {
      $rootScope.hideSubmit = true;
      $scope.quoteRejectedModal();
    });
  };

  $scope.editingQuote = false;
  $scope.EditQuote = function() {
    if($scope.editingQuote) {
        $scope.editingQuote = false;
    }
    else {
      $scope.editingQuote = true;
    }
  }


});
