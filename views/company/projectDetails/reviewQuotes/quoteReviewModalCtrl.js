function quoteReviewModalCtrl($scope, $rootScope, apiSrvc, commonFnSrvc, $document, $mdDialog, $mdToast, quoteDetails, userInfo, accountInfoData) { //companyUsers,
  $scope.accountStatusInfo =  accountInfoData;
  console.log(accountInfoData);
  $scope.currentLimit = (accountInfoData.creditLimit - accountInfoData.currentBalance - quoteDetails.engagementAmount);
  $( document ).ready(function() {$(".myrating").rating({displayOnly: true, step: 0.5});});
  $scope.rejectDialog = false;
  $scope.quoteDetails = quoteDetails;

  $scope.userInfo = userInfo;
  $scope.accountInfoData = accountInfoData;

  $scope.cancel = function() {
    $mdDialog.cancel();
  };
  $scope.backToDashboard = function() {
    $rootScope.closeAndGoToDash = true;
    $mdDialog.cancel();
  };
  $scope.showProjectFunding = false;

  $scope.appDemo1GetPlanInformation = function() {
    apiSrvc.getData('appDemo1GetPlanInformation').then(function(response){
      $scope.planInformation = response.data;
      $scope.feeAmt = response.data.Fee;
    });
  };
  $scope.appDemo1GetPlanInformation();


  // ***************************

  $scope.QuoteTotal = function(){
    var total = 0;
    if($scope.quoteDetails.quoteInvitationInfo.quoteType==1){
      for(var i = 0; i < $scope.quoteDetails.quoteInvitationInfo.qFix.length; i++){
        var qFix = $scope.quoteDetails.quoteInvitationInfo.qFix[i];
        total += (qFix.milestonePrice);
      }
    } else if ($scope.quoteDetails.quoteInvitationInfo.quoteType==2) {
      for(var i = 0; i < $scope.quoteDetails.quoteInvitationInfo.qHours.length; i++){
        var qHours = $scope.quoteDetails.quoteInvitationInfo.qHours[i];
        total += (qHours.hoursQuoted * qHours.freelanceHourlyRate);
      }
    }
    else if ($scope.quoteDetails.quoteInvitationInfo.quoteType==3) {
      total = $scope.quoteDetails.quoteInvitationInfo.qRecurring.numberPeriods * $scope.quoteDetails.quoteInvitationInfo.qRecurring.periodAmount;
    }
    return total;
  };

  $scope.QuoteTotalHours = function(){
    var total = 0;
    if($scope.quoteDetails.quoteInvitationInfo.quoteType==2){
      for(var i = 0; i < $scope.quoteDetails.quoteInvitationInfo.qHours.length; i++){
        var qHours = $scope.quoteDetails.quoteInvitationInfo.qHours[i];
        total += (qHours.hoursQuoted);
      }
    }
    return total;
  };
  //////// VALIADCION DATOS OSCAR///////

  $scope.quoteInvitationInfo =   ($scope.quoteDetails.quoteInvitationInfo);
  $scope.qtResponse = [];
  $scope.engagementtype = "";


  if($scope.quoteInvitationInfo.quoteType === 1){
      //alert("QFIX")
      $scope.beforeEngagementType = "a"
      $scope.engagementtype = "Fixed";
      for (let i = 0; i < $scope.quoteInvitationInfo.qFix.length; i++) {
        $scope.qtResponse.push({
          milestonePrice: $scope.quoteInvitationInfo.qFix[i].milestonePrice,
          supportingNarrative: $scope.quoteInvitationInfo.qFix[i].supportingNarrative
        })

      }
  } else if($scope.quoteInvitationInfo.quoteType === 2){
    $scope.beforeEngagementType = "an"
    $scope.engagementtype = " Hourly";
    for (let i = 0; i < $scope.quoteInvitationInfo.qHours.length; i++) {
      $scope.qtResponse.push({
        freelanceHourlyRate: $scope.quoteInvitationInfo.qHours[i].freelanceHourlyRate,
          supportingNarrative: $scope.quoteInvitationInfo.qHours[i].supportingNarrative,
          hoursQuoted: $scope.quoteInvitationInfo.qHours[i].hoursQuoted,
      })
    }
  } else if($scope.quoteInvitationInfo.quoteType === 3){
    //alert("QREq")
    $scope.beforeEngagementType = "a"
    $scope.engagementtype = " Recurring";
    //
    if ($scope.quoteInvitationInfo.qRecurring.recurringPeriod==1){
      $scope.recurringPeriodName = "Weekly";
    } else if ($scope.quoteInvitationInfo.qRecurring.recurringPeriod==2) {
      $scope.recurringPeriodName = "Bi-Weekly";
    } else if ($scope.quoteInvitationInfo.qRecurring.recurringPeriod==3) {
      $scope.recurringPeriodName = "Monthly";
    }
    //
    $scope.qtResponse.push({
      autoBillStartDate: $scope.quoteInvitationInfo.qRecurring.autoBillStartDate,
      deliverableDescription: $scope.quoteInvitationInfo.qRecurring.deliverableDescription,
      numberPeriods: $scope.quoteInvitationInfo.qRecurring.numberPeriods,
      periodAmount: $scope.quoteInvitationInfo.qRecurring.periodAmount,
      recurringPeriod: $scope.quoteInvitationInfo.qRecurring.recurringPeriod,
    })
  }


  ////////////////////// Send Request for Authorized User ///////////////
  $scope.appDemo1ProcessEngagementInvoiceAuthorizedUserInvitation = function(engagementGpKey, newAPEmail) {
    apiSrvc.getData('appDemo1ProcessEngagementInvoiceAuthorizedUserInvitation&gpKey='+engagementGpKey+'&email='+newAPEmail).then(function(response) {
      if(response.errors.length > 0) {
        $scope.errorMsg = 'Error.  Cannot process your request.'
        if(response.errors[0].number == 720) {
          // $scope.errorMsg = response.errors[0].userMsg;
          $scope.errorMsg = 'Cannot add new user. Email already exists in the system.';
        }

        $mdToast.show({
          hideDelay   : false,
          position    : 'bottom',
          controller  : authInviteERRORToastCtrl,
          scope:$scope,
          preserveScope:true,
          parent : $document[0].querySelector('.gp-invoiceAuthorizationInputGroup'),
          template :  '<md-toast class="md-warning-toast-theme"><div class="md-toast-text flex">{{errorMsg}}</div><div class="md-toast-text "><md-button ng-click="closeInviteToast()">Close</md-button></div></md-toast>'
        });
        function authInviteERRORToastCtrl($scope, $rootScope, $mdDialog, $mdToast) {
           $scope.closeInviteToast = function() {
             $mdToast.hide();
             }
        }
      }
      else {
          $mdToast.show({
            hideDelay   : false,
            position    : 'bottom',
            controller  : authInviteSentToastCtrl,
            scope:$scope,
            preserveScope:true,
            parent : $document[0].querySelector('.gp-invoiceAuthorizationInputGroup'),
            template :  '<md-toast><div class="md-toast-text flex"> Success!  Your authorization request has been sent. Once the Authorized Payer has agreed to the invoice terms, they will "approve to start" the project.</div><div class="md-toast-text "><md-button ng-click="closeInviteToast()">Close</md-button></div></md-toast>'
          });
        function authInviteSentToastCtrl($scope, $rootScope, $mdDialog, $mdToast) {
           $scope.closeInviteToast = function() {
             $mdToast.hide();
             $mdDialog.cancel();}
        }
      }
    })
  };

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
            controller  : auMsgToastCtrl,
            template :  '<md-toast><div class="md-toast-text flex">Request Sent!</div><div class="md-toast-text "></div><div class="md-toast-text "><md-button ng-click="closeAUMsgSent()">Close</md-button></div></md-toast>'
          });
         function auMsgToastCtrl($scope, $rootScope, apiSrvc, commonFnSrvc, $mdDialog, $mdToast) {
           $scope.closeAUMsgSent = function() {$mdToast.hide();$mdDialog.cancel();}
         }
      }
    });
  };

  $scope.appDemo1ProcessEngagementAwardInvoiceAuthorization = function() {};
  //////////////////// PAY if Authorized User /////////////////
  $scope.agreeToPayProcessingFee = function(signature) {
    $scope.authPayerSignature = signature;
    $scope.openFA = true;
    $scope.showProjectFunding = true;
  };
  apiSrvc.getData('appDemo1GetFundingTerms').then(function(response) {
    $scope.fundingTerms = response.data});

  apiSrvc.getData('appDemo1GetPaymentFieldsFee').then(function(response) {
    if(response) {
      var myEcommerceFields = response.data.replace("body", "#js-ecommercePayments2");
      $('#js-ecommercePayments2').html(myEcommerceFields);
    }
  });
  $scope.ccError = false;
  $scope.formNotComplete = false;
  $scope.showFundingAgreement = false;
  $scope.showApproveToStartBtn = false;
  $scope.agreeToPaymentFee = function(engagementGpKey, quoteDetails) {
    // console.log(signature);
    // console.log($scope.authPayerSignature);
    // var signature = $scope.authPayerSignature;
    //   // Check for Empty Ecommerce form using Jquery
    if($("#js-ecommercePayments2 #cardType").val().length === 0 ){
      $("#js-ecommercePayments2 #cardType").addClass('gp-errOutline');
    }
    else { $("#js-ecommercePayments2 #cardType").removeClass('gp-errOutline');}

    if($("#js-ecommercePayments2 #cardNumber").val().length === 0 ){
      $("#js-ecommercePayments2 #cardNumber").addClass('gp-errOutline');
    }
    else {$("#js-ecommercePayments2 #cardNumber").removeClass('gp-errOutline');}

    if($("#js-ecommercePayments2 #cardExpirationMonth").val().length === 0 ){
      $("#js-ecommercePayments2 #cardExpirationMonth").addClass('gp-errOutline');
    }
    else {$("#js-ecommercePayments2 #cardExpirationMonth").removeClass('gp-errOutline');}

    if($("#js-ecommercePayments2 #cardExpirationYear").val().length === 0 ){
      $("#js-ecommercePayments2 #cardExpirationYear").addClass('gp-errOutline');
    }
    else {$("#js-ecommercePayments2 #cardExpirationYear").removeClass('gp-errOutline');}

    if($("#js-ecommercePayments2 #cardCVV").val().length === 0 ){
      $("#js-ecommercePayments2 #cardCVV").addClass('gp-errOutline');
    }
    else {$("#js-ecommercePayments2 #cardCVV").removeClass('gp-errOutline');}

    if($("#js-ecommercePayments2 #cardName").val().length === 0 ){
      $("#js-ecommercePayments2 #cardName").addClass('gp-errOutline');
    }
    else {$("#js-ecommercePayments2 #cardName").removeClass('gp-errOutline');}
    //BANK ACCOUNT
    if($("#js-ecommercePayments2 #onDemandMethodAchRoutingNumber").val().length === 0 ){
      $("#js-ecommercePayments2 #onDemandMethodAchRoutingNumber").addClass('gp-errOutline');
    }
    else {$("#js-ecommercePayments2 #onDemandMethodAchRoutingNumber").removeClass('gp-errOutline');}

    if($("#js-ecommercePayments2 #onDemandMethodAchAccountNumber").val().length === 0 ){
      $("#js-ecommercePayments2 #onDemandMethodAchAccountNumber").addClass('gp-errOutline');
    }
    else {$("#js-ecommercePayments2 #onDemandMethodAchAccountNumber").removeClass('gp-errOutline');}

    if($("#js-ecommercePayments2 #onDemandMethodAchAccountName").val().length === 0 ){
      $("#js-ecommercePayments2 #onDemandMethodAchAccountName").addClass('gp-errOutline');
    }
    else {$("#js-ecommercePayments2 #onDemandMethodAchAccountName").removeClass('gp-errOutline');}

    if (engagementGpKey) {
      var formSerializeData = $("#js-ecommercePayments2").serialize();
      if(formSerializeData) {
        formSerializeData = '&' + formSerializeData;
      }

    apiSrvc.sendPostData('appDemo1ProcessEngagementAwardInvoiceAuthorization&gpKey='+engagementGpKey+'&signature='+$scope.authPayerSignature+formSerializeData)
    .then(function(response) {
      if(response.errors.length > 0) {
        $scope.ccError = true;
        $scope.errorMsg = response.errors[0].userMsg;
        $mdToast.show({
          hideDelay   : false,
          position    : 'bottom',
          controller  : paymentToastCtrl,
          scope:$scope,
          preserveScope:true,
          parent : $document[0].querySelector('.gp-ecommerceWrapper'),
          template :  '<md-toast class="md-danger-toast-theme"><div class="md-toast-text flex">Error: {{errorMsg}}</div><div class="md-toast-text "><md-button ng-click="cancelToast()">Ok</md-button></div></md-toast>'
        });
        function paymentToastCtrl($scope, $rootScope, apiSrvc, commonFnSrvc, $mdDialog, $mdToast) {
          $scope.cancelToast = function() {
            $mdToast.hide()
          }
        }
       }
      else {
        $scope.showFundingAgreement = true;
        $scope.showApproveToStartBtn = true;
        quoteDetails.companyInvoiceApproved = true;
        if(userInfo.role.gpKey === "{f87dc87e-d4c4-4e22-b025-f212cd659910}") {}
        else {
          userInfo.role.gpKey = "{f87dc87e-d4c4-4e22-b025-f212cd659910}";
          userInfo.role.name = "Authorized Payer";
          apiSrvc.sendPostData('appDemo1SetUserProfile', userInfo).then(function(response){})
        }
      }
    })
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

  $scope.differentFeeNeeded = true;

  $scope.approve = function() {
    //NOTE: if this is from a group invite, all of the other invites need to be rejected that have the same engagement ID
    apiSrvc.getData('appDemo1ProcessEngagementAward&gpKey='+quoteDetails.gpKey).then(function(response) {
      if(response.errors > 0) {}
      else {
        $rootScope.approveToast = true;
        quoteDetails.label = "Approved";
        quoteDetails.labelClass = "label-success";
        $mdDialog.cancel();
      }

    })
  }
  $scope.reject = function() {
    $mdToast.show({
      hideDelay   : false,
      position    : 'bottom',
      controller  : ToastCtrl,
      scope:$scope,
      preserveScope:true,
      parent : $document[0].querySelector('#quoteReviewModal'),
      template :  '<md-toast><div class="md-toast-text flex">Do you wish to give a reason for this rejection?</div><div class="md-toast-text "><md-button class="md-highlight" ng-click="rejectWithExplanation()">Yes, add explanation</md-button></div><div class="md-toast-text "><md-button ng-click="processEngagementReject()">No, just reject the quote</md-button></div><div class="md-toast-text "><md-button ng-click="cancelToast()">Cancel</md-button></div></md-toast>'
    });
   }
   function ToastCtrl($scope, $rootScope, apiSrvc, commonFnSrvc, $mdDialog, $mdToast) {
     $scope.rejectWithExplanation = function() {
       $scope.rejectDialog = true;
       $mdToast.hide()
     }
     $scope.processEngagementRejectWithExplanation = function(explanation) {
       apiSrvc.getData('appDemo1ProcessEngagementReject&gpKey='+quoteDetails.gpKey+'&rejectExplanation='+explanation).then(function(response) {
         $rootScope.rejectToast = true;
         quoteDetails.label = "Rejected";
         quoteDetails.labelClass = "label-danger";
         $mdDialog.cancel();
       })
     }
     $scope.processEngagementReject = function(explanation, explanationSelect) {
       if(explanationSelect != 0) {
         var explanation = explanationSelect;
       }
       if(!explanation) {
         var explanation = "No explanation given";
       }
       apiSrvc.getData('appDemo1ProcessEngagementReject&gpKey='+quoteDetails.gpKey+'&rejectExplanation='+explanation).then(function(response) {
         $rootScope.rejectToast = true;
         quoteDetails.label = "Rejected";
         quoteDetails.labelClass = "label-danger";
         $mdDialog.cancel();
       })
     }
     $scope.cancelToast = function() {$mdToast.hide()}
   }
  $scope.showTextareaRejection = false;
  $scope.selectRejectionReason = function(explanationSelect) {
    if(explanationSelect == 0) {
      $scope.showTextareaRejection = true;
    }
    else {
      $scope.showTextareaRejection = false;
    }
  }
  $scope.cancelExplanation = function() {$scope.rejectDialog = false;}

  $scope.showReplyDialog = false;
  $scope.msgSentSuccess = false;
  $scope.sendReplyMessage = function() {
    $scope.showReplyDialog = true;
  }
  $scope.hideReplyModal = function() {
    $scope.showReplyDialog = false;
  }
  $scope.appDemo1ProcessCompanySendEngagementMessage = function(quoteDetails, message) {
  if(!message) {
    $mdToast.show(
     $mdToast.simple({parent : $document[0].querySelector('#quoteReviewModal')})
       .textContent('You forgot the message!')
       .hideDelay(1500)
       .theme("warning-toast")
   );
  }
  else {
    apiSrvc.getData('appDemo1ProcessCompanySendEngagementMessage&engagementKey='+quoteDetails.gpKey+'&gpkey='+quoteDetails.consultant.gpKey+'&msg='+message).then(function(response){
      if(response.errors.length > 0) {
      }
      else {
        $scope.msgSentSuccess = true;
          $mdToast.show({
            hideDelay   : false,
            position    : 'bottom',
            controller  : SEMToastCtrl,
            scope:$scope,
            preserveScope:true,
            parent : $document[0].querySelector('#quoteReviewModal'),
            template :  '<md-toast class="md-primary-toast-theme"><div class="md-toast-text flex">Message Sent</div><div class="md-toast-text "><md-button ng-click="closeSEMToast()">Close</md-button></div></md-toast>'
          });
         function SEMToastCtrl($scope, $rootScope, apiSrvc, commonFnSrvc, $mdDialog, $mdToast) {
           $scope.closeSEMToast = function() {$mdToast.hide(); $scope.showReplyDialog = false;}
         }
      }
    });
  }
}

  $scope.openQR = false;
  $scope.openQuoteOverview = function() {$scope.openQR = true;}
  $scope.closeQuoteOverview = function() {$scope.openQR = false;}
  $scope.openIA = false;
  $scope.openInvoiceAuthorization = function() {$scope.openIA = true;}
  $scope.closeInvoiceAuthorization = function() {$scope.openIA = false;}
  $scope.openFA = false;
  $scope.openFundingAgreement = function() {$scope.openFA = true;}
  $scope.closeFundingAgreement = function() {$scope.openFA = false;}
}
