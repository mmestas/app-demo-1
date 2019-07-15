function engagementsToApproveModalCtrl($scope, $rootScope, apiSrvc, commonFnSrvc, $mdDialog, $mdToast, $document, Upload, upload, engagementDetails, accountInfoData, planInformation, userInfo, blockUI, $timeout) {

  $scope.engagementDetails = engagementDetails;
  $scope.checkQuoteTypeLabels = function() {
    if(engagementDetails.rated) {
      $scope.showRatingBtn = false;
      engagementDetails.label = "Completed";
      engagementDetails.labelClass = "label-default";
    }
    else {
      var keepGoing = true;
      //Fixed
      if(engagementDetails.quoteInvitationInfo.quoteType === 1) {
        angular.forEach($scope.engagementDetails.quoteInvitationInfo.qFix, function(fixed) {
          if(keepGoing) {
            if(fixed.completed) {
              //consultant completed the milestone
              if(fixed.approved) {
                //company approved (and paid for) the milestone
                $scope.showRatingBtn = true;
                engagementDetails.label = "Rate";
                engagementDetails.labelClass = "label-primary";
              }
              else {
                //Consultant has completed the milestone but it has not been approved by the company
                //This status takes precidence
                $scope.showRatingBtn = false;
                keepGoing = false;
                engagementDetails.label = "Accept & Pay";
                engagementDetails.labelClass = "label-warning";
              }
            }
            else {
              // consultant has not completed a milestone
              showRatingBtn = false;
              engagementDetails.label = "Approved";
              engagementDetails.labelClass = "label-success";
            }
          }

        })
      }
      // Hourly
      else if(engagementDetails.quoteInvitationInfo.quoteType === 2) {
        //hourly
        angular.forEach($scope.engagementDetails.quoteInvitationInfo.qHours, function(hourly) {
          if(keepGoing) {
            if(hourly.completed) {
              //consultant completed the milestone
              if(hourly.approved) {
                //company approved (and paid for) the milestone
                $scope.showRatingBtn = true;
                engagementDetails.label = "Rate";
                engagementDetails.labelClass = "label-primary";
              }
              else {
                //Consultant has completed the milestone but it has not been approved by the company
                //This status takes precidence
                $scope.showRatingBtn = false;
                keepGoing = false;
                engagementDetails.label = "Accept & Pay";
                engagementDetails.labelClass = "label-warning";
              }
            }
            else {
              // consultant has not completed a milestone
              showRatingBtn = false;
              engagementDetails.label = "Approved";
              engagementDetails.labelClass = "label-success";
            }
          }

        })
      }
      // Recurring
      else if(engagementDetails.quoteInvitationInfo.quoteType === 3) {
        engagementDetails.label = "Recurring";
        engagementDetails.labelClass = "label-success";
      }
    }



  };

  $scope.checkQuoteTypeLabels();
  //For Ratings
  $scope.getRatingAheadOfTime = function() {
    apiSrvc.getData('appDemo1GetConsultantEngagementRating&gpKey='+engagementDetails.gpKey).then(function(response) {
       $scope.rated = response.data;
       if($scope.rated) {
         $scope.callStarsLast($scope.rated);
       }
    });
  }
  if(engagementDetails.rated) {
    $scope.getRatingAheadOfTime();
  }
  if(engagementDetails.quoteInvitationInfo.quoteType === 3) {
    if(engagementDetails.rated) {
      $scope.getRatingAheadOfTime();
    }
    else {
      $scope.showRatingBtn = true;
    }
  }

  if(accountInfoData.bypassProcessingFee) {
    $scope.bypassProcessingFee = true;
  }
  else {
    $scope.bypassProcessingFee = false;

  }

  $scope.accountStatusInfo =  accountInfoData;
  $scope.currentUserInfo = userInfo;
  $scope.rejectDialog = false;

  $scope.consultantHourlyRate = (engagementDetails.engagementAmount / engagementDetails.hoursQuoted);
  $scope.currentLimit = (accountInfoData.creditLimit - accountInfoData.currentBalance - 0);
  $scope.cancel = function() {$mdDialog.cancel();};
  $scope.closeDialogue = function() {
    $mdDialog.hide();
    //ALL milestones must be complete to show Rating Btn - Unless it is a Recurring quote
    //Once an engagement has been rated, the Rating btn will not show
    $scope.showRatingBtn = false;
    if(engagementDetails.rated) {
      //Engagement has been rated - the entire engagement is complete and consultant has been rated
      $scope.showRatingBtn = false;
      engagementDetails.label = "Completed";
      engagementDetails.labelClass = "label-default";
    }
    else {
      // Consultant has not been rated
      var keepGoing = true;
      //Fixed
      if(engagementDetails.quoteInvitationInfo.quoteType === 1) {
        angular.forEach($scope.engagementDetails.quoteInvitationInfo.qFix, function(fixed) {
          if(keepGoing) {
            if(fixed.completed) {
              //consultant completed the milestone
              if(fixed.approved) {
                //company approved (and paid for) the milestone
                $scope.showRatingBtn = true;
                engagementDetails.label = "Rate";
                engagementDetails.labelClass = "label-primary";
              }
              else {
                //Consultant has completed the milestone but it has not been approved by the company
                //This status takes precidence
                $scope.showRatingBtn = false;
                keepGoing = false;
                engagementDetails.label = "Accept & Pay";
                engagementDetails.labelClass = "label-warning";
              }
            }
            else {
              // consultant has not completed a milestone
              showRatingBtn = false;
              engagementDetails.label = "Approved";
              engagementDetails.labelClass = "label-success";
            }
          }

        })
      }
      // Hourly
      else if(engagementDetails.quoteInvitationInfo.quoteType === 2) {
        //hourly
        angular.forEach($scope.engagementDetails.quoteInvitationInfo.qHours, function(hourly) {
          if(keepGoing) {
            if(hourly.completed) {
              //consultant completed the milestone
              if(hourly.approved) {
                //company approved (and paid for) the milestone
                $scope.showRatingBtn = true;
                engagementDetails.label = "Rate";
                engagementDetails.labelClass = "label-primary";
              }
              else {
                //Consultant has completed the milestone but it has not been approved by the company
                //This status takes precidence
                $scope.showRatingBtn = false;
                keepGoing = false;
                engagementDetails.label = "Accept & Pay";
                engagementDetails.labelClass = "label-warning";
              }
            }
            else {
              // consultant has not completed a milestone
              showRatingBtn = false;
              engagementDetails.label = "Approved";
              engagementDetails.labelClass = "label-success";
            }
          }

        })
      }
      // Recurring
      else if(engagementDetails.quoteInvitationInfo.quoteType === 3) {
        engagementDetails.label = "Recurring";
        engagementDetails.labelClass = "label-success";
      }
    }
  };

  $scope.backToDashboard = function() {
    $rootScope.closeAndGoToDash = true;
    $mdDialog.cancel();
  };
  apiSrvc.getData('appDemo1GetFundingTerms').then(function(response) {
    $scope.fundingTerms = response.data;
    $scope.fundingTerm = $scope.fundingTerms[0];
    $scope.fundingTermFee = $scope.fundingTerms[0].fee;
  });

  $scope.openQR = true;
  $scope.openQuoteOverview = function() {$scope.openQR = true;};
  $scope.closeQuoteOverview = function() {$scope.openQR = false;};
  $scope.openFA = false;
  $scope.openFundingAgreement = function() {$scope.openFA = true;};
  $scope.closeFundingAgreement = function() {$scope.openFA = false;};

  if($scope.taskTotalAmount > 0) {
    $scope.taskTotalAmount = $scope.taskTotalAmount;
  }
  else {
    $scope.taskTotalAmount = 0;
  }

  $scope.showPayOnReceipt = false; //Added 11.14.18
  $scope.doubleClickPrevention = false; //Added 11.14.18

  /**************************** ADDED 5.3.18 *******************************/
  if(!$scope.taskKeyArray) {
    $scope.taskKeyArray = [];
  };

  $scope.getTotalForSelectedTasks = function() {
    var taskTotalArray = [];
    var taskTotalAmount = 0;
    $scope.taskTotalAmount = 0;
    var taskTotalHoursCompleted = 0;
    $scope.taskTotalHoursCompleted = 0;
    var taskKeyArray = [];

    angular.forEach(engagementDetails.tasks, function(task, key) {
      if(task.addThisToTheArray) {
        taskKeyArray.push({gpKey:task.gpKey})
        if(taskTotalArray.indexOf(task) !== -1) {}
        else {
          $scope.totalExpensesForTask = 0;
          angular.forEach(task.itemizedExpenses, function(expense) {
            $scope.totalExpensesForTask = ($scope.totalExpensesForTask + expense.amount);
          })
          taskTotalArray.push(task);
          taskTotalHoursCompleted = taskTotalHoursCompleted + task.hoursCompleted;
          taskTotalAmount = (taskTotalHoursCompleted * $scope.consultantHourlyRate) + $scope.totalExpensesForTask;
          $scope.taskTotalAmount = taskTotalAmount;
          $scope.taskTotalHoursCompleted = taskTotalHoursCompleted;
        }
        $scope.taskTotalArray = taskTotalArray;
      }
      $scope.taskKeyArray = taskKeyArray;
      $scope.currentLimit = (accountInfoData.creditLimit - accountInfoData.currentBalance - $scope.taskTotalAmount);
    });
  };
  $scope.getTotalForSelectedFixedTasks = function() {
    //
    var result = 0;
    var resultForTaskOnly = 0;
    var taskKeyArray = [];
    var taskKeyExpenseArray = [];
    //
    angular.forEach(engagementDetails.quoteInvitationInfo.qFix, function(task, key) {
      if (task.uiApproved){
        taskKeyArray.push({gpKey:task.gpKey});
        result += task.milestonePrice;
        resultForTaskOnly += task.milestonePrice;
      }

      if (task.uiExpenseApproved){
        taskKeyExpenseArray.push({gpKey:task.gpKey})
        angular.forEach(task.itemizedExpenses, function(expense, key) {
          result += expense.amount;
        })
      }

    });

    $scope.taskTotalAmount = result;
    $scope.taskKeyArray = taskKeyArray;
    $scope.taskKeyExpenseArray = taskKeyExpenseArray;

    if($scope.bypassProcessingFee) {
        resultForTaskOnly = resultForTaskOnly * planInformation.Fee;
        $scope.processingFee = resultForTaskOnly;
        return [result, resultForTaskOnly];
    }
    else {
      return result;
    }


    //

  };
  $scope.getTotalForSelectedHourlyTasks = function() {
    //
    var result = 0;
    var resultForTaskOnly = 0;
    var taskKeyArray = [];
    var taskKeyExpenseArray = [];
    //
    angular.forEach(engagementDetails.quoteInvitationInfo.qHours, function(task, key) {
      if (task.uiApproved){
        taskKeyArray.push({gpKey:task.gpKey})
        result += task.hoursCompleted * task.freelanceHourlyRate
        resultForTaskOnly += (task.hoursCompleted * task.freelanceHourlyRate)
      }

      if (task.uiExpenseApproved){
        taskKeyExpenseArray.push({gpKey:task.gpKey})
        angular.forEach(task.itemizedExpenses, function(expense, key) {
          result += expense.amount;
        })
      }

    });
    //
    $scope.taskTotalAmount = result;
    $scope.taskKeyArray = taskKeyArray;
    $scope.taskKeyExpenseArray = taskKeyExpenseArray;
    if($scope.bypassProcessingFee) {
        resultForTaskOnly = resultForTaskOnly * planInformation.Fee;
        $scope.processingFee = resultForTaskOnly;
        return [result, resultForTaskOnly];
    }
    else {
      return result;
    }
  };
  $scope.getTotalForSelectedRecurringTask = function() {
    //
    var result = 0;
    var taskKeyArray = [];
    var taskKeyExpenseArray = [];
    //
    if (engagementDetails.quoteInvitationInfo.qRecurring.uiApproved){
      taskKeyArray.push({gpKey:engagementDetails.quoteInvitationInfo.qRecurring.gpKey})
      result += engagementDetails.quoteInvitationInfo.qRecurring.numberPeriods * engagementDetails.quoteInvitationInfo.qRecurring.periodAmount ;
    }

    if (engagementDetails.quoteInvitationInfo.qRecurring.uiExpenseApproved){
      taskKeyExpenseArray.push({gpKey:engagementDetails.quoteInvitationInfo.qRecurring.gpKey})
      angular.forEach(engagementDetails.quoteInvitationInfo.qRecurring.itemizedExpenses, function(expense, key) {
        result += expense.amount;
      })
    }

    //
    $scope.taskTotalAmount = result;
    $scope.taskKeyArray = taskKeyArray;
    $scope.taskKeyExpenseArray = taskKeyExpenseArray;
    return result;
  };
  $scope.getTotalForSelectedTasks();
  $scope.dueDate = new Date();
  $scope.calculateEngagementAgreementTotal = function(ft, total) {
    console.log('this function was called');
    if(!ft) {
    ft = $scope.fundingTerm;
    }
    else {
      $scope.fundingTerm = ft;
    }

    var days = 0;
    var td = new Date();
    var newdate = new Date(td);

    if(ft.gpKey === '{F2F2C203-DA39-4D8B-8CF5-EBA3143616FB}') {days = 0; console.log('log 0');}
    else if(ft.gpKey === '{DE18F3BA-2C60-4415-971F-CAA40EC56C09}') {days = 15; console.log('log 15');}
    else if(ft.gpKey === '{3A18D87F-B9BE-4CC9-9CDF-9840F990C8D4}') {days = 30; console.log('log 30');}
    else if(ft.gpKey === '{DC7F65D7-9E48-49CE-B654-36D122BC9C8E}') {days = 45; console.log('log 45');}
    else if(ft.gpKey === '{9ba2866f-319e-412b-80b8-4f16fa8ab359}') {days = 60; console.log('log 60');}
    else {days = 0; console.log('else');}

    $scope.dueDate = newdate.setDate(newdate.getDate() + days);
    $scope.financeFee =  total * (ft.fee * 0.01);
    $scope.fundingTermFee = (ft.fee * 0.01);
    $scope.engagementAgreementTotal = $scope.financeFee + total;
  };

  $scope.$watch('taskTotalAmount', function() {
    if(!$scope.fundingTermFee) {$scope.fundingTermFee = 0;}
    $scope.financeFee = $scope.taskTotalAmount * $scope.fundingTermFee;
    if($scope.processingFee) {
      $scope.engagementAgreementTotal = $scope.financeFee + $scope.taskTotalAmount + $scope.processingFee;
    }
    else {
      $scope.engagementAgreementTotal = $scope.financeFee + $scope.taskTotalAmount;
    }

  })
  /*******************************************************************************************/

  // ********************ORIGINAL********************************
  $scope.approveTask = function() {
    $scope.doubleClickPrevention = true;
    $scope.showPayOnReceipt = false;
    var dataObject = {
      engagementKey : engagementDetails.gpKey,
      fundingTermKey : $scope.fundingTerm.gpKey,
      taskKeys : $scope.taskKeyArray
    }
    apiSrvc.sendPostData('appDemo1SetCompanyEngagementTask', dataObject).then(function(response) {
      if(response.errors.length > 0) {

      }
      else {
        $rootScope.taskHasBeenApproved = true;  //Is this necessary anymore?

        $scope.engagementDetails = response.data;

        $scope.taskKeyArray = [];

        $scope.rateConsultant($scope.engagementDetails.tasks[0]);

      }
    })
  };
  $scope.submitTaskPayment = function() {
    var dataObject = {
      engagementKey : engagementDetails.gpKey,
      fundingTermKey : $scope.fundingTerm.gpKey,
      taskKeys : $scope.taskKeyArray
    }
    $scope.ccError = false;
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

    if (engagementDetails.gpKey) {
      var formSerializeData = $("#js-ecommercePayments2").serialize();
      if(formSerializeData) {
        formSerializeData = '&' + formSerializeData;
      }
      // apiSrvc.sendPostData('appDemo1SetCompanyEngagementTask', dataObject + formSerializeData)
      apiSrvc.sendPostData('appDemo1SetCompanyEngagementTask&'+formSerializeData, dataObject)

      .then(function(response) {
        console.log(response);
        if(response.errors.length > 0) {
          $scope.ccError = true;
          $scope.errorMsg = response.errors[0].userMsg;
          $mdToast.show({
            hideDelay   : false,
            position    : 'bottom',
            controller  : paymentErrorToastCtrl,
            scope:$scope,
            preserveScope:true,
            parent : $document[0].querySelector('.gp-ecommerceWrapper'),
            template :  '<md-toast class="md-danger-toast-theme"><div class="md-toast-text flex">Error: {{errorMsg}}</div><div class="md-toast-text "><md-button ng-click="cancelToast()">Ok</md-button></div></md-toast>'
          });
          function paymentErrorToastCtrl($scope, $rootScope, apiSrvc, commonFnSrvc, $mdDialog, $mdToast) {
            $scope.cancelToast = function() {
              $mdToast.hide()
            }
          }
         }
         else {
           $mdToast.show({
             hideDelay   : false,
             position    : 'bottom',
             controller  : paymentSuccessToastCtrl,
             scope:$scope,
             preserveScope:true,
             parent : $document[0].querySelector('.gp-dialogueInnerContent'),
             template :  '<md-toast class="md-success-toast-theme"><div class="md-toast-text flex">Your payment has been successfully submitted!</div><div class="md-toast-text "><md-button ng-click="cancelToast()">Ok</md-button></div></md-toast>'
           });
           function paymentSuccessToastCtrl($scope, $rootScope, apiSrvc, commonFnSrvc, $mdDialog, $mdToast) {
             $scope.cancelToast = function() {
               $mdToast.hide();

             }
           }
           $scope.engagementDetails.tasks = response.data.tasks;
           $scope.taskKeyArray = [];
           $scope.showPayOnReceipt = false;
           $scope.taskTotalAmount = 0;
           $scope.taskTotalHoursCompleted = 0;
         }
      })
    }
};
  // **********************FIXED*********************************
  $scope.approveFixedTask = function() {
    $scope.doubleClickPrevention = true;
    $scope.showPayOnReceipt = false;
    var dataObject = {
      engagementKey : engagementDetails.gpKey,
      fundingTermKey : $scope.fundingTerm.gpKey,
      taskKeys : $scope.taskKeyArray,
      taskKeysExpenses : $scope.taskKeyExpenseArray
    }
    //
    //NOTE: Don't erase this because you know they'll be wanting it back in later...
    if($scope.fundingTerm.gpKey === '{F2F2C203-DA39-4D8B-8CF5-EBA3143616FB}') {
      $scope.showPayOnReceipt = true;
      apiSrvc.getData('appDemo1GetPaymentFieldsTasks').then(function(response) {
        if(response) {
          var myEcommerceFields = response.data.replace("body", "#js-ecommercePaymentsFixed");
          $('#js-ecommercePaymentsFixed').html(myEcommerceFields);
        }
      });
    }
    else {
      apiSrvc.sendPostData('appDemo1SetCompanyEngagementFixedTask', dataObject).then(function(response) {
        if(response.errors.length > 0) {

        }
        else {
          $rootScope.taskHasBeenApproved = true;
          $scope.engagementDetails = response.data;
          $scope.taskKeyArray = [];
          $scope.taskKeyExpenseArray = [];
          //In place of above
          $scope.rateConsultant($scope.engagementDetails.quoteInvitationInfo.qFix[0]);

        }
      })
    }
};
  $scope.submitTaskFixedPayment = function() {
    var dataObject = {
      engagementKey : engagementDetails.gpKey,
      fundingTermKey : $scope.fundingTerm.gpKey,
      taskKeys : $scope.taskKeyArray,
      taskKeysExpenses : $scope.taskKeyExpenseArray
    }
    $scope.ccError = false;
    if($("#js-ecommercePaymentsFixed #cardType").val().length === 0 ){
      $("#js-ecommercePaymentsFixed #cardType").addClass('gp-errOutline');
    }
    else { $("#js-ecommercePaymentsFixed #cardType").removeClass('gp-errOutline');}

    if($("#js-ecommercePaymentsFixed #cardNumber").val().length === 0 ){
      $("#js-ecommercePaymentsFixed #cardNumber").addClass('gp-errOutline');
    }
    else {$("#js-ecommercePaymentsFixed #cardNumber").removeClass('gp-errOutline');}

    if($("#js-ecommercePaymentsFixed #cardExpirationMonth").val().length === 0 ){
      $("#js-ecommercePaymentsFixed #cardExpirationMonth").addClass('gp-errOutline');
    }
    else {$("#js-ecommercePaymentsFixed #cardExpirationMonth").removeClass('gp-errOutline');}

    if($("#js-ecommercePaymentsFixed #cardExpirationYear").val().length === 0 ){
      $("#js-ecommercePaymentsFixed #cardExpirationYear").addClass('gp-errOutline');
    }
    else {$("#js-ecommercePaymentsFixed #cardExpirationYear").removeClass('gp-errOutline');}

    if($("#js-ecommercePaymentsFixed #cardCVV").val().length === 0 ){
      $("#js-ecommercePaymentsFixed #cardCVV").addClass('gp-errOutline');
    }
    else {$("#js-ecommercePaymentsFixed #cardCVV").removeClass('gp-errOutline');}

    if($("#js-ecommercePaymentsFixed #cardName").val().length === 0 ){
      $("#js-ecommercePaymentsFixed #cardName").addClass('gp-errOutline');
    }
    else {$("#js-ecommercePaymentsFixed #cardName").removeClass('gp-errOutline');}
    //BANK ACCOUNT
    if($("#js-ecommercePaymentsFixed #onDemandMethodAchRoutingNumber").val().length === 0 ){
      $("#js-ecommercePaymentsFixed #onDemandMethodAchRoutingNumber").addClass('gp-errOutline');
    }
    else {$("#js-ecommercePaymentsFixed #onDemandMethodAchRoutingNumber").removeClass('gp-errOutline');}

    if($("#js-ecommercePaymentsFixed #onDemandMethodAchAccountNumber").val().length === 0 ){
      $("#js-ecommercePaymentsFixed #onDemandMethodAchAccountNumber").addClass('gp-errOutline');
    }
    else {$("#js-ecommercePaymentsFixed #onDemandMethodAchAccountNumber").removeClass('gp-errOutline');}

    if($("#js-ecommercePaymentsFixed #onDemandMethodAchAccountName").val().length === 0 ){
      $("#js-ecommercePaymentsFixed #onDemandMethodAchAccountName").addClass('gp-errOutline');
    }
    else {$("#js-ecommercePaymentsFixed #onDemandMethodAchAccountName").removeClass('gp-errOutline');}

    if (engagementDetails.gpKey) {
      var formSerializeData = $("#js-ecommercePaymentsFixed").serialize();
      if(formSerializeData) {
        formSerializeData = '&' + formSerializeData;
      }
      // apiSrvc.sendPostData('appDemo1SetCompanyEngagementTask', dataObject + formSerializeData)
      apiSrvc.sendPostData('appDemo1SetCompanyEngagementFixedTask'+formSerializeData, dataObject)

      .then(function(response) {
        console.log(response);
        if(response.errors.length > 0) {
          $scope.ccError = true;
          $scope.errorMsg = response.errors[0].userMsg;
          $mdToast.show({
            hideDelay   : false,
            position    : 'bottom',
            controller  : paymentErrorToastCtrl,
            scope:$scope,
            preserveScope:true,
            parent : $document[0].querySelector('.gp-ecommerceWrapper'),
            template :  '<md-toast class="md-danger-toast-theme"><div class="md-toast-text flex">Error: {{errorMsg}}</div><div class="md-toast-text "><md-button ng-click="cancelToast()">Ok</md-button></div></md-toast>'
          });
          function paymentErrorToastCtrl($scope, $rootScope, apiSrvc, commonFnSrvc, $mdDialog, $mdToast) {
            $scope.cancelToast = function() {
              $mdToast.hide()
            }
          }
         }
         else {
           $mdToast.show({
             hideDelay   : false,
             position    : 'bottom',
             controller  : paymentSuccessToastCtrl,
             scope:$scope,
             preserveScope:true,
             parent : $document[0].querySelector('.gp-dialogueInnerContent'),
             template :  '<md-toast class="md-success-toast-theme"><div class="md-toast-text flex">Your payment has been successfully submitted!</div><div class="md-toast-text "><md-button ng-click="cancelToast()">Ok</md-button></div></md-toast>'
           });
           function paymentSuccessToastCtrl($scope, $rootScope, apiSrvc, commonFnSrvc, $mdDialog, $mdToast) {
             $scope.cancelToast = function() {
               $mdToast.hide();

             }
           }
           $scope.engagementDetails = response.data;
           $scope.taskKeyArray = [];
           $scope.showPayOnReceipt = false;
           $scope.taskTotalAmount = 0;
           $scope.taskTotalHoursCompleted = 0;
         }
      })
    }
};
  // ************************HOURLY******************************
  $scope.approveHourlyTask = function() {
    $scope.doubleClickPrevention = true;
    $scope.showPayOnReceipt = false;
    var dataObject = {
      engagementKey : engagementDetails.gpKey,
      fundingTermKey : $scope.fundingTerm.gpKey,
      taskKeys : $scope.taskKeyArray,
      taskKeysExpenses : $scope.taskKeyExpenseArray
    }
    //
    //NOTE: Don't erase this because you know they'll be wanting it back in later...
    if($scope.fundingTerm.gpKey === '{F2F2C203-DA39-4D8B-8CF5-EBA3143616FB}') {
      $scope.showPayOnReceipt = true;
      apiSrvc.getData('appDemo1GetPaymentFieldsTasks').then(function(response) {
        if(response) {
          var myEcommerceFields = response.data.replace("body", "#js-ecommercePaymentsHourly");
          $('#js-ecommercePaymentsHourly').html(myEcommerceFields);
        }
      });
    }
    else {
      apiSrvc.sendPostData('appDemo1SetCompanyEngagementHourlyTask', dataObject).then(function(response) {
        if(response.errors.length > 0) {

        }
        else {
          $rootScope.taskHasBeenApproved = true;
          $scope.engagementDetails = response.data;
          $scope.taskKeyArray = [];
          $scope.taskKeyExpenseArray = [];
          //In place of above
          $scope.rateConsultant($scope.engagementDetails.quoteInvitationInfo.qHours[0]);

        }
      })
    }
};
  $scope.submitTaskHourlyPayment = function() {
    var dataObject = {
      engagementKey : engagementDetails.gpKey,
      fundingTermKey : $scope.fundingTerm.gpKey,
      taskKeys : $scope.taskKeyArray,
      taskKeysExpenses : $scope.taskKeyExpenseArray
    }
    $scope.ccError = false;
    if($("#js-ecommercePaymentsHourly #cardType").val().length === 0 ){
      $("#js-ecommercePaymentsHourly #cardType").addClass('gp-errOutline');
    }
    else { $("#js-ecommercePaymentsHourly #cardType").removeClass('gp-errOutline');}

    if($("#js-ecommercePaymentsHourly #cardNumber").val().length === 0 ){
      $("#js-ecommercePaymentsHourly #cardNumber").addClass('gp-errOutline');
    }
    else {$("#js-ecommercePaymentsHourly #cardNumber").removeClass('gp-errOutline');}

    if($("#js-ecommercePaymentsHourly #cardExpirationMonth").val().length === 0 ){
      $("#js-ecommercePaymentsHourly #cardExpirationMonth").addClass('gp-errOutline');
    }
    else {$("#js-ecommercePaymentsHourly #cardExpirationMonth").removeClass('gp-errOutline');}

    if($("#js-ecommercePaymentsHourly #cardExpirationYear").val().length === 0 ){
      $("#js-ecommercePaymentsHourly #cardExpirationYear").addClass('gp-errOutline');
    }
    else {$("#js-ecommercePaymentsHourly #cardExpirationYear").removeClass('gp-errOutline');}

    if($("#js-ecommercePaymentsHourly #cardCVV").val().length === 0 ){
      $("#js-ecommercePaymentsHourly #cardCVV").addClass('gp-errOutline');
    }
    else {$("#js-ecommercePaymentsHourly #cardCVV").removeClass('gp-errOutline');}

    if($("#js-ecommercePaymentsHourly #cardName").val().length === 0 ){
      $("#js-ecommercePaymentsHourly #cardName").addClass('gp-errOutline');
    }
    else {$("#js-ecommercePaymentsHourly #cardName").removeClass('gp-errOutline');}
    //BANK ACCOUNT
    if($("#js-ecommercePaymentsHourly #onDemandMethodAchRoutingNumber").val().length === 0 ){
      $("#js-ecommercePaymentsHourly #onDemandMethodAchRoutingNumber").addClass('gp-errOutline');
    }
    else {$("#js-ecommercePaymentsHourly #onDemandMethodAchRoutingNumber").removeClass('gp-errOutline');}

    if($("#js-ecommercePaymentsHourly #onDemandMethodAchAccountNumber").val().length === 0 ){
      $("#js-ecommercePaymentsHourly #onDemandMethodAchAccountNumber").addClass('gp-errOutline');
    }
    else {$("#js-ecommercePaymentsHourly #onDemandMethodAchAccountNumber").removeClass('gp-errOutline');}

    if($("#js-ecommercePaymentsHourly #onDemandMethodAchAccountName").val().length === 0 ){
      $("#js-ecommercePaymentsHourly #onDemandMethodAchAccountName").addClass('gp-errOutline');
    }
    else {$("#js-ecommercePaymentsHourly #onDemandMethodAchAccountName").removeClass('gp-errOutline');}

    if (engagementDetails.gpKey) {
      var formSerializeData = $("#js-ecommercePaymentsHourly").serialize();
      if(formSerializeData) {
        formSerializeData = '&' + formSerializeData;
      }
      // apiSrvc.sendPostData('appDemo1SetCompanyEngagementTask', dataObject + formSerializeData)
      apiSrvc.sendPostData('appDemo1SetCompanyEngagementHourlyTask'+formSerializeData, dataObject)

      .then(function(response) {
        console.log(response);
        if(response.errors.length > 0) {
          $scope.ccError = true;
          $scope.errorMsg = response.errors[0].userMsg;
          $mdToast.show({
            hideDelay   : false,
            position    : 'bottom',
            controller  : paymentErrorToastCtrl,
            scope:$scope,
            preserveScope:true,
            parent : $document[0].querySelector('.gp-ecommerceWrapper'),
            template :  '<md-toast class="md-danger-toast-theme"><div class="md-toast-text flex">Error: {{errorMsg}}</div><div class="md-toast-text "><md-button ng-click="cancelToast()">Ok</md-button></div></md-toast>'
          });
          function paymentErrorToastCtrl($scope, $rootScope, apiSrvc, commonFnSrvc, $mdDialog, $mdToast) {
            $scope.cancelToast = function() {
              $mdToast.hide()
            }
          }
         }
         else {
           $mdToast.show({
             hideDelay   : false,
             position    : 'bottom',
             controller  : paymentSuccessToastCtrl,
             scope:$scope,
             preserveScope:true,
             parent : $document[0].querySelector('.gp-dialogueInnerContent'),
             template :  '<md-toast class="md-success-toast-theme"><div class="md-toast-text flex">Your payment has been successfully submitted!</div><div class="md-toast-text "><md-button ng-click="cancelToast()">Ok</md-button></div></md-toast>'
           });
           function paymentSuccessToastCtrl($scope, $rootScope, apiSrvc, commonFnSrvc, $mdDialog, $mdToast) {
             $scope.cancelToast = function() {
               $mdToast.hide();

             }
           }
            $scope.engagementDetails = response.data;

           $scope.taskKeyArray = [];
           $scope.showPayOnReceipt = false;
           $scope.taskTotalAmount = 0;
           $scope.taskTotalHoursCompleted = 0;
         }
      })
    }
};
  // ************************RECURRING***************************
  $scope.submitTaskRecurringPayment = function() {
    var dataObject = {
      engagementKey : engagementDetails.gpKey,
      fundingTermKey : $scope.fundingTerm.gpKey,
      taskKeys : $scope.taskKeyArray,
      taskKeysExpenses : $scope.taskKeyExpenseArray
    }
    $scope.ccError = false;
    if($("#js-ecommercePaymentsRecurring #cardType").val().length === 0 ){
      $("#js-ecommercePaymentsRecurring #cardType").addClass('gp-errOutline');
    }
    else { $("#js-ecommercePaymentsRecurring #cardType").removeClass('gp-errOutline');}

    if($("#js-ecommercePaymentsRecurring #cardNumber").val().length === 0 ){
      $("#js-ecommercePaymentsRecurring #cardNumber").addClass('gp-errOutline');
    }
    else {$("#js-ecommercePaymentsRecurring #cardNumber").removeClass('gp-errOutline');}

    if($("#js-ecommercePaymentsRecurring #cardExpirationMonth").val().length === 0 ){
      $("#js-ecommercePaymentsRecurring #cardExpirationMonth").addClass('gp-errOutline');
    }
    else {$("#js-ecommercePaymentsRecurring #cardExpirationMonth").removeClass('gp-errOutline');}

    if($("#js-ecommercePaymentsRecurring #cardExpirationYear").val().length === 0 ){
      $("#js-ecommercePaymentsRecurring #cardExpirationYear").addClass('gp-errOutline');
    }
    else {$("#js-ecommercePaymentsRecurring #cardExpirationYear").removeClass('gp-errOutline');}

    if($("#js-ecommercePaymentsRecurring #cardCVV").val().length === 0 ){
      $("#js-ecommercePaymentsRecurring #cardCVV").addClass('gp-errOutline');
    }
    else {$("#js-ecommercePaymentsRecurring #cardCVV").removeClass('gp-errOutline');}

    if($("#js-ecommercePaymentsRecurring #cardName").val().length === 0 ){
      $("#js-ecommercePaymentsRecurring #cardName").addClass('gp-errOutline');
    }
    else {$("#js-ecommercePaymentsRecurring #cardName").removeClass('gp-errOutline');}
    //BANK ACCOUNT
    if($("#js-ecommercePaymentsRecurring #onDemandMethodAchRoutingNumber").val().length === 0 ){
      $("#js-ecommercePaymentsRecurring #onDemandMethodAchRoutingNumber").addClass('gp-errOutline');
    }
    else {$("#js-ecommercePaymentsRecurring #onDemandMethodAchRoutingNumber").removeClass('gp-errOutline');}

    if($("#js-ecommercePaymentsRecurring #onDemandMethodAchAccountNumber").val().length === 0 ){
      $("#js-ecommercePaymentsRecurring #onDemandMethodAchAccountNumber").addClass('gp-errOutline');
    }
    else {$("#js-ecommercePaymentsRecurring #onDemandMethodAchAccountNumber").removeClass('gp-errOutline');}

    if($("#js-ecommercePaymentsRecurring #onDemandMethodAchAccountName").val().length === 0 ){
      $("#js-ecommercePaymentsRecurring #onDemandMethodAchAccountName").addClass('gp-errOutline');
    }
    else {$("#js-ecommercePaymentsRecurring #onDemandMethodAchAccountName").removeClass('gp-errOutline');}

    if (engagementDetails.gpKey) {
      var formSerializeData = $("#js-ecommercePaymentsRecurring").serialize();
      if(formSerializeData) {
        formSerializeData = '&' + formSerializeData;
      }
      // apiSrvc.sendPostData('appDemo1SetCompanyEngagementTask', dataObject + formSerializeData)
      apiSrvc.sendPostData('appDemo1SetCompanyEngagementRecurringTask&'+formSerializeData, dataObject)

      .then(function(response) {
        console.log(response);
        if(response.errors.length > 0) {
          $scope.ccError = true;
          $scope.errorMsg = response.errors[0].userMsg;
          $mdToast.show({
            hideDelay   : false,
            position    : 'bottom',
            controller  : paymentErrorToastCtrl,
            scope:$scope,
            preserveScope:true,
            parent : $document[0].querySelector('.gp-ecommerceWrapper'),
            template :  '<md-toast class="md-danger-toast-theme"><div class="md-toast-text flex">Error: {{errorMsg}}</div><div class="md-toast-text "><md-button ng-click="cancelToast()">Ok</md-button></div></md-toast>'
          });
          function paymentErrorToastCtrl($scope, $rootScope, apiSrvc, commonFnSrvc, $mdDialog, $mdToast) {
            $scope.cancelToast = function() {
              $mdToast.hide()
            }
          }
         }
         else {
           $mdToast.show({
             hideDelay   : false,
             position    : 'bottom',
             controller  : paymentSuccessToastCtrl,
             scope:$scope,
             preserveScope:true,
             parent : $document[0].querySelector('.gp-dialogueInnerContent'),
             template :  '<md-toast class="md-success-toast-theme"><div class="md-toast-text flex">Your payment has been successfully submitted!</div><div class="md-toast-text "><md-button ng-click="cancelToast()">Ok</md-button></div></md-toast>'
           });
           function paymentSuccessToastCtrl($scope, $rootScope, apiSrvc, commonFnSrvc, $mdDialog, $mdToast) {
             $scope.cancelToast = function() {
               $mdToast.hide();

             }
           }
           $scope.engagementDetails.tasks = response.data.tasks;
           $scope.taskKeyArray = [];
           $scope.showPayOnReceipt = false;
           $scope.taskTotalAmount = 0;
           $scope.taskTotalHoursCompleted = 0;
         }
      })
    }
  };
  // ************************************************************
  $scope.closeAndOpenEIModal = function(consultant) {};
  $scope.cancelExplanation = function() {$scope.rejectDialog = false;};
  /***************************************** RATING ***************************************/
  $scope.showRating = false;
  $scope.showRated = false;
  // Rate Button function - shows rating form
  $scope.showRatingForm = function() {
    $(".rateMyExpert").rating({displayOnly: false, step: 0.5});
    $scope.showRating = true;
  };
  $scope.hideRatingForm = function() {
    $scope.showRating = false;
    $scope.showRated = false;
  };
  // Rating Form
  $scope.submitRating = function(ratings) {
    upload({
        url: __env.apiUrl+'/index.asp?remotemethodaddon=appDemo1SetConsultantEngagementRating&RequestBinary=true',
        method: 'POST',
        data : {
          jsonData : JSON.stringify(ratings),
          gpKey: engagementDetails.gpKey
        }
      }).then(function(response) {
        if(response.data.errors.length > 0) {
          console.log('errors');
          $scope.toastErrorMsg = 'There has been an error';
          $mdToast.show({
            hideDelay   : false,
            position    : 'bottom',
            parent : $document[0].querySelector('#EngagementsToApproveModal'),
            scope:$scope,
            preserveScope:true,
            controller  : reviewToastCtrl,
            template :  '<md-toast class="md-primary-toast-theme"><div class="md-toast-text flex">{{toastErrorMsg}}</div><md-button ng-click="closeToast()">Ok</md-button></md-toast>'
          });
           function reviewToastCtrl($scope, $rootScope, apiSrvc, commonFnSrvc, $mdDialog, $mdToast) {
             $scope.closeToast = function() {$mdToast.hide(); $scope.hideRatingForm(); }
           }
        }
        else {
          console.log(response.data.data);
          // $scope.engagementDetails = response.data.data; //Comment for a moment
          engagementDetails.rated = true;
          $rootScope.consultantWasRated = true;
          $scope.showRatingBtn = false;
          $mdToast.show({
            hideDelay   : false,
            position    : 'bottom',
            parent : $document[0].querySelector('#EngagementsToApproveModal'),
            scope:$scope,
            preserveScope:true,
            controller  : reviewToastCtrl,
            template :  '<md-toast class="md-primary-toast-theme"><div class="md-toast-text flex">Your review has been saved!</div><md-button ng-click="closeToast()">Ok</md-button></md-toast>'
          });
           function reviewToastCtrl($scope, $rootScope, apiSrvc, commonFnSrvc, $mdDialog, $mdToast) {
             $scope.closeToast = function() {$mdToast.hide(); $scope.hideRatingForm(); }
           }
        }

      });
  };

  $scope.displayRating = function() {
    $scope.showRated = true;
    if(!$scope.rated) {
      $scope.getRatingAheadOfTime();
    }
  };
  $scope.callStarsLast = function(rated) {
    $(".expertRated").rating({displayOnly: true, step: 0.5});
    $("#cost").rating('update', rated.cost);
    $("#quality").rating('update', rated.quality);
    $("#responsiveness").rating('update', rated.responsiveness);
    $("#timeliness").rating('update', rated.timeliness);
  };

  /***********************************************************************/

}; //END of CONTROLLER
