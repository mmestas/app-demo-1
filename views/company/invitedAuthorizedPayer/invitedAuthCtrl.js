app.controller('invitedAuthCtrl', function($rootScope, $scope, $state, $stateParams, $location, $document,  $timeout, apiSrvc, commonFnSrvc, NgTableParams, Upload, upload, $filter, blockUI, $http, $mdDialog, $mdToast, authSrvc, envSrvc, config) {

    // Recurring Objects
  $scope.recurringPeriods = [
    { id: 1, name: 'Weekly', value: 1 },
    { id: 2, name: 'Bi-Weekly', value: 2 },
    { id: 3, name: 'Monthly', value: 3 }
  ];

  $scope.iaSignin = function() {
    var paramterVariable = $location.search();
    console.log(paramterVariable);
    $rootScope.iaProjectKey = paramterVariable.projectKey;
    $rootScope.iaEngagementKey = paramterVariable.engagementKey;
  }
  $scope.appDemo1GetUserProfile = function(gpKey) {
    apiSrvc.getData('appDemo1GetUserProfile&gpKey='+gpKey).then(function(response){
      $rootScope.newCompanyAuthPayer = response.data;
    });
  }
  $scope.appDemo1GetUserInformation = function() {
    apiSrvc.getData('appDemo1GetUserInformation').then(function(response){
        $rootScope.userInfo = response.data;
      });
  }

  $scope.getAccountStatus = function() {
    console.log('invitedAuthCtrl');
    apiSrvc.getData('appDemo1GetAccountStatusInfo').then(function(response) {
      $scope.accountInfo = response.data;
    });
  };
  $scope.getAccountStatus();

  $scope.appDemo1GetPlanInformation = function() {
    apiSrvc.getData('appDemo1GetPlanInformation').then(function(response){
      $scope.planInformation = response.data;
      $scope.feeAmt = response.data.Fee;
    });
  }
  $scope.appDemo1GetPlanInformation();


  $scope.invitedAuthSignIn = function(invitedAuthCredentials) {
    apiSrvc.sendPostData('appDemo1ProcessLogin', invitedAuthCredentials).then(function(response){
      if(response.errors.length > 0) {
        $scope.errorMsg = 'Error.  Cannot process your request.'
        if(response.errors[0].number == 640) {
          // $scope.errorMsg = response.errors[0].userMsg;
          $scope.errorMsg = 'The credentials you entered do not match the ones provided to you from our system.  Please check your email for the correct username and password.';
        }

        $mdToast.show({
          hideDelay   : false,
          position    : 'bottom',
          controller  : authInviteERRORToastCtrl,
          scope: $scope,
          preserveScope:true,
          parent : $document[0].querySelector('.gp-signInContainer'),
          template :  '<md-toast class="md-warning-toast-theme"><div class="md-toast-text flex">{{errorMsg}}</div><div class="md-toast-text "><md-button ng-click="closeInviteToast()">Close</md-button></div></md-toast>'
        });
        function authInviteERRORToastCtrl($scope, $rootScope, $mdDialog, $mdToast) {
           $scope.closeInviteToast = function() {
             $mdToast.hide();
             }
        }
      }
      else {
        if(response.data.firstName === 'Guest') {
          var gpKey = response.data.ccGuid;
          $state.go('invitedAuthNewUserProfileForm');
          $scope.appDemo1GetUserProfile(gpKey);
          $scope.appDemo1GetUserInformation();
        }
        else {
          var gpKey = response.data.ccGuid;
          $scope.appDemo1GetUserProfile(gpKey);
          $scope.appDemo1GetUserInformation();
          $scope.getQuoteEngagementDetails();
        }
      }
    });
  }

  //*********************************** Get the Quote Engagement Details  **********************************//
  $scope.getQuoteEngagementDetails = function() {
    console.log('invitedAuthCtrl');
    $state.go('invitedAuthEngagementDetails',  {projectKey : $rootScope.iaProjectKey, quoteKey: $rootScope.iaEngagementKey});
    apiSrvc.getData('appDemo1GetCompanyUsers').then(function(response){
      $rootScope.companyUsersForAP = response.data;
    });
    apiSrvc.getData('appDemo1GetProjectDetails&gpkey=' + $rootScope.iaProjectKey).then(function(response){
      $rootScope.projectDetails = response.data;
      if($rootScope.projectDetails.exposure === 3) {
        $rootScope.projectDetails.exposure = 1;
      }
      $rootScope.quotesReceived = response.data.QuotesReceived;
      $rootScope.engagementsToApprove = response.data.EngagementsToApprove;
    //NOTE: Fore testing purposes only
      angular.forEach(response.data.QuotesReceived, function(item) {
        if(item.gpKey === $rootScope.iaEngagementKey) {
          $rootScope.iaQuoteDetails = item;
          if($rootScope.iaQuoteDetails.consultant.averageReview > 0) {
            $scope.callLastFunction();
          }
          $rootScope.authorizedPayersForAP = [];
          $rootScope.authorizedPayersForAP = [{name: "Add New", gpKey: null}];
          angular.forEach($rootScope.companyUsersForAP, function(user) {
            if(user.isPayer) {  //Is an authorized Payer
              $rootScope.authorizedPayersForAP.push(user);
            }
          });
        }
      });

      console.log("Search for engagement");
      angular.forEach(response.data.Engagements, function(item) {
        if(item.gpKey == $rootScope.iaEngagementKey){
          // **********
          console.log("engagement found");
          $scope.quoteInvitationInfo = item.quoteInvitationInfo;
          console.log($scope.quoteInvitationInfo);
          //
          $rootScope.showRecurringInfo = false;
          if($scope.quoteInvitationInfo.quoteType === 1){
            $rootScope.beforeEngagementType = "a"
            $rootScope.engagementtype = "Fixed";
          } else if($scope.quoteInvitationInfo.quoteType === 2){
            $rootScope.beforeEngagementType = "an"
            $rootScope.engagementtype = " Hourly";
            $rootScope.showHours = true
            $rootScope.hoursQuoted = 0
            for(var i = 0; i < $scope.quoteInvitationInfo.qHours.length; i++){
              var qHours = $scope.quoteInvitationInfo.qHours[i];
              $rootScope.hoursQuoted += (qHours.hoursQuoted);
            }
          } else if($scope.quoteInvitationInfo.quoteType === 3){
            $rootScope.showRecurringInfo = true;
            //
            if ($scope.quoteInvitationInfo.qRecurring.recurringPeriod==1){
              $rootScope.RecurringBillingPeriod = $scope.recurringPeriods[0].name;
            } else if ($scope.quoteInvitationInfo.qRecurring.recurringPeriod==2){
              $rootScope.RecurringBillingPeriod = $scope.recurringPeriods[1].name;
            } else if($scope.quoteInvitationInfo.qRecurring.recurringPeriod==3) {
              $rootScope.RecurringBillingPeriod = $scope.recurringPeriods[2].name;
            }
            $rootScope.RecurringNumberOfPeriods = $scope.quoteInvitationInfo.qRecurring.numberPeriods;
            $rootScope.RecurringBillingAmount = $scope.quoteInvitationInfo.qRecurring.periodAmount;
            $rootScope.RecurringBillingStartDate = $scope.quoteInvitationInfo.qRecurring.autoBillStartDate;
            //
            $rootScope.beforeEngagementType = "a"
            $rootScope.engagementtype = " Recurring";
          }
          // **********
        }
      });

    });
  }
  $scope.processEngagementInvoiceAuthorizedUserSelected = function(engagementGpKey, authorizedPayer) {
    apiSrvc.getData('appDemo1ProcessEngagementInvoiceAuthorizedUserSelected&gpKey='+engagementGpKey+'&userKey='+authorizedPayer.gpKey).then(function(response) {
      if(response.errors.length > 0) {}
      else {
        $mdToast.show({
            hideDelay   : false,
            position    : 'bottom',
            parent : $document[0].querySelector('.gp-invoiceAuthorizationInputGroup'),
            scope:$scope,
            preserveScope:true,
            controller  : auMsgSentToastCtrl,
            template :  '<md-toast><div class="md-toast-text flex">Request Sent!</div><div class="md-toast-text "></div><div class="md-toast-text "><md-button ng-click="closeAUMsgSent()">Close</md-button></div></md-toast>'
          });
         function auMsgSentToastCtrl($scope, $rootScope, apiSrvc, commonFnSrvc, $mdDialog, $mdToast) {
           $scope.closeAUMsgSent = function() {$mdToast.hide(); $state.go('company');}
         }
      }
    });
  }
  //*********************************** Save Invited Company New User Info **********************************//
  $scope.saveInvitedAuthNewUser = function(companyUserEdit) {
    var jsonDataObject = {
      firstName: companyUserEdit.firstName,
      lastName: companyUserEdit.lastName,
      email: companyUserEdit.email,
      password: companyUserEdit.password,
      gpKey: companyUserEdit.gpKey,
      generatePassword: 1,
      isPayer: true
    }
    upload({
      url: __env.apiUrl+'/index.asp?remotemethodaddon=appDemo1SetUserProfile&RequestBinary=true',
      method: 'POST',
      data : {
        jsonData : JSON.stringify(jsonDataObject),
      }
    }).then(function(response) {
      if(response.data.errors.length > 0) {
      }
      else {
        $scope.getQuoteEngagementDetails();
      }
    });
  }

  //*********************************** Expert Star Rating **********************************//
  $scope.callLastFunction = function() {$(".myrating").rating({displayOnly: true, step: 0.5});}
  $scope.showProjectFunding = false;
  $scope.agreeToPayProcessingFee = function() {
    $scope.showProjectFunding = true;
    apiSrvc.getData('appDemo1GetFundingTerms').then(function(response) {$scope.fundingTerms = response.data});
    apiSrvc.getData('appDemo1GetPaymentFields')
    .then(function(response) {
      if(response) {
        var myEcommerceFields = response.data.replace("body", "#js-ecommercePayments3");
        $('#js-ecommercePayments3').html(myEcommerceFields);
      }
    });
  }

  $scope.showFundingAgreement = false;
  $scope.showApproveToStartBtn = false;
  $scope.agreeToPaymentFee = function(engagementGpKey, signature, quoteDetails) {
    if (engagementGpKey) {
      var formSerializeData = $("#js-ecommercePayments3").serialize();
      if(formSerializeData) {
        formSerializeData = '&' + formSerializeData;
      }
      apiSrvc.sendPostData('appDemo1ProcessEngagementAwardInvoiceAuthorization&gpKey='+engagementGpKey+'&signature='+signature+formSerializeData)
      .then(function(response) {
        if(response.errors.length > 0) {
          $scope.ccError = true;
          $scope.errorMsg = response.errors[0].userMsg;
        }
        else {
          $scope.showFundingAgreement = true;
          $scope.showApproveToStartBtn = true;
          $scope.showProjectFunding = false;
        }
      })
    }
  }
  $scope.calculateEngagementAgreementTotal = function(ft, nte) {
    $scope.financeFee =  $rootScope.iaQuoteDetails.engagementAmount * (ft.fee * 0.01);
    $scope.engagementAgreementTotal = $scope.financeFee + $rootScope.iaQuoteDetails.engagementAmount;
    if( $scope.engagementAgreementTotal > nte) {
      $mdToast.show(
       $mdToast.simple({parent : $document[0].querySelector('.gp-engagementFeesWrapper')})
         .textContent('Agreement total exceeds Not To Exceed amount')
         .hideDelay(3000)
         .theme("danger-toast")
     );
    }
  }

  $scope.selectAuthorizedPayer = function(ap) {
    $scope.showAddNewAP = false;
    $scope.showRequestAuthBtn = false;
    if(ap.gpKey == null) {
      $scope.showAddNewAP = true;
      $scope.showRequestAuthBtn = false;
    }
    else {
      $scope.showRequestAuthBtn = true;
      $scope.showAddNewAP = false;
    }
  }

  $scope.approve = function(fundingTerm, notToExceedAmmt) {
    apiSrvc.getData('appDemo1ProcessEngagementAward&gpKey='+$rootScope.iaQuoteDetails.gpKey).then(function(response) {
      if(response.errors.length > 0) {
      }
      else {
        $state.go('company');
      }
    })
  }

}); //End of Controller
