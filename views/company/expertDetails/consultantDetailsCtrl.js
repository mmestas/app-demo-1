app.controller('consultantDetailsCtrl', function($scope, $rootScope, $state, $stateParams, $document, apiSrvc, commonFnSrvc, passDataSrvc, NgTableParams, Upload, upload, $filter, blockUI, $http, $mdDialog, $mdToast, $timeout, $q, $location, authSrvc, envSrvc, config) {

  console.log($stateParams);
  var gpKey = $stateParams.id;

  $scope.init = function() {
    $scope.appDemo1GetConsultantInformation(gpKey);
  }
  $scope.callLastRating = function() {
    console.log('call last');
    $('.referenceRating').rating({displayOnly: true, step: 0.5});
  }
  $scope.appDemo1GetConsultantInformation = function(gpKey) {
    console.log('get Consultant Info');
    console.log(gpKey);
    apiSrvc.getData('appDemo1GetConsultantInformation&gpKey='+gpKey).then(function(response) {
      var responseCopy = angular.copy(response);
      $scope.expertDetails = response.data;
      var starValue = response.data.averageReview;
      $(".consultantRating").rating({displayOnly: true, step: 0.5});
      $('.consultantRating').rating('update', starValue);
      $scope.consultantReferences = response.data.references;
    })
  }

  //////////////////// Show Engagement Invite Modal  ////////////////////////
  $scope.showEngagementInviteModal = function(ev, sl) {
    $rootScope.closeAndGoToDash = false;
    $scope.slInfo = sl;
    $mdDialog.show({
      controller: EICtrl,
      templateUrl: '/views/company/projectDetails/findExperts/modals/inviteToQuoteModal.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose:true,
      locals: {
           slInfo: $scope.slInfo,
           userInfo: $scope.userInfo,
           projectInfo: $scope.projectDetails,
           referenceFile: $rootScope.referenceFile
         },
      onRemoving: function (event, removePromise) {
        if($rootScope.closeAndGoToDash) {
          $state.go('company');
        }
      }
    });
  };

  //////////////////// Show Send Message Short List Modal ////////////////////////
  $scope.showSendMsgSLModal = function(ev, sl) {
    $rootScope.closeAndGoToDash = false;
    $scope.slInfo = sl;
    $mdDialog.show({
      controller: sendMsgSLCtrl,
      templateUrl: '/views/company/projectDetails/findExperts/modals/sendMessageSLModal.html',
      parent: angular.element(document.querySelector('.gp-dashWrapper')),
      targetEvent: ev,
      clickOutsideToClose:true,
      locals: {
           slInfo: $scope.slInfo,
           userInfo: $scope.userInfo,
           projectInfo: $scope.projectDetails
         },
      onRemoving: function (event, removePromise) {
       if($rootScope.closeAndGoToDash) {
         $state.go('company');
       }
      }
    });
  };


});
