app.controller('companyProfileCtrl', function($rootScope, $scope, $state, $stateParams, $location, $document,  $timeout, apiSrvc, commonFnSrvc, passDataSrvc, authSrvc, envSrvc, NgTableParams, Upload, upload, $filter, blockUI, $http, $mdDialog, $mdToast, $location, config) {

  /************************************************************************************************************/
  /******************************************* Company Profile Form *******************************************/
  /************************************************************************************************************/
  $scope.companyProfileInit = function() {
    var verifyActiveAcct = function(response) {
      if(response) {
        if($stateParams.editCompanyUsers) {
          $scope.editUsers(0);
        }
        else {
          $scope.closeEditUsers();
        }

        var functionSet = function() {
          $scope.appDemo1GetCompanyInformation();
          commonFnSrvc.appDemo1GetCompanyUsers($scope);
          commonFnSrvc.appDemo1GetPlanInformation($scope);
          commonFnSrvc.appDemo1GetCompanyProfile($scope, $scope.userInfo);
        }

        authSrvc.getUserInfoForFunction($scope, functionSet);
      }
    }
    commonFnSrvc.getAccountStatus($scope, verifyActiveAcct);
  };

  $scope.appDemo1GetCompanyInformation = function() {
    commonFnSrvc.appDemo1GetCompanyInformation($scope);
  };

  /************************************** Edit Company User ****************************************/
  $scope.disableCompanyEditFields = true;
  $scope.selectUserToEdit = function(companyUser) {
    $scope.companyUserEdit = companyUser;
    $scope.disableCompanyEditFields = false;
  };
  $scope.saveUserEdits = function(companyUserEdit) {
    apiSrvc.sendPostData('appDemo1SetUserProfile', companyUserEdit).then(function(response){
      $mdToast.show({
        hideDelay   : false,
        position    : 'bottom',
        parent : $document[0].querySelector('.gp-ProfileButtons'),
        scope:$scope,
        preserveScope:true,
        controller  : editUserToastCtrl,
        template :  '<md-toast><div class="md-toast-text flex">Edits Saved!</div><div class="md-toast-text "></div><div class="md-toast-text "><md-button ng-click="closeEUToast()">Close</md-button></div></md-toast>'
      });
     function editUserToastCtrl($scope, $rootScope, apiSrvc, commonFnSrvc, $mdDialog, $mdToast) {
       $scope.closeEUToast = function() {$mdToast.hide()}
     }
    });
  };
  $scope.selectedTabNumber =  {
    inputTab: 0
  };
  $scope.viewEditProfile = false;
  $scope.viewEditUsers = false;
  $scope.editProfile = function(number) {
    commonFnSrvc.appDemo1GetCompanyCertifications($scope);
    commonFnSrvc.appDemo1GetBusinessTypes($scope);
    commonFnSrvc.appDemo1GetStates($scope);
    commonFnSrvc.appDemo1GetSecurityClearances($scope);
    commonFnSrvc.appDemo1GetBusinessTypes($scope);

    $scope.selectedTabNumber.inputTab = number;
    $scope.viewEditProfile = true;
    $scope.onTabSelected(number);
  };
  $scope.closeEditProfile = function() {
    $scope.viewEditProfile = false;
    $scope.selectedTabNumber.inputTab = 0;
  };
  $scope.onTabSelected = function(number) {
    $scope.selectedTabNumber.inputTab = number;
  };
  $scope.$watch('selectedTabNumber.inputTab', function(current, old) {});
  // $scope.editUsers = function(number) {$scope.viewEditUsers = true;};
  // $scope.closeEditUsers = function() {$scope.viewEditUsers = false;};

  $scope.selectImage = function(image) {
    $scope.companyImage = image;
  };
  $scope.companyProfileImage = "";
  $scope.saveAndCloseCompanyProfileForm = function(companyInfo, companyImage) {
    $scope.companyProfileImage = companyImage;
    var businessTypeString = angular.toJson($scope.businessTypeList);
    var businessTypes = JSON.parse(businessTypeString);
    var certificationListString = angular.toJson($scope.certificationList);
    var certificationList = JSON.parse(certificationListString);
    var companyString = angular.toJson(companyInfo);
    var companyInfo = JSON.parse(companyString);
    var jsonDataObject = {
      "companyName": companyInfo.companyName,
      "address": companyInfo.address,
      "address2": companyInfo.address2,
      "city": companyInfo.city,
      "state": companyInfo.state,
      "zip": companyInfo.zip,
      "website": companyInfo.website,
      "phone": companyInfo.phone,
      "duns": companyInfo.duns,
      "cage": companyInfo.cage,
      "poc": companyInfo.poc,
      "businessTypes": businessTypes,
      "annualRevenue": companyInfo.annualRevenue,
      "numberOfEmployees": companyInfo.numberOfEmployees,
      "securityClearance": companyInfo.securityClearance,
      "certifications": certificationList,
      "productsServicesOffered": companyInfo.productsServicesOffered,
      "contracts": companyInfo.contracts,
      "primaryNaicsCode": $scope.primaryNaics,
      "additionalNaicsCodes": $scope.additionalNaicsCodes,
      "gpKey": companyInfo.gpKey
    }

    if ((companyInfo != null) && (companyInfo.imageFilename != null)) {
      upload({
          url: __env.apiUrl+'/index.asp?remotemethodaddon=appDemo1SetCompanyProfile&RequestBinary=true',
          method: 'POST',
          data : {
            jsonData : JSON.stringify(jsonDataObject),
            imageFilename: companyImage
          }
        }).then(function(response) {
          $mdToast.show({
            hideDelay   : false,
            position    : 'bottom',
            parent : $document[0].querySelector('#editToastAnchor'),
            scope:$scope,
            preserveScope:true,
            controller  : CompanyEditFormToastCtrl,
            template :  '<md-toast><div class="md-toast-text flex">Your info has been updated and saved!</div><div class="md-toast-text "><md-button class="md-highlight" ng-click="closeToastCloseEditForm()">Close</md-button></div><div class="md-toast-text "><md-button ng-click="closeToastAndKeepEditing()">Continue Editing</md-button></div></md-toast>'
          });
         function CompanyEditFormToastCtrl($scope, $rootScope, apiSrvc, commonFnSrvc, $mdDialog, $mdToast) {
           $scope.closeToastCloseEditForm = function() {
             $scope.viewEditProfile = false;
             $mdToast.hide()
           }
           $scope.closeToastAndKeepEditing = function() {$mdToast.hide()}
         }
      });
    }
    else if ((companyInfo != null) && (companyInfo.imageFilename = 'undefined')) {
      upload({
          url: __env.apiUrl+'/index.asp?remotemethodaddon=appDemo1SetCompanyProfile&RequestBinary=true',
          method: 'POST',
          data : {
            jsonData : JSON.stringify(jsonDataObject),
          }
        }).then(function(response) {
          $mdToast.show({
            hideDelay   : false,
            position    : 'bottom',
            parent : $document[0].querySelector('#editToastAnchor'),
            scope:$scope,
            preserveScope:true,
            controller  : CompanyEditFormToastCtrl,
            template :  '<md-toast><div class="md-toast-text flex">Your info has been updated and saved!</div><div class="md-toast-text "><md-button class="md-highlight" ng-click="closeToastCloseEditForm()">Close</md-button></div><div class="md-toast-text "><md-button ng-click="closeToastAndKeepEditing()">Continue Editing</md-button></div></md-toast>'
          });
         function CompanyEditFormToastCtrl($scope, $rootScope, apiSrvc, commonFnSrvc, $mdDialog, $mdToast) {
           $scope.closeToastCloseEditForm = function() {
             $scope.viewEditProfile = false;
             $mdToast.hide()
           }
           $scope.closeToastAndKeepEditing = function() {$mdToast.hide()}
         }
        });
      }
    };
  $scope.emptyContracts = [""];
  $scope.addNewContract = function(index, contract) {
    $scope.companyInfo.contracts.push(contract);
    $scope.emptyContracts.push("");
  };
  $scope.removeContract = function(index, contract) {
    $scope.companyInfo.contracts.splice(index, 1);
  };
  $scope.addCertification = function(selectedCertification) {
    if($scope.certificationList.length < 1) {
      $scope.certificationList.push(selectedCertification);
    }
    var duplicates = false;
    angular.forEach($scope.certificationList, function(certification, index) {
      if(selectedCertification.gpKey === certification.gpKey) {
        duplicates = true;
      }
    })
    if(!duplicates) {
      $scope.certificationList.push(selectedCertification);
    }
  };
  $scope.removeCertification = function(index, certification) {
    $scope.certificationList.splice(index, 1);
  };
  $scope.searchNAICS = function(searchText) {
    return $http
     .get('/index.asp?remotemethodaddon=appDemo1GetNaicsCodesAutoCompleteResults&keyword='+searchText)
     .then(function(data) {
       return data.data.data;
      });
  };
  $scope.primaryNaicsSelected = false;
  $scope.addNAICS = function(naicsItem) {
    $scope.primaryNaics = naicsItem;
    $scope.companyInfo.primaryNaicsCode.name = naicsItem.name;
    $scope.companyInfo.primaryNaicsCode.code = naicsItem.code;
    $scope.primaryNaicsSelected = true;
  };
  $scope.addSecondaryNAICS = function(naicsItem) {
    if(naicsItem) {
      if($scope.additionalNaicsCodes.length < 1) {
        $scope.additionalNaicsCodes.push(naicsItem);
        self.clear = function() { self.searchSecondaryText = ''; }
        $scope.searchSecondaryText = '';
        $scope.selectedSecondaryItem= undefined;
        $scope.$$childTail.searchSecondaryText = '';
        $scope.$$childTail.selectedSecondaryItem = undefined;
      }
      var duplicates = false;
      angular.forEach($scope.additionalNaicsCodes, function(naics, index) {
        if(naicsItem.gpKey === naics.gpKey) {
          duplicates = true;
        }
      })
      if(!duplicates) {
        $scope.additionalNaicsCodes.push(naicsItem);
        self.clear = function() { self.searchSecondaryText = ''; }
        $scope.searchSecondaryText = '';
        $scope.selectedSecondaryItem= undefined;
        $scope.$$childTail.searchSecondaryText = '';
        $scope.$$childTail.selectedSecondaryItem = undefined;
      }
    }
  };
  $scope.removeSecondaryNAICS = function(index) {
    $scope.additionalNaicsCodes.splice(index, 1);
  };
  $scope.addBusinessType = function(selectedBusinessType) {
    if($scope.businessTypeList.length < 1) {
      $scope.businessTypeList.push(selectedBusinessType);
    }
    var duplicates = false;
    angular.forEach($scope.businessTypeList, function(businessType, index) {
      if(selectedBusinessType.gpKey === businessType.gpKey) {
        duplicates = true;
      }
    })
    if(!duplicates) {
      $scope.businessTypeList.push(selectedBusinessType);
    }
  };
  $scope.removeBusinessType = function(index, businessType) {
    $scope.businessTypeList.splice(index, 1);
  };
  $scope.isErrorInTabField = function() {
    if($scope.companyInfo) {
      if(!$scope.companyInfo.companyName || !$scope.companyInfo.address || !$scope.companyInfo.phone) {
        if(angular.element('#tab-item-0')) {
          angular.element('#tab-item-0').addClass('gp-dangerText')
        }
        if(angular.element('#tab-item-190')) {
          angular.element('#tab-item-190').addClass('gp-dangerText')
        }
      }
      else {
        if(angular.element('#tab-item-0')) {
          angular.element('md-tab-item').removeClass('gp-dangerText');
        }
        if(angular.element('#tab-item-190')) {
          angular.element('md-tab-item').removeClass('gp-dangerText');
        }
      }

      if(!$scope.primaryNaicsSelected && !$scope.companyInfo.primaryNaicsCode.name) {
        if(angular.element('#tab-item-1')) {
          angular.element('#tab-item-1').addClass('gp-dangerText')
        }
        if(angular.element('#tab-item-191')) {
          angular.element('#tab-item-191').addClass('gp-dangerText')
        }
      }
      else {
        if(angular.element('#tab-item-1')) {
          angular.element('#tab-item-1').removeClass('gp-dangerText')
        }
        if(angular.element('#tab-item-191')) {
          angular.element('#tab-item-191').removeClass('gp-dangerText')
        }
      }
    }
  };
  //NOTE: For tabs in editCompanyProfile.... not sure if these are necessary anymore
  $scope.isErrorInTabField0 = function() {};
  $scope.isErrorInTabField1 = function() {};

  /************************************** Invite New User to Company ****************************************/
    $scope.inviteNewUser = function(newUserInfo) {
      $scope.errorMsg = null;
      $scope.showErrorMsg = false;
      var planLimit = $scope.planInformation.ProjectLimit;
      var companyUsersLength = $scope.companyUsers.length;
      if(companyUsersLength >= planLimit) {
        console.log('you cannot add any more users');
        $scope.errorMsg = 'You have reached the maximum number of users for your plan.  If you would like to add more, please upgrade.'
        $scope.showErrorMsg = true;

      }
      else {
        console.log('keep calm and carry on');
        var companyKey = $scope.companyInfo.gpKey;


        if(newUserInfo) {
          var fn = ' First Name ';
          var ln = ' Last Name ';
          var pass = ' Password ';
          var email = ' Email ';
          $scope.showErrorMsg = true;
          $scope.errorMsg = 'Please enter a '+ fn + ' to send invitation';
          if(newUserInfo.firstName) {
            $scope.errorMsg = 'Please enter a '+ ln + ' to send invitation';
            if(newUserInfo.lastName) {
              $scope.errorMsg = 'Please enter a '+ pass + ' to send invitation';
              if(newUserInfo.password) {
                $scope.errorMsg = 'Please enter an '+ email + ' to send invitation';
                if(newUserInfo.email) {
                  $scope.showErrorMsg = false;
                  apiSrvc.sendPostData('appDemo1SetUserProfile&companyKey='+companyKey+'&sendEmail=1', newUserInfo).then(function(response){
                    if(response.errors.length > 0) {
                      $scope.errorMsg = response.errors[0].userMsg;
                      $scope.showErrorMsg = true;
                    }
                    else {
                      $mdToast.show({
                        hideDelay   : false,
                        position    : 'bottom',
                        parent : $document[0].querySelector('.gp-ProfileButtons-add'),
                        scope:$scope,
                        preserveScope:true,
                        controller  : inviteNewUserToastCtrl,
                        template :  '<md-toast><div class="md-toast-text flex">The new user has been added and a notification sent!</div><div class="md-toast-text "></div><div class="md-toast-text "><md-button ng-click="closeINUToast()">Close</md-button></div></md-toast>'
                      });
                     function inviteNewUserToastCtrl($scope, $rootScope, apiSrvc, $mdDialog, $mdToast, commonFnSrvc) {
                       $scope.closeINUToast = function() {
                         $mdToast.hide();
                         commonFnSrvc.appDemo1GetCompanyUsers($scope);
                         $scope.closeEditUsers();
                       }
                     }
                    }

                  });
                }
              }
            }
          }
        }
        else {
            $scope.showErrorMsg = true;
            $scope.errorMsg = 'Please fill out the form before submitting.'
        }

      }

    };

    /************************************** Edit Company User ****************************************/
    // Not sure why these are here - duplicates of above. discovered due to bug history 4.15.19
    // $scope.disableCompanyEditFields = true;
    // $scope.selectUserToEdit = function(companyUser) {
    //   $scope.companyUserEdit = companyUser;
    //   $scope.disableCompanyEditFields = false;
    // };
    // $scope.saveUserEdits = function(companyUserEdit) {
    //   apiSrvc.sendPostData('appDemo1SetUserProfile', companyUserEdit).then(function(response){
    //     $mdToast.show({
    //       hideDelay   : false,
    //       position    : 'bottom',
    //       parent : $document[0].querySelector('.gp-ProfileButtons'),
    //       scope:$scope,
    //       preserveScope:true,
    //       controller  : editUserToastCtrl,
    //       template :  '<md-toast><div class="md-toast-text flex">Edits Saved!</div><div class="md-toast-text "></div><div class="md-toast-text "><md-button ng-click="closeEUToast()">Close</md-button></div></md-toast>'
    //     });
    //    function editUserToastCtrl($scope, $rootScope, apiSrvc, $mdDialog, $mdToast) {
    //      $scope.closeEUToast = function() {$mdToast.hide()}
    //    }
    //   });
    // };
    // $scope.selectedTabNumber =  {
    //   inputTab: 0
    // };
    // $scope.viewEditProfile = false;
    // $scope.viewEditUsers = false;
    // $scope.editProfile = function(number) {
    //   $scope.selectedTabNumber.inputTab = number;
    //   $scope.viewEditProfile = true;
    //   $scope.onTabSelected(number);
    // };
    // $scope.closeEditProfile = function() {
    //   $scope.viewEditProfile = false;
    //   $scope.selectedTabNumber.inputTab = 0;
    // };
    // $scope.onTabSelected = function(number) {
    //   $scope.selectedTabNumber.inputTab = number;
    // };
    // $scope.$watch('selectedTabNumber.inputTab', function(current, old) {});
    $scope.editUsers = function(number) {
      $scope.viewEditUsers = true;
      commonFnSrvc.appDemo1GetMobileCarriers($scope);
      commonFnSrvc.appDemo1GetRoles($scope);
    };
    $scope.closeEditUsers = function() {$scope.viewEditUsers = false;};


});
