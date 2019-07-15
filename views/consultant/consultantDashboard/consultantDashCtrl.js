app.controller('consultantDashCtrl', function($rootScope, $scope, $state, $stateParams, apiSrvc, commonFnSrvc, NgTableParams, Upload, upload, $filter, blockUI, $http, $mdDialog, textAngularManager, $document, $mdToast, $timeout, $location, authSrvc, envSrvc, config) {
  'use strict';

  $scope.openCSN = false;

  $scope.dashboardInit = function() {
    $scope.appDemo1GetUserNotifications();
    $scope.appDemo1GetPublicProjects();
    $scope.getPaymentInformation();
    if($stateParams.signUpLocation) {
      if($stateParams.signUpLocation === 1) {
        fbq('track', 'CompleteRegistration');
      }
      else if($stateParams.signUpLocation === 2) {
        gtag('event', 'conversion', {'send_to': 'AW-781276399/B1sbCJOo248BEO-pxfQC'});
      }
    }
  };
  $scope.initReferences = function() {
    if ($state.current.name === 'consultant.myProfile') {
      blockUI.start();
      blockUI.done(function() {
        $(".consultantRating").rating({displayOnly: true, step: 0.5});
        $('.consultantRating').rating('update', $scope.consultantInfo.averageReview);
      });
      $timeout(function() {
        blockUI.stop();
      }, 2000);
    }
  };
  $scope.appDemo1ProcessLogout = function() {
    apiSrvc.getData('appDemo1ProcessLogout').then(function(response){
      $state.go('signIn');
    });
  };
  $scope.appDemo1GetMobileCarriers = function() {
    apiSrvc.getData('appDemo1GetMobileCarriers').then(function(response){
      $scope.mobileCarriers = response.data;
    });
  };
  $scope.getStates = function() {
    if(!$scope.statesList) {
      apiSrvc.getData('appDemo1GetStates').then(function(response){
        $scope.statesList = response.data;
      });
    }
  };
  $scope.getCountries = function() {
    apiSrvc.getData('appDemo1GetCountries').then(function(response){
      $scope.countryList = response.data;
    });
  };
  $scope.appDemo1GetCategories = function() {
    apiSrvc.getData('appDemo1GetCategories').then(function(response){
      $scope.categoryList = response.data;
    });
  };
  $scope.appDemo1GetAvailabilities = function() {
    apiSrvc.getData('appDemo1GetAvailabilities').then(function(response){
      $scope.availabilities = response.data;
      if(!$scope.consultantInfo.availability.name) {
        $scope.consultantInfo.availability = response.data[1];
      }
    });
  };
  $scope.appDemo1GetWillingnessToTravel = function() {
    apiSrvc.getData('appDemo1GetWillingnessToTravel').then(function(response){
      $scope.travelOptions = response.data;
      if(!$scope.consultantInfo.willingToTravel.name) {
        $scope.consultantInfo.willingToTravel = response.data[0];
      }
    });
  };
  $scope.appDemo1GetSecurityClearances = function() {
    apiSrvc.getData('appDemo1GetSecurityClearances').then(function(response){
      $scope.securityClearances = response.data;
      if(!$scope.consultantInfo.securityClearance.name) {
        $scope.consultantInfo.securityClearance = response.data[0];
      }
    });
  };
  $scope.appDemo1GetAgencies = function() {
    apiSrvc.getData('appDemo1GetAgencies').then(function(response){
      $scope.agencies = response.data;
    });
  };
  $scope.appDemo1GetConsultantProfileAgencies = function(gpKey) {
    apiSrvc.getData('appDemo1GetConsultantProfileAgencies&gpKey='+gpKey).then(function(response){
      $scope.consultantProfileAgencies = response.data;
    });
  };
  $scope.appDemo1GetUserCertifications = function() {
    apiSrvc.getData('appDemo1GetUserCertifications').then(function(response){
      $scope.userCertifications = response.data;
    });
  };

  //************************* Interested Opportunities *****************************//
  $scope.appDemo1GetPublicProjects = function() {
    apiSrvc.getData('appDemo1GetPublicProjects').then(function(response){
      $scope.publicProjects = response.data;
      $scope.ppNumber = response.data.length;
    });
  };
  $scope.appDemo1GetYearsOfExperience = function() {
    apiSrvc.getData('appDemo1GetYearsProfessionalExperience').then(function(response){
      $scope.yearsOfExperience = response.data;
    });
  };
  $scope.appDemo1GetConsultantRatings = function(gpKey) {
    apiSrvc.getData('appDemo1GetConsultantRatings&gpKey='+gpKey).then(function(response){
      $scope.consultantRatings = response.data;
    });
  };

  //*********************************** AGENCIES  **********************************//
  $scope.getAgenciesForAutoComplete = function(agency) {
      var agencyResult = [];
      angular.forEach($scope.consultantProfileAgencies, function(item){
        var lcAcronym = angular.lowercase(item.acronymn);
        var lcItem = angular.lowercase(item.name);
        var lcAgency = angular.lowercase(agency);
        if((lcItem.search(lcAgency) >= 0) && (!item.selected) ) {
            agencyResult.push(item);
        }
        if((lcAcronym.search(lcAgency) >= 0) && (!item.selected) ) {
            agencyResult.push(item);
        }
      });
      return agencyResult;
    };
  $scope.addAgency = function(agency) {
    angular.forEach($scope.consultantProfileAgencies, function(item){
      if(agency) {
        if(item.gpKey == agency.gpKey) {
            item.selected = true;
            $scope.agenciesFilterArray.push(item);
        }
      }
    });
  };
  $scope.removeAgency = function(index, agency) {
    $scope.agency = agency;
    $scope.agency.selected = false;
    $scope.agenciesFilterArray.splice(index, 1);
  };
  $scope.saveConsultantAgencies = function(consultantInfo, close) {
    var objectToPost = angular.toJson($scope.agenciesFilterArray);
    var agenciesArray = angular.fromJson(objectToPost);
    consultantInfo = {
      gpKey: consultantInfo.gpKey,
      agencies: agenciesArray
    }

    for (var i = $scope.consultantContractsEditList.length - 1; i >= 0; i--) {
        if (!$scope.consultantContractsEditList[i].name) {
            $scope.consultantContractsEditList.splice(i, 1);
        }
    }

    var contractsToPost = angular.toJson($scope.consultantContractsEditList);
    var contractsArray = angular.fromJson(contractsToPost);
    var contractInfo = {
      gpKey: consultantInfo.gpKey,
      contracts: contractsArray
    }

    upload({
        url: __env.apiUrl+'/index.asp?remotemethodaddon=appDemo1SetConsultantProfileAgencies&RequestBinary=true',
        method: 'POST',
        data : {
          jsonData : JSON.stringify(consultantInfo)
        }
      }).then(function(response) {

        $scope.consultantAgencies = response.data.data.agencies;
      });
      upload({
          url: __env.apiUrl+'/index.asp?remotemethodaddon=appDemo1SetConsultantProfileContracts&RequestBinary=true',
          method: 'POST',
          data : {
            jsonData : JSON.stringify(contractInfo)
          }
        }).then(function(response) {

          $scope.consultantContracts = response.data.data.contracts;
          $scope.showConsultantEditAgencyFields = close;
        });

  };

  //*********************************** CERTIFICATIONS  **********************************//
  $scope.getCertificationsForAutoComplete = function(certification) {
      var certificationResult = [];
      angular.forEach($scope.userCertifications, function(item){
        var lcItem = angular.lowercase(item.name);
        var lcCertification = angular.lowercase(certification);
        if((lcItem.search(lcCertification) >= 0) && (!item.selected) ) {
            certificationResult.push(item);
        }
      });
      return certificationResult;
    };
  $scope.addCertification = function(certification) {
    angular.forEach($scope.userCertifications, function(item){
      if(certification) {
        if(item.gpKey == certification.gpKey) {
            item.selected = true;
        }
      }
    });
  };
  $scope.removeCertification = function(index, certification, consultantInfo) {
    $scope.certification = certification;
    $scope.certification.selected = false;
    $scope.certificationFilterArray.splice(index, 1);
    var objectToPost = angular.toJson($scope.certificationFilterArray);
    var certificationArray = angular.fromJson(objectToPost);
    consultantInfo = {
      gpKey: consultantInfo.gpKey,
      certifications: certificationArray
    }
    upload({
        url: __env.apiUrl+'/index.asp?remotemethodaddon=appDemo1SetConsultantProfileCertifications&RequestBinary=true',
        method: 'POST',
        data : {
          jsonData : JSON.stringify(consultantInfo)
        }
      }).then(function(response) {
      });

  };
  $scope.saveConsultantCertifications = function(consultantInfo) {
    var objectToPost = angular.toJson($scope.certificationFilterArray);
    var certificationArray = angular.fromJson(objectToPost);
    consultantInfo = {
      gpKey: consultantInfo.gpKey,
      certifications: certificationArray
    }
    upload({
        url: __env.apiUrl+'/index.asp?remotemethodaddon=appDemo1SetConsultantProfileCertifications&RequestBinary=true',
        method: 'POST',
        data : {
          jsonData : JSON.stringify(consultantInfo)
        }
      }).then(function(response) {});

  };

  //**********************************************************************************************************//
  //*********************************************** MY PROFILE ***********************************************//
  //**********************************************************************************************************//
  $rootScope.appDemo1GetConsultantInformation = function(gpKey) {
    apiSrvc.getData('appDemo1GetConsultantInformation&gpKey='+gpKey).then(function(response) {
      $scope.appDemo1GetConsultantRatings(gpKey);
      var responseCopy = angular.copy(response);
      $scope.consultantInfo = response.data;
      var starValue = response.data.averageReview;
      $scope.consultantSkills = response.data.skills;
      $scope.consultantSkillsEditList = angular.copy($scope.consultantSkills);
      $scope.consultantCategories = response.data.categories;
      $scope.consultantCategoriesEditList = angular.copy($scope.consultantCategories);
      $scope.consultantAgencies = response.data.agencies;
      $scope.consultantAgenciesEditList = angular.copy($scope.consultantAgencies);
      $scope.consultantContracts = response.data.contracts;
      $scope.consultantContractsEditList = angular.copy($scope.consultantContracts);
      $scope.consultantCertifications = response.data.certifications;
      $scope.consultantReferences = response.data.references;
      $scope.agenciesFilterArray = angular.copy($scope.consultantAgencies);

      angular.forEach($scope.consultantAgenciesEditList, function(item){
          item.selected = true;
          $scope.agenciesFilterArray = $scope.consultantAgenciesEditList;
      });
      $scope.certificationFilterArray = $scope.consultantCertifications;
      $(".consultantRating").rating({displayOnly: true, step: 0.5});
      $('.consultantRating').rating('update', $scope.consultantInfo.averageReview);
    })
  };

  //********************* Edit Consultant Contact Info Fields ************************//
  $scope.showConsultantContactInfoEditFields = false;
  $scope.cancelEditConsultantContactInfo = function() {
    $scope.showConsultantContactInfoEditFields = false;
  };
  $scope.editConsultantContactInfo = function(consultantInfo) {
    $scope.consultantInfoEditField =  angular.copy(consultantInfo);
    $(".consultantRating").rating({displayOnly: true, step: 0.5});
    $scope.appDemo1GetMobileCarriers();
    $scope.appDemo1GetYearsOfExperience();
    $scope.getStates();
    $scope.getCountries();
    $scope.showConsultantContactInfoEditFields = true;
  };
  $scope.getStatesByCountry = function(country) {
    $scope.displayUSStates = false;
    if(country.id === 235) {
      $scope.displayUSStates = true;
    }
    else {
      $scope.consultantInfo.state = {};
    }
  };
  $scope.$watch("consultantInfo.mobilePhone",function(newVal){
    if(newVal=="")
      $scope.consultantInfo.mobileCarrier={};
  });
  $scope.saveConsultantContactInfo = function(consultantContactInfo, profilePhoto, close) {
    var objectToPost = angular.toJson(consultantContactInfo);
    var consultantContactInfo = angular.fromJson(objectToPost);
    var consultantInfo = {
      gpKey: consultantContactInfo.gpKey,
      firstName: consultantContactInfo.firstName,
      lastName: consultantContactInfo.lastName,
      title: consultantContactInfo.title,
      company: consultantContactInfo.company,
      address: consultantContactInfo.address,
      address2: consultantContactInfo.address2,
      allowTextNotifications: consultantContactInfo.allowTextNotifications,
      city: consultantContactInfo.city,
      state: consultantContactInfo.state,
      zip: consultantContactInfo.zip,
      country: consultantContactInfo.country,
      email: consultantContactInfo.email,
      phone: consultantContactInfo.phone,
      mobilePhone: consultantContactInfo.mobilePhone,
      mobileCarrier: consultantContactInfo.mobileCarrier,
      profileNamePrivate: consultantContactInfo.profileNamePrivate,
      consultantDescription: consultantContactInfo.consultantDescription,
      yearsProfessionalExperience: consultantContactInfo.yearsProfessionalExperience
    }

    if(profilePhoto.name) {
      upload({
          url: __env.apiUrl+'/index.asp?remotemethodaddon=appDemo1SetConsultantProfileContactInfo&RequestBinary=true',
          method: 'POST',
          data : {
            jsonData : JSON.stringify(consultantInfo),
            imageFilename: profilePhoto
          }
        }).then(function(response) {

          if(response.data.errors.length > 0) {
            $scope.toastErrorMsg = response.data.errors[0].userMsg
            $mdToast.show({
              hideDelay   : 3000,
              position    : 'top',
              parent : $document[0].querySelector('#consultantContactInfoFields'),
              scope:$scope,
              preserveScope:true,
              controller  : editPersonalContactInfoCtrl,
              template :  '<md-toast><div class="md-toast-text flex">Cannot save. {{toastErrorMsg}}</div></md-toast>'
            });
             function editPersonalContactInfoCtrl($scope, $rootScope, apiSrvc, commonFnSrvc, $mdDialog, $mdToast) {
             }
          }
          else {
            $mdToast.show({
              hideDelay   : 3000,
              position    : 'top',
              parent : $document[0].querySelector('#consultantContactInfoFields'),
              scope:$scope,
              preserveScope:true,
              controller  : editSkillsToastCtrl,
              template :  '<md-toast class="md-warning-toast-theme"><div class="md-toast-text flex">Your Contact Info has been saved!</div></md-toast>'
            });
             function editSkillsToastCtrl($scope, $rootScope, apiSrvc, commonFnSrvc, $mdDialog, $mdToast) {
             }
             $scope.consultantInfo = response.data.data;
             $scope.userInfo.ImageFilename = response.data.data.imageFilename;
             $scope.showConsultantContactInfoEditFields = close;
          }

        });
    }
    else {
      upload({
          url: __env.apiUrl+'/index.asp?remotemethodaddon=appDemo1SetConsultantProfileContactInfo&RequestBinary=true',
          method: 'POST',
          data : {
            jsonData : JSON.stringify(consultantInfo)
          }
        }).then(function(response) {

          if(response.data.errors.length > 0) {
            $scope.toastErrorMsg = response.data.errors[0].userMsg
            $mdToast.show({
              hideDelay   : 3000,
              position    : 'top',
              parent : $document[0].querySelector('#consultantContactInfoFields'),
              scope:$scope,
              preserveScope:true,
              controller  : editPersonalContactInfoCtrl,
              template :  '<md-toast class="md-warning-toast-theme"><div class="md-toast-text flex">Cannot save. {{toastErrorMsg}}</div></md-toast>'
            });
             function editPersonalContactInfoCtrl($scope, $rootScope, apiSrvc, commonFnSrvc, $mdDialog, $mdToast) {
             }
          }
          else {
          $mdToast.show({
            hideDelay   : 3000,
            position    : 'top',
            parent : $document[0].querySelector('#consultantContactInfoFields'),
            scope:$scope,
            preserveScope:true,
            controller  : editSkillsToastCtrl,
            template :  '<md-toast><div class="md-toast-text flex">Your Contact Info has been saved!</div><div class="md-toast-text "></md-toast>'
          });
           function editSkillsToastCtrl($scope, $rootScope, apiSrvc, commonFnSrvc, $mdDialog, $mdToast) {
           }
           $scope.consultantInfo = response.data.data;
           $scope.showConsultantContactInfoEditFields = close;
          }
        });
    }
  };
  $scope.maxCharacters = function(e, text) {
    var max = 500;
    if (text.length == max) {
        e.preventDefault();
        $mdToast.show({
          hideDelay   : 1000,
          position    : 'top',
          parent : $document[0].querySelector('#consultantDescription'),
          scope:$scope,
          preserveScope:true,
          controller  : maxCharToastCtrl,
          template :  '<md-toast><div class="md-toast-text flex">Maximum Characters Reached</div></md-toast>'
        });
         function maxCharToastCtrl($scope, $rootScope, apiSrvc, commonFnSrvc, $mdDialog, $mdToast) {
         }
    }
  };

  //********************* Edit Consultant CATEGORY, SKILLS, and RESUME Fields ************************//
  $scope.showConsultantResumeEditFields = false;
  $scope.cancelEditConsultantResume = function() {
    $scope.showConsultantResumeEditFields = false;
  };
  $scope.editConsultantResume = function(consultantInfo) {
    $scope.consultantInfoEditField =  angular.copy(consultantInfo);
    $scope.showConsultantResumeEditFields = true;
  };
  $scope.showConsultantSkillsEditFields = false;
  $scope.cancelEditConsultantSkills = function() {
    $scope.showConsultantSkillsEditFields = false;
  };
  $scope.editConsultantSkills = function(consultantInfo) {
    $scope.consultantInfoEditField =  angular.copy(consultantInfo);
    $scope.appDemo1GetCategories();
    $scope.showConsultantSkillsEditFields = true;
  };
  $scope.resumeFile = {};
  $scope.removeResumeFile = function(resumeFile) {
    $scope.resumeFile = {};
  };
  $scope.saveConsultantResume = function(consultantInfo, consultantResume, close) {
    if(consultantResume) {
      upload({
          url: __env.apiUrl+'/index.asp?remotemethodaddon=appDemo1SetConsultantProfileCategorySkills&RequestBinary=true',
          method: 'POST',
          data : {
            jsonData : JSON.stringify(consultantInfo),
            consultantResume: consultantResume
          }
        }).then(function(response) {
          if(response.data.errors.length > 0) {

          }
          else {
            $scope.consultantInfo.consultantResumeFilename = response.data.data.consultantResumeFilename;
            $scope.consultantInfo.consultantResumeUrl = response.data.data.consultantResumeUrl;
            $mdToast.show({
              hideDelay   : 3000,
              position    : 'top',
              parent : $document[0].querySelector('#consultantResumeFields'),
              scope:$scope,
              preserveScope:true,
              controller  : editSkillsToastCtrl,
              template :  '<md-toast><div class="md-toast-text flex">Your Resume has been saved!</div><div class="md-toast-text "></md-toast>'
            });
             function editSkillsToastCtrl($scope, $rootScope, apiSrvc, commonFnSrvc, $mdDialog, $mdToast) {
             }
          $scope.showConsultantResumeEditFields = close;
          }
        });
    }
    else if(consultantInfo.consultantResumeUrl){
      $scope.showConsultantResumeEditFields = close;
    }
    else {
      $scope.showConsultantResumeEditFields = close;
    }
  };
  $scope.saveConsultantSkills = function(consultantInfo, consultantSkills, consultantCategories, close) {
    var blankField = false;
    $scope.isBlankField = false;
    angular.forEach(consultantSkills, function(item, key) {
      if(item.skillName == '' || item.skillName === undefined) {
        blankField = true;
        $scope.isBlankField = true;
      }
    })
    if(!blankField){
      consultantInfo = {
        gpKey: consultantInfo.gpKey,
        categories: consultantCategories,
        skills: consultantSkills
      }
    var objectToPost = angular.toJson(consultantInfo);
    var consultantInfo = angular.fromJson(objectToPost);
    upload({
        url: __env.apiUrl+'/index.asp?remotemethodaddon=appDemo1SetConsultantProfileCategorySkills&RequestBinary=true',
        method: 'POST',
        data : {
          jsonData : JSON.stringify(consultantInfo)
        }
      }).then(function(response) {

        if(response.data.errors.length > 0) {

        }
        else {
          $scope.consultantInfo = response.data.data;
          $scope.consultantSkills = response.data.data.skills;
          $scope.consultantCategories = response.data.data.categories;
          $mdToast.show({
            hideDelay   : 3000,
            position    : 'top',
            parent : $document[0].querySelector('#consultantSkillsFields'),
            scope:$scope,
            preserveScope:true,
            controller  : editSkillsToastCtrl,
            template :  '<md-toast><div class="md-toast-text flex">Your Categories & Skills have been saved!</div><div class="md-toast-text "></md-toast>'
          });
           function editSkillsToastCtrl($scope, $rootScope, apiSrvc, commonFnSrvc, $mdDialog, $mdToast) {
           }
           $scope.showConsultantSkillsEditFields = close;
        }
      });
    }
  };
  $scope.addConsultantSkill = function() {
    var skill = {skillName: "", gpKey: ""}
    $scope.consultantSkillsEditList.push(skill);
  };
  $scope.removeConsultantSkill = function(index, skill) {
    $scope.consultantSkillsEditList.splice(index, 1);
  };
  $scope.showSubCategory = false;
  $scope.categorySelected = function(category) {
    $scope.showSubCategory = true;
    $scope.showErrorMsg = false;
    $scope.subCategories = category.subCategories;
  };
  $scope.addSubCategory = function(subCategory) {
    var duplicateSubCategories = false;
    $scope.showErrorMsg = false;
    angular.forEach($scope.consultantCategoriesEditList, function(item, key) {
      if(item.gpKey === subCategory.gpKey) {
        duplicateSubCategories = true;
        $scope.showErrorMsg = true;
      }
    })
    if(!duplicateSubCategories) {
      $scope.consultantCategoriesEditList.push(subCategory);
      $scope.showErrorMsg = false;
    }
  };
  $scope.removeConsultantCategory = function(index, category) {
    $scope.consultantCategoriesEditList.splice(index, 1);
  };

  //********************* Edit Consultant Rate and Availability Fields ************************//
  $scope.showConsultantRateAvailabilityEditFields = false;
  $scope.cancelEditRateAvailability = function() {
    $scope.showConsultantRateAvailabilityEditFields = false;
  };
  $scope.editRateAvailability = function(consultantInfo) {
    $scope.consultantInfoEditField =  angular.copy(consultantInfo);
    $scope.appDemo1GetAvailabilities();
    $scope.appDemo1GetWillingnessToTravel();
    $scope.showConsultantRateAvailabilityEditFields = true;
  };
  $scope.notAvailableForFreelance = function(available) {
    if(!available) {
      $scope.consultantInfoEditField.availability = {};
      $scope.consultantInfoEditField.freelanceHourlyRate = 0;
      $scope.consultantInfoEditField.amountMinimumProjectSize = 0;
    }
  };
  $scope.notAvailableFullTime = function(available) {
    if(!available) {
      $scope.consultantInfoEditField.fullTimeAnnualSalary = 0;
      $scope.consultantInfoEditField.availableAsFreelance = true;
    }
  };
  $scope.saveRateAvailability = function(consultantInfo, close) {
    if(consultantInfo.freelanceHourlyRate > 0) {
        var params = {
        gpKey: consultantInfo.gpKey,
        availableAsFreelance: consultantInfo.availableAsFreelance,
        freelanceHourlyRate: consultantInfo.freelanceHourlyRate,
        adviser: consultantInfo.adviser,
        amountMinimumProjectSize: consultantInfo.amountMinimumProjectSize,
        availability: consultantInfo.availability,
        availableAsFullTime: consultantInfo.availableAsFullTime,
        fullTimeAnnualSalary: consultantInfo.fullTimeAnnualSalary,
        willingToTravel: consultantInfo.willingToTravel,
        willingToTravelException: consultantInfo.willingToTravelException
      }
      apiSrvc.sendPostData('appDemo1SetConsultantProfileRateAvailability', params).then(function(response) {
        //Global Toast
        if(response.errors.length > 0) {
          var parentLocation = '#consultantEditRateAvailabilityFields';
          var message = '<div class="md-toast-text flex">The server has encountered an error.</div>';
          function toastFunction() {
            $state.reload();
          };
          commonFnSrvc.errorFunction(parentLocation, message, toastFunction);
        }
        else {
          $scope.consultantInfo = response.data;
          $scope.showConsultantRateAvailabilityEditFields = close;
          $mdToast.show({
            hideDelay   : 3000,
            position    : 'top',
            parent : $document[0].querySelector('#consultantEditRateAvailabilityFields'),
            scope:$scope,
            preserveScope:true,
            controller  : editRAToastCtrl,
            template :  '<md-toast><div class="md-toast-text flex">Your Rates & Availabilities have been saved!</div></md-toast>'
          });
          function editRAToastCtrl($scope, $rootScope, apiSrvc, commonFnSrvc, $mdDialog, $mdToast) {
          }
        }

      })
    }
    else {
      $mdToast.show({
        hideDelay   : false,
        position    : 'top',
        parent : $document[0].querySelector('#consultantEditRateAvailabilityFields'),
        scope:$scope,
        preserveScope:true,
        controller  : errorRateToast,
        template :  '<md-toast><div class="md-toast-text flex">Your hourly rate cannot be 0 or blank</div><div class="md-toast-text "><md-button class="md-highlight" ng-click="closeErrorRateToast()">Okay</md-button></div></md-toast>'
      });
       function errorRateToast($scope, $rootScope, apiSrvc, commonFnSrvc, $mdDialog, $mdToast) {
         $scope.closeErrorRateToast = function() {$mdToast.hide();}
       }
    }
  };

  //********************* Edit Clearance Level ************************//
  $scope.showConsultantEditClearancesFields = false;
  $scope.cancelEditClearanceLevel = function() {
    $scope.showConsultantEditClearancesFields = false;
  };
  $scope.editClearanceLevel = function(consultantInfo) {
    $scope.consultantInfoEditField =  angular.copy(consultantInfo);
    $scope.appDemo1GetSecurityClearances();
    $scope.showConsultantEditClearancesFields = true;
  };
  $scope.saveClearanceLevel = function(securityClearance, gpKey, close) {
    var params = {
      gpKey: gpKey,
      securityClearance: securityClearance
    }
    apiSrvc.sendPostData('appDemo1SetConsultantProfileClearance', params).then(function(response) {
      $scope.consultantInfo = response.data;
      $scope.showConsultantEditClearancesFields = close;
      $mdToast.show({
        hideDelay   : 3000,
        position    : 'bottom',
        parent : $document[0].querySelector('#consultantEditClearances'),
        scope:$scope,
        preserveScope:true,
        controller  : editClearanceToastCtrl,
        template :  '<md-toast><div class="md-toast-text flex">Your Clearance Level has been saved!</div><div class="md-toast-text "></md-toast>'
      });
     function editClearanceToastCtrl($scope, $rootScope, apiSrvc, commonFnSrvc, $mdDialog, $mdToast) {
       $scope.closeEditClearanceToast = function() {$mdToast.hide()}
     }
    })
  };

  //********************* Edit Agencies ************************//
  $scope.showConsultantEditAgencyFields = false;
  $scope.cancelEditAgencies = function() {
    $scope.showConsultantEditAgencyFields = false;
  };
  $scope.editAgencies = function(consultantInfo) {
    $scope.consultantInfoEditField =  angular.copy(consultantInfo);
    var gpKey = $scope.consultantInfoEditField.gpKey;
    $scope.appDemo1GetConsultantProfileAgencies(gpKey);
    $scope.showConsultantEditAgencyFields = true;
  };

  //********************* Edit Contracts ************************//
  $scope.addConsultantContract = function() {
    var contract = {name: "", gpKey: ""}
    $scope.consultantContractsEditList.push(contract);
  }
  $scope.removeConsultantContract = function(index, contract) {
    $scope.consultantContractsEditList.splice(index, 1);
  }

  //********************* Edit References and Certifications ************************//
  $scope.showConsultantEditReferencesAndCertificationsFields = false;
  $scope.editReferencesAndCertifications = function() {
    $scope.appDemo1GetUserCertifications();
    $scope.showConsultantEditReferencesAndCertificationsFields = true;
  }
  $scope.cancelEditReferencesAndCertifications = function() {
    $scope.showConsultantEditReferencesAndCertificationsFields = false;
  }

  ////////////////////// REFERENCES /////////////////////
  $scope.reference = {};
  $scope.addConsultantReference = function(reference, consultantInfo) {

    if(!reference.email || !reference.firstName || !reference.lastName) {
      $mdToast.show({
        hideDelay   : 3000,
        position    : 'top',
        parent : $document[0].querySelector('#consultantEditReferencesAndCertifications'),
        scope:$scope,
        preserveScope:true,
        controller  : errorEmailToastCtrl ,
        template :  '<md-toast class="md-danger-toast-theme"><div class="md-toast-text flex">Please fill out all required fields</div><div class="md-toast-text "></md-toast>'
      });
       function errorEmailToastCtrl ($scope, $rootScope, apiSrvc, commonFnSrvc, $mdDialog, $mdToast) {
       }
    }

    else {
      var objectToPost = angular.toJson(reference);
      var reference = angular.fromJson(objectToPost);
      var referenceObject = {
        gpKey: consultantInfo.gpKey,
        firstName: reference.firstName,
        lastName: reference.lastName,
        email: reference.email,
        phone: reference.phone,
        company: reference.company,
        sendEmailRequest: reference.sendEmailRequest
      }
      upload({
          url: __env.apiUrl+'/index.asp?remotemethodaddon=appDemo1SetConsultantProfileReferences&RequestBinary=true',
          method: 'POST',
          data : {
            jsonData : JSON.stringify(referenceObject)
          }
        }).then(function(response) {
          if(response.data.errors.length > 0) {
          }
          else {
              $scope.reference = {};
            $mdToast.show({
              hideDelay   : 3000,
              position    : 'top',
              parent : $document[0].querySelector('#consultantEditReferencesAndCertifications'),
              scope:$scope,
              preserveScope:true,
              controller  : editRCToastCtrl,
              template :  '<md-toast><div class="md-toast-text flex">Your reference has been sent an email to the email you provided</div><div class="md-toast-text "></md-toast>'
            });
             function editRCToastCtrl($scope, $rootScope, apiSrvc, commonFnSrvc, $mdDialog, $mdToast) {
             }
             $scope.consultantReferences = response.data.data.references;
          }
        });
    }


  };
  $scope.referenceRatingNumber = '';
  $scope.toggleRatingTypes = function() {
    if($scope.referenceRatingNumber == 2) {
      $scope.referenceRatingNumber = '';
    }
    else if($scope.referenceRatingNumber == '') {
      $scope.referenceRatingNumber = 2;
    }

  };

  ////////////////////// CERTIFICATIONS /////////////////////
  $scope.searchCertificationText = {};
  $scope.addConsultantCertification  = function(selectedCertificationItem, searchCertificationText, certification, consultantInfo) {
    if(!certification) {
      certification = {};
    }
    if(!certification.license) {
      certification.license = '';
    }
    if(!certification.authority) {
      certification.authority = '';
    }
    if(!certification.url) {
      certification.url = '';
    }

    if(selectedCertificationItem) {
      var existingCertification = {
        certificationName:selectedCertificationItem.name,
        certificationNumber:certification.license,
        certificationAuthority:certification.authority,
        certificationUrl:certification.url,
        certificationGpKey:selectedCertificationItem.gpKey,
        gpKey:""
      }
      $scope.certificationFilterArray.push(existingCertification);

      var objectToPost = angular.toJson($scope.certificationFilterArray);
      var certificationArray = angular.fromJson(objectToPost);
      consultantInfo = {
        gpKey: consultantInfo.gpKey,
        certifications: certificationArray
      }
      upload({
          url: __env.apiUrl+'/index.asp?remotemethodaddon=appDemo1SetConsultantProfileCertifications&RequestBinary=true',
          method: 'POST',
          data : {
            jsonData : JSON.stringify(consultantInfo)
          }
        }).then(function(response) {

          if(response.data.errors.length > 0) {
          }
          else {
            $mdToast.show({
              hideDelay   : 3000,
              position    : 'top',
              parent : $document[0].querySelector('#gp-consultantList'),
              scope:$scope,
              preserveScope:true,
              controller  : editCertoastCtrl,
              template :  '<md-toast><div class="md-toast-text flex">Your certification has been added successfully!</div><div class="md-toast-text "></md-toast>'
            });
             function editCertoastCtrl($scope, $rootScope, apiSrvc, commonFnSrvc, $mdDialog, $mdToast) {
             }

             $scope.searchCertificationText.searchText = '';
             $scope.certification = {};
          }
        });
    }
    else if(!selectedCertificationItem && searchCertificationText){
      var newCertification = {
        certificationName:searchCertificationText,
        certificationNumber:certification.license,
        certificationAuthority:certification.authority,
        certificationUrl:certification.url,
        certificationGpKey:"",
        gpKey:""
      }
      $scope.certificationFilterArray.push(newCertification);
      consultantInfo.certifications = $scope.certificationFilterArray;
      var objectToPost = angular.toJson($scope.certificationFilterArray);
      var certificationArray = angular.fromJson(objectToPost);
      consultantInfo = {
        gpKey: consultantInfo.gpKey,
        certifications: certificationArray
      }
      upload({
          url: __env.apiUrl+'/index.asp?remotemethodaddon=appDemo1SetConsultantProfileCertifications&RequestBinary=true',
          method: 'POST',
          data : {
            jsonData : JSON.stringify(consultantInfo)
          }
        }).then(function(response) {
          if(response.data.errors.length > 0) {
          }
          else {
            $mdToast.show({
              hideDelay   : 3000,
              position    : 'top',
              parent : $document[0].querySelector('#gp-consultantList'),
              scope:$scope,
              preserveScope:true,
              controller  : editCertifoastCtrl,
              template :  '<md-toast><div class="md-toast-text flex">Your certification has been added successfully!</div><div class="md-toast-text "></md-toast>'
            });
             function editCertifoastCtrl($scope, $rootScope, apiSrvc, commonFnSrvc, $mdDialog, $mdToast) {
             }
             selectedCertificationItem = null;
             searchCertificationText = null;
             certification = {};
             $scope.searchCertificationText.searchText = '';
             $scope.certification = {};
          }
        });
      }
    };
  $scope.saveReferencesAndCertifications = function() {

  };

  /*********************************************************************************************************/
  /***************************************** CONSULTANT PAYMENT INFO ***************************************/
  /*********************************************************************************************************/
  $scope.accountTypes = [
    {id: 1, name: 'Personal Checking'},
    {id: 2, name: 'Business'}
  ];

  $scope.getPaymentInformation = function() {
    $scope.dobMaxDate = new Date();
    $scope.dobMinDate = new Date(
        $scope.dobMaxDate.getFullYear() - 100,
        $scope.dobMaxDate.getMonth(),
        $scope.dobMaxDate.getDate()
      );
      $scope.identification = {}; //Needed for the id uploads. throws error if not defined previously
    apiSrvc.getData('appDemo1GetUserPaymentInformation')
    .then(function(response){
      if(response.data) {
        if(!response.data.LegalEntityVerificationStatus) {
          $rootScope.noStripeAccountOnRecord = true;
          $scope.editPaymentFields = false; //Not sure if this property is being used anymore
          $scope.paymentInfo = {};
          $scope.paymentInfo.consultantAccountType = 1;
          $scope.paymentInfo.idType = 1;
        }
        else {
            $rootScope.noStripeAccountOnRecord = false;
            $rootScope.stripeAccountVerified = true;
            $scope.editPaymentFields = false;
            $scope.paymentInfo = response.data;
            $scope.editablePaymentInfo = angular.copy(response.data);
            if(response.data.bankRoutingNumber) {
              $scope.editablePaymentInfo.bankRoutingNumber = $filter('mask')(response.data.bankRoutingNumber);
            }
            if(response.data.dob) {
              $scope.editablePaymentInfo.dob = $filter('dateConverter')(response.data.dob);
            }

            $scope.cityExists = true;
            $scope.addressExists = true;
            $scope.zipExists = true;
            $scope.stateExists = true;
            $scope.cityExists = true;
            $scope.lastNameExists = true;
            $scope.firstNameExists = true;
            $scope.ssnExists = true;
            $scope.taxIdExists = true;
            $scope.dobExists = true;
            $scope.personalIdExists = true;
            $scope.verificationDocumentExists = null;
            $scope.businessNameExists = true;
            $scope.bankAccountNumberExists = true;

            $scope.editablePaymentInfo.VerificationFieldsNeeded.forEach(function(value, index) {
              if(value === 'legal_entity.address.city') {$scope.cityExists = false; $scope.addressSectionIncomplete = true;}
              if(value === 'legal_entity.address.line1') {$scope.addressExists = false; $scope.addressSectionIncomplete = true;}
              if(value === 'legal_entity.address.postal_code') {$scope.zipExists = false; $scope.addressSectionIncomplete = true;}
              if(value === 'legal_entity.address.state') {$scope.stateExists = false; $scope.addressSectionIncomplete = true;}
              if(value === 'legal_entity.first_name') {$scope.firstNameExists = false; $scope.bankInfoSectionIncomplete = true;}
              if(value === 'legal_entity.last_name') {$scope.lastNameExists = false; $scope.bankInfoSectionIncomplete = true;}
              if(value === 'legal_entity.business_name') {$scope.businessNameExists = false; $scope.bankInfoSectionIncomplete = true;}
              if(value === 'legal_entity.ssn_last_4') {$scope.ssnExists = false; $scope.verificationInfoSectionIncomplete = true;}
              if(value === 'legal_entity.business_tax_id') {$scope.taxIdExists = false; $scope.verificationInfoSectionIncomplete = true;}
              if(value === 'legal_entity.dob.day') {$scope.dobExists = false; $scope.verificationInfoSectionIncomplete = true;}
              if(value === 'legal_entity.dob.month') {$scope.dobExists = false; $scope.verificationInfoSectionIncomplete = true;}
              if(value === 'legal_entity.dob.year') {$scope.dobExists = false; $scope.verificationInfoSectionIncomplete = true;}
              if(value === 'legal_entity.personal_id_number') {$scope.personalIdExists = false; $scope.verificationInfoSectionIncomplete = true;}
              if(value === 'legal_entity.verification.document') {$scope.verificationDocumentExists = false; $scope.verificationDocsSectionIncomplete = true;}
              if(value === 'external_account') {$scope.bankAccountNumberExists = false; $scope.bankInfoSectionIncomplete = true;}
            })


            if($scope.verificationDocsSectionIncomplete) {
              //documents are unverified
              if(response.data.LegalEntityExistDocumentBack) {
                //License
                $scope.editablePaymentInfo.idType = 2;
                $scope.hidePassportOption = true;
              }
              else if(response.data.LegalEntityExistDocument && !response.data.LegalEntityExistDocumentBack) {
                //Passport
                $scope.editablePaymentInfo.idType = 1;
                $scope.hideLicenseOption = true;
              }
              else {
                //neither (required but missing)
                $scope.editablePaymentInfo.idType = null;
                $scope.hideLicenseOption = false;
                $scope.hidePassportOption = false;
              }
            }
            else {
              //documents are either verified or not Required
              if(response.data.LegalEntityExistDocument) {
                //a document has been uploaded
                $scope.documentIsVerified = true; //I'm not sure if this is the case
              }
            }

        }
        $scope.getStates();
      }
    })
  };

  $scope.paymentFormSubmitted = false;
  $scope.formHasError = false;
  // For deselecting radios
  $scope.undoSelect = function(radioModal) {
    radioModal.idType = null;
  };

  //Editing Bank Info
  $scope.appDemo1SetUserPaymentBank = function(paymentInfo, editConsultantStripeBankInfoForm, identification) {
    if(identification) {
      //User is uploading an image for their ID
      if(identification.front) {
        var idFront = identification.front;
      }
      if(identification.back) {
        var idBack = identification.back;
      }
    }
    if((paymentInfo.idType === 1) && !idFront) {
        $scope.showResponseError = true;
        $scope.errorMsg = 'Please upload a Passport Image';
    }
    else if((paymentInfo.idType === 2) && (!idFront || !idBack)) {
        $scope.showResponseError = true;
        $scope.errorMsg = "Please upload images of both the Front and the Back of your Driver's Liscence"  ;
    }
    else {
      $scope.paymentFormSubmitted = true;
      $scope.showResponseError = false;
      $scope.formHasError = false;

      var d = new Date(paymentInfo.dob);
      var day = d.getDay();
      var month = d.getMonth();
      var year = d.getFullYear();

      paymentInfo.VerificationFieldsNeeded.forEach(function(value, index) {
        if(value === 'legal_entity.address.city') {paymentInfo.VerificationFieldsNeeded[index] = {'legal_entity.address.city': paymentInfo.city}}
        if(value === 'legal_entity.address.line1') {paymentInfo.VerificationFieldsNeeded[index] = {'legal_entity.address.line1': paymentInfo.address} }
        if(value === 'legal_entity.address.postal_code') {paymentInfo.VerificationFieldsNeeded[index] = {'legal_entity.address.postal_code': paymentInfo.zip} }
        if(value === 'legal_entity.address.state') {paymentInfo.VerificationFieldsNeeded[index] = {'legal_entity.address.state': paymentInfo.state.name} }
        if(value === 'legal_entity.first_name') {paymentInfo.VerificationFieldsNeeded[index] = {'legal_entity.first_name': paymentInfo.accountHolderFirstName} }
        if(value === 'legal_entity.last_name') {paymentInfo.VerificationFieldsNeeded[index] = {'legal_entity.last_name': paymentInfo.accountHolderLastName} }
        if(value === 'legal_entity.business_name') {paymentInfo.VerificationFieldsNeeded[index] = {'legal_entity.business_name': paymentInfo.businessName} }
        if(value === 'legal_entity.ssn_last_4') {paymentInfo.VerificationFieldsNeeded[index] = {'legal_entity.ssn_last_4': paymentInfo.SSNLast4} }
        if(value === 'legal_entity.business_tax_id') {paymentInfo.VerificationFieldsNeeded[index] = {'legal_entity.business_tax_id': paymentInfo.identificationNumber} }
        if(value === 'legal_entity.dob.day') {paymentInfo.VerificationFieldsNeeded[index] = {'legal_entity.dob.day': day} }
        if(value === 'legal_entity.dob.month') {paymentInfo.VerificationFieldsNeeded[index] = {'legal_entity.dob.month': month} }
        if(value === 'legal_entity.dob.year') {paymentInfo.VerificationFieldsNeeded[index] = {'legal_entity.dob.year': year} }
        if(value === 'legal_entity.personal_id_number') {paymentInfo.VerificationFieldsNeeded[index] = {'legal_entity.personal_id_number': paymentInfo.identificationNumber} }
        if(value === 'legal_entity.verification.document') {paymentInfo.VerificationFieldsNeeded[index] = {'legal_entity.verification.document': ''} }
        if(value === 'external_account') {paymentInfo.VerificationFieldsNeeded[index] = {'external_account' : paymentInfo.bankRoutingNumber}}
      })

      if(editConsultantStripeBankInfoForm.$invalid) {
        $scope.formHasError = true;
        $scope.errorMsg = 'Please fill out all required fields in order to submit';
        $scope.showResponseError = true;
      }
      else if(editConsultantStripeBankInfoForm.$valid) {

        var objectToPost = {
            consultantAccountType: paymentInfo.consultantAccountType,
            accountHolderFirstName: paymentInfo.accountHolderFirstName,
            accountHolderLastName: paymentInfo.accountHolderLastName,
            address: paymentInfo.address,
            city: paymentInfo.city,
            state: paymentInfo.state,
            zip: paymentInfo.zip
        };
        if(paymentInfo.bankRoutingNumber.startsWith("X")) {
        }
        else {
          objectToPost.bankRoutingNumber = paymentInfo.bankRoutingNumber;
        }
        if(paymentInfo.bankAccountNumber) {
          objectToPost.bankAccountNumber = paymentInfo.bankAccountNumber;
        }
        if(paymentInfo.consultantAccountType === 2) {
          objectToPost.SSNLast4 = paymentInfo.SSNLast4;
          objectToPost.businessName = paymentInfo.businessName;
        }
        if($scope.dobIsNeeded) {
          objectToPost.dob = paymentInfo.dob;
        }

        var dataObject = {
          jsonData: JSON.stringify(objectToPost)
        }
        if(paymentInfo.VerificationFieldsNeeded.length > 0) {
          dataObject.verificationObj = JSON.stringify(paymentInfo.VerificationFieldsNeeded);
        }
        if(identification) {
          if(identification.front) {dataObject.IdentifyingDocument = identification.front;}
          if(identification.back) {dataObject.IdentifyingDocumentBack = identification.back;}
        }

        upload({
            url: __env.apiUrl+'/index.asp?remotemethodaddon=appDemo1SetUserPaymentBank&RequestBinary=true',
            method: 'POST',
            data : dataObject
          }).then(function(response) {
         if((response.status === 200) && (response.data.errors.length === 0)) {
           //SUCCESS!!
              $scope.paymentInfo = response.data.data;
              $scope.editPaymentFields = false;
              $rootScope.noStripeAccountOnRecord = false;

              $mdToast.show({
                hideDelay   : false,
                position    : 'bottom',
                parent : $document[0].querySelector('#toastMsg'),
                scope:$scope,
                preserveScope:true,
                controller  : successToasCtrl,
                template :  '<md-toast class="md-success-toast-theme"><div class="md-toast-text flex">Success!  Your info has been saved.</div><div class="md-toast-text"><md-button ng-click="closeToast()">Ok</md-button></md-toast>'
              });
               function successToasCtrl($scope, $rootScope, apiSrvc, commonFnSrvc, $mdDialog, $mdToast) {
                 $scope.closeToast = function() { $scope.getPaymentInformation(); $mdToast.hide();}
               }
          //DO SOMETHING  Same as else statement
          }
            if(response.data.errors.length > 0) {
              $scope.errorMsg = response.data.errors[0].userMsg;
              $scope.showResponseError = true;
            }
            else if(response.errors) {
              $scope.errorMsg = response.errors[0].userMsg;
              $scope.showResponseError = true;
            }
            else if(response.status === 500) {
              $scope.errorMsg = 'We encountered an error while trying to save your payment information. Please double check your information and click Save again. If you continue to have an issue, please contact app1url at (888) 385-9346.';
              $scope.showResponseError = true;
            }
            else {
              //SUCCESS!!
              // $scope.paymentInfo = response.data.data;
              // $scope.editPaymentFields = false;
              // $rootScope.noStripeAccountOnRecord = false;

              //DO SOMETHING
             }
          })
          .catch(function(response) {
            $scope.errorMsg = 'We encountered an error while trying to save your payment information. Please double check your information and click Save again. If you continue to have an issue, please contact app1url at (888) 385-9346.';
            $scope.showResponseError = true;
          })
          .finally(function() {
          });
        }

    }



    };

  //Set NEW user payment info
  $scope.appDemo1SetUserNewPaymentInformation = function(paymentInfo, addNewPaymentInfoForm, identification) {
    if(identification) {
      if(identification.front) {
        var idFront = identification.front;
      }
      if(identification.back) {
        var idBack = identification.back;
      }
    }
    if((paymentInfo.idType === 1) && !idFront) {
        $scope.showResponseError = true;
        $scope.errorMsg = 'Please upload a Passport Image';
    }
    else if((paymentInfo.idType === 2) && (!idFront || !idBack)) {
        $scope.showResponseError = true;
        $scope.errorMsg = "Please upload images of both the Front and the Back of your Driver's Liscence";
    }
    else {
      $scope.paymentFormSubmitted = true;
      $scope.showResponseError = false;
      $scope.formHasError = false;

      if(addNewPaymentInfoForm.$invalid) {
        $scope.formHasError = true;
        $scope.errorMsg = 'Please fill out all required fields in order to submit';
        $scope.showResponseError = true;
      }
      else if(addNewPaymentInfoForm.$valid) {
        delete paymentInfo.idType;
        var objectToPost = paymentInfo;
        var dataObject = {
          jsonData: JSON.stringify(objectToPost)
        }

        if(identification) {
          if(identification.front) {dataObject.IdentifyingDocument = identification.front;}
          if(identification.back) {dataObject.IdentifyingDocumentBack = identification.back;}
        }

        upload({
            url: __env.apiUrl+'/index.asp?remotemethodaddon=appDemo1SetUserNewPaymentInformation&RequestBinary=true',
            method: 'POST',
            data : dataObject
          }).then(function(response) {
         if((response.status === 200) && (response.data.errors.length === 0)) {
              $scope.editablePaymentInfo = response.data.data;
              $scope.editPaymentFields = false;

              //SUCCESS! - not sure what the difference is... from the else
              // SUCCESS MESSAGE AND DO SOMETHING\
              $mdToast.show({
                hideDelay   : false,
                position    : 'bottom',
                parent : $document[0].querySelector('#toastMsg'),
                scope:$scope,
                preserveScope:true,
                controller  : successToasCtrl,
                template :  '<md-toast class="md-success-toast-theme"><div class="md-toast-text flex">Success!  Your info has been saved.</div><div class="md-toast-text"><md-button ng-click="closeToast()">Ok</md-button></md-toast>'
              });
               function successToasCtrl($scope, $rootScope, apiSrvc, commonFnSrvc, $mdDialog, $mdToast) {
                 $scope.closeToast = function() {
                   $mdToast.hide();
                   $scope.getPaymentInformation();
                   $rootScope.noStripeAccountOnRecord = false;

                 }
               }

          }
          else {
            console.log('called');
            $rootScope.noStripeAccountOnRecord = false;
            $scope.getPaymentInformation();

            $scope.errorMsg = response.data.errors[0].userMsg;
            $scope.showResponseError = true;
          }
            // if(response.data.errors.length > 0) {
            //   $scope.errorMsg = response.data.errors[0].userMsg;
            //   $scope.showResponseError = true;
            // }
            // else if(response.errors) {
            //   $scope.errorMsg = response.errors[0].userMsg;
            //   $scope.showResponseError = true;
            // }
            // else if(response.status === 500) {
            //   $scope.errorMsg = 'We encountered an error while trying to save your payment information. Please double check your information and click Save again. If you continue to have an issue, please contact app1url at (888) 385-9346.';
            //   $scope.showResponseError = true;
            // }
            // else {
            //  }
          })
          .catch(function(response) {
            $scope.errorMsg = 'We encountered an error while trying to save your payment information. Please double check your information and click Save again. If you continue to have an issue, please contact app1url at (888) 385-9346.';
            $scope.showResponseError = true;
          })
          .finally(function() {
          });
        }


    }

    // $scope.showResponseError = false;
    // $scope.paymentFormSubmitted = true;
    // if(addNewPaymentInfoForm.$invalid) {
    //   $scope.formHasError = true;
    //   $scope.errorMsg = 'Please fill out all required fields in order to submit';
    //   $scope.showResponseError = true;
    // }
    // else if(addNewPaymentInfoForm.$valid) {
    //   paymentInfo.state = paymentInfo.state.name;
    //   upload({
    //       url: __env.apiUrl+'/index.asp?remotemethodaddon=appDemo1SetUserNewPaymentInformation&RequestBinary=true',
    //       method: 'POST',
    //       data : {
    //         jsonData : JSON.stringify(paymentInfo)
    //       }
    //     }).then(function(response) {
    //       if(response.status === 200) {
    //           $scope.paymentInfo = response.data.data;
    //           $scope.editPaymentFields = false;
    //           $rootScope.noStripeAccountOnRecord = false;
    //       }
    //       if(response.errors.length > 0) {
    //         $scope.errorMsg = response.errors.userMsg;
    //         $scope.showResponseError = true;
    //       }
    //     }, function(error) {
    //       if(error.status === 500) {
    //         $scope.errorMsg = 'We encountered an error while trying to save your payment information. Please double check your information and click Save again. If you continue to have an issue, please contact app1url at (888) 385-9346.';
    //         $scope.showResponseError = true;
    //       }
    //     })
    //   }
    }

  //**********************************************************************************************************//
  //****************************************** SYSTEM NOTIFICATIONS ******************************************//
  //**********************************************************************************************************//
  $scope.appDemo1GetUserNotifications = function() {
    var newNotifications = [];
    var quoteInvites = [];
    var messageNotifications = [];
    var consultantOpportunities = [];
    apiSrvc.getData('appDemo1GetUserNotifications').then(function(response){
      $scope.notificationList = response.data;
      angular.forEach($scope.notificationList, function(item, key) {
        if(!item.markAsRead && (item.notificationType !== 4)) {
          newNotifications.push(item);
          $scope.newNotifications = newNotifications.length;
        }
        // if(!item.markAsRead && (item.notificationType === 2)) {
        //   quoteInvites.push(item);
        //   $scope.quoteInvites = quoteInvites.length;
        // }
        if(!item.markAsRead && (item.notificationType === 1)) {
          messageNotifications.push(item);
          $scope.informationRequests = messageNotifications;
          $scope.messageNotifications = messageNotifications.length;
        }
        if(newNotifications.length > 0) {
          $scope.alertNewNotification = true;
        }
        else {
          $scope.alertNewNotification = false;
        }
      })
      if($rootScope.openNotificationsAccordion) {
         $scope.openCSN = true;
      }
    });
  };
  $scope.initializeCollapse = function() {
    $('.collapsible').collapsible();
  };
  $scope.deleteMsg = function(msg) {
    msg.isDeleted = true;
    apiSrvc.getData('appDemo1DeleteUserNotification&gpKey='+msg.gpKey).then(function(response){
    });
  };
  $scope.markAsRead = function(msg) {
    msg.markAsRead = true;
    var indexOfQIL = $scope.quoteInvitesList.indexOf(msg);
    apiSrvc.getData('appDemo1ReadUserNotification&gpKey='+msg.gpKey+'&markAsRead='+true).then(function(response){
      if(response.errors.length === 0) {
        if(msg.notificationType === 2) {
          $scope.quoteInvites = $scope.quoteInvites - 1;
          $scope.quoteInvitesList.splice(indexOfQIL, 1);
          $scope.archivedQuoteInvitesList.push(msg);
        }
        if(msg.notificationType === 1) {
          $scope.messageNotifications = $scope.messageNotifications - 1;
        }
      }
    });
  };
  $scope.markAsUnread = function(msg) {
    msg.markAsRead = false;
    var indexOfAQIL = $scope.archivedQuoteInvitesList.indexOf(msg);
    if(msg.notificationType === 1) {
      $scope.messageNotifications = $scope.messageNotifications + 1;
    }
    apiSrvc.getData('appDemo1ReadUserNotification&gpKey='+msg.gpKey+'&markAsRead='+false).then(function(response){
      if(response.errors.length === 0) {
        if(msg.notificationType === 2) {
          $scope.quoteInvites = $scope.quoteInvites + 1;
          $scope.archivedQuoteInvitesList.splice(indexOfAQIL, 1);
          $scope.quoteInvitesList.push(msg);
        }
      }
    });
  };

  $scope.readMsgsVisible = false;
  $scope.loadReadMsgs = function() {
    $scope.readMsgsVisible = true;
    $scope.getConsultantArchivedQuoteInvitations();
  };
  $scope.hideReadMsgs = function() {
    $scope.readMsgsVisible = false;
    $scope.getConsultantQuoteInvitations();
  };
  $scope.hiddenMsgsVisible = false;
  $scope.loadHiddenMsgs = function() {$scope.hiddenMsgsVisible = true;};
  $scope.hideHiddenMsgs = function() {$scope.hiddenMsgsVisible = false;};

  //**********************************************************************************************************//
  //**************************************** GET QUOTE INVITATION LIST ***************************************//
  //**********************************************************************************************************//

  $scope.getConsultantQuoteInvitations = function() {
    $scope.activeQuoteInvites = true;
    $scope.archivedQuoteInvites = false;
    if(!$scope.quoteInvitesList) {
      apiSrvc.getData('appDemo1GetConsultantNotificationQuoteInvitations').then(function(response){

        $scope.quoteInvitesList = response.data
        $scope.quoteInvites = $scope.quoteInvitesList.length;
      });
    }

  };
  $scope.getConsultantQuoteInvitations();

  $scope.getConsultantArchivedQuoteInvitations = function() {
    $scope.activeQuoteInvites = false;
    $scope.archivedQuoteInvites = true;
    if(!$scope.archivedQuoteInvitesList) {
      apiSrvc.getData('appDemo1GetConsultantNotificationQuoteInvitationsWithArchives').then(function(response){

        $scope.archivedQuoteInvitesList = response.data
      });
    }

  };
  //**********************************************************************************************************//
  //********************************************* QUOTE INVITATION *******************************************//
  //**********************************************************************************************************//
  $scope.goToConsultantDash = function() {$state.go('consultant.invites');};
  $scope.getQuoteInviteDetails = function(msg) {
    if(msg.consultantRejected) {
    }
    else {
      $rootScope.openNotificationsAccordion = false;
      var engagementKey = msg.engagementGpKey;
      apiSrvc.getData('appDemo1GetConsultantEngagement&gpkey='+engagementKey).then(function(response){
          $scope.engagementData = response.data;
          $rootScope.engagementData = response.data;
          if(response.data.consultantSubmitted) {
            $rootScope.hideSubmit = true;
          }
          else {
            $rootScope.hideSubmit = false;
          }
          if((response.data.nda && !response.data.consultantNDAAccepted && !response.data.consultantNDASignature) || (response.data.oci && !response.data.consultantOCIAccepted && !response.data.consultantOCISignature)) {
            $state.go('needsNDA');
          }
          else if(response.data.nda && response.data.consultantNDAAccepted && response.data.consultantNDASignature) {
            $state.go('quoteInvitation', {engagementKey: engagementKey, engagementData: response.data});
          }
          else {
            $state.go('quoteInvitation', {engagementKey: engagementKey, engagementData: response.data}); //Correct
          }
        });
    }
  };
  $scope.tasksTotalHoursQuotes = function() {
    var total = 0;
    if($scope.engagementData) {
      angular.forEach($scope.engagementData.tasks, function(item) {
        total += item.hoursQuoted;
      })
      $scope.engagementData.hoursQuoted = total;
      return total;
    }

  };
  $scope.submitQuote = function(engagementObject) {
    $scope.showErrorMsg = false;
    if(engagementObject.hoursQuoted === 0) {
      $scope.showErrorMsg = true;
      $scope.errorMsg = 'Please enter hours quoted with an amount greater than 0.'
    }
    else {
      var tasksWithoutDates = engagementObject.tasks;
      angular.forEach(tasksWithoutDates, function(task) {
        delete task.approvedDate;
        delete task.completedDate;
      })
      var parameters = {
        gpKey: engagementObject.gpKey,
        hoursQuoted: engagementObject.hoursQuoted,
        freelanceHourlyRate: engagementObject.engagementRate,
        tasks: engagementObject.tasks,
        supportingNarrative: engagementObject.supportingNarrative
      }
      apiSrvc.sendPostData('appDemo1SetConsultantEngagement', parameters).then(function(response){
        $scope.quoteSubmittedModal();
        $rootScope.hideSubmit = true;
      });
    }

  };
  $scope.showOverlay = function () {document.getElementById("NDAOverlay").style.display = "block";};
  $scope.closeOverlay = function() {document.getElementById("NDAOverlay").style.display = "none";};

  /************************************ MODALS *********************************/
  $scope.openNeedsNDAModal = function(engagementData) {
    $rootScope.ndaSigned = false;
    $scope.eData = engagementData;
    $mdDialog.show({
      controller: NDAModalCtrl,
      templateUrl: '/views/consultant/modals/ndaRequired.html',
      parent: angular.element(document.querySelector('.gp-dashWrapper')),
      clickOutsideToClose:false,
      locals: {
           eData: $scope.eData
         },
      onRemoving: function () {
        var dnaData = $rootScope.ndaData;
        if($rootScope.ndaSigned) {
            $state.go('quoteInvitation', {engagementKey: engagementData.gpKey, engagementData: engagementData });
          }
        else {
          $state.go('consultantDashboard');
        }
      }
    });
  };
  function NDAModalCtrl($scope, $rootScope, $mdDialog, apiSrvc, commonFnSrvc, eData) {
    $scope.eInfoData = eData;
    $scope.hide = function() {$mdDialog.hide();};
    $scope.cancel = function() {$mdDialog.cancel();};
    $scope.answer = function(answer) {$mdDialog.hide(answer);};
    $scope.agree = function(eInfo) {
      apiSrvc.getData('appDemo1SetConsultantEngagementNDA&gpkey='+eInfo.gpKey+'&ndaSignature='+eInfo.consultantNDASignature).then(function(response){
        if(response.errors.length > 0) {
        }
        else {
          $mdDialog.cancel();
          $rootScope.ndaSigned = true;
          $rootScope.engagementData = eInfo;
        }
      });
    }
    $scope.showReasonForRejection = false;
    $scope.reject = function(eInfo) {
        $scope.showReasonForRejection = true;
    }
    $scope.hideReasonForRejection = function(eInfo) {
        $scope.showReasonForRejection = false;
    }
    $scope.rejectWithReason = function(eInfo, reason) {
      apiSrvc.getData('appDemo1ProcessRejectRFQInvite&gpkey='+eInfo.gpKey+'&reason='+reason).then(function(response){
        if(response.errors.length > 0) {
        }
        else {
          $mdDialog.cancel();
          $rootScope.ndaSigned = false;
          $state.go('consultant.dashboard');
        }
      });
    }
    $scope.rejectWithoutReason = function(eInfo) {
      var reason = 'No reason given';
      apiSrvc.getData('appDemo1ProcessRejectRFQInvite&gpkey='+eInfo.gpKey+'&reason='+eInfo.reason).then(function(response){
        if(response.errors.length > 0) {
        }
        else {
          $mdDialog.cancel();
          $rootScope.ndaSigned = false;
          $state.go('consultant.dashboard');
        }
      });
    }
    $scope.doesNotAgree = function(eInfoData) {
      if(eInfoData.doesNotAgree) {
        eInfoData.consultantOCIAccepted = false;
        eInfoData.consultantNDAAccepted = false;
      }
    }
    $scope.acceptedChecked = function(eInfoData) {
      if(eInfoData.consultantNDAAccepted || eInfoData.consultantOCIAccepted) {
        eInfoData.doesNotAgree = false;
      }
    }
  };
  $scope.requestInfoModal = function(engagementData) {
    $scope.engData = engagementData;
    $mdDialog.show({
      controller: requestInfoModalCtrl,
      templateUrl: '/views/consultant/modals/requestInfo.html',
      parent: angular.element(document.querySelector('.gp-dashWrapper')),
      clickOutsideToClose:false,
      locals: {
           eData: $scope.engData
         },
      onRemoving: function () {
        if($rootScope.goBackToDash) {
          $state.go('consultantDashboard');
        }
        else {
        }
      }
    });
  };
  function requestInfoModalCtrl($scope, $rootScope, $mdDialog, apiSrvc, commonFnSrvc, eData) {
    $scope.engInfoData = eData;
    $rootScope.goBackToDash = false;
    $scope.hide = function() {$mdDialog.hide();};
    $scope.cancel = function() {$mdDialog.cancel();};
    $scope.msgSentSuccess = false;
    $scope.consultantSendEngagementMessage = function(eInfo, message) {
      apiSrvc.getData('appDemo1ProcessConsultantSendEngagementMessage&engagementKey='+eInfo.gpKey+'&gpkey='+eInfo.companyUser.gpKey+'&msg='+message).then(function(response){
        if(response.errors.length > 0) {
        }
        else {
          $scope.msgSentSuccess = true;
        }
      });
    }
    $scope.backToDashboard = function() {
      $rootScope.goBackToDash = true;
      $mdDialog.cancel();
    }
  };
  $scope.quoteSubmittedModal = function() {
    $rootScope.goBackToDash = false;
    $mdDialog.show({
      controller: quoteSubmittedModalCtrl,
      templateUrl: '/views/consultant/modals/quoteSubmitted.html',
      parent: angular.element(document.querySelector('.gp-dashWrapper')),
      clickOutsideToClose:false,
      onRemoving: function () {
        if($rootScope.goBackToDash) {
          $state.go('consultant.invites');
        }
        else {
        }
      }
    });
  };
  function quoteSubmittedModalCtrl($scope, $rootScope, $mdDialog) {
    $rootScope.goBackToDash = false;
    $scope.hide = function() {$mdDialog.hide();};
    $scope.cancel = function() {$mdDialog.cancel();};
    $scope.backToDashboard = function() {
      $rootScope.goBackToDash = true;
      $mdDialog.cancel();
    }
  };
  $scope.openIOSendMsgModal = function(project) {
    $scope.project = project;
    $mdDialog.show({
      controller: IOMsgCtrl,
      scope:$scope,
      preserveScope:true,
      templateUrl: '/views/consultant/consultantDashboard/interestedOpportunities/sendIOMessage.html',
      clickOutsideToClose:true,
      parent: angular.element(document.querySelector('.gp-dashWrapper')),
      locals: {
           projectData: $scope.project,
           consultantData: $scope.consultantInfo
         }
    });
  };
  $scope.openReplyToMsgModal = function(msgReply) {
    $scope.msgReply = msgReply;
    $mdDialog.show({
      controller: replyToMsgCtrl,
      templateUrl: '/views/consultant/consultantDashboard/systemNotifications/replyToMsgModal.html',
      clickOutsideToClose:true,
      parent: angular.element(document.querySelector('.gp-dashWrapper')),
      locals: {
           msgReplyData: $scope.msgReply,
           consultantData: $scope.consultantInfo,
         }
    });
  };

  $scope.deleteOpportunityFromListModal = function(project) {
    $mdDialog.show({
      controller: deleteOpportunityCtrl,
      scope:$scope,
      preserveScope:true,
      templateUrl: '/views/consultant/consultantDashboard/interestedOpportunities/deleteProjectOpportunity.html',

      clickOutsideToClose:true,
      parent: angular.element(document.querySelector('.gp-dashWrapper')),
      locals: {
           projectData: project
         }
    });
  };

  function deleteOpportunityCtrl($scope, $rootScope, $mdDialog, apiSrvc, commonFnSrvc, projectData, authSrvc, envSrvc, config) {
    $scope.projectData = projectData;
    $scope.hide = function() {$mdDialog.hide();};
    $scope.cancel = function() {$mdDialog.cancel();};

    $scope.deleteOpportunityFromList = function() {
      apiSrvc.getData('appDemo1RemovePublicOpportunity&gpKey='+projectData.gpKey).then(function(response){
        console.log(response);
        if(response.errors.length > 0) {

        }
        else {
          $scope.publicProjects = response.data;
          $scope.ppNumber = response.data.length;
          $mdDialog.cancel();
        }
      });
    }
  }

  //**********************************************************************************************************//
  //*********************************************  WYSIWYG EDITOR ********************************************//
  //**********************************************************************************************************//
  $scope.version = textAngularManager.getVersion();
  $scope.versionNumber = $scope.version.substring(1);
  $scope.orightml = 'Enter Text Here';
  $scope.htmlcontent = $scope.orightml;
  $scope.disabled = false;

  //**********************************************************************************************************//
  //******************************************** PERSONAL SETTINGS *******************************************//
  //**********************************************************************************************************//
  $scope.updatePassword = function(password, confirmPass) {
    if(!password) {
      $mdToast.show({
        hideDelay   : false,
        position    : 'bottom',
        parent : $document[0].querySelector('#editUsernamePassword'),
        scope:$scope,
        preserveScope:true,
        controller  : noPassErrorCtrl,
        template :  '<md-toast class="md-danger-toast-theme"><div class="md-toast-text flex">Your password cannot be empty.</div><div class="md-toast-text"><md-button ng-click="closeToast()">Ok</md-button></md-toast>'
      });
       function noPassErrorCtrl($scope, $rootScope, apiSrvc, commonFnSrvc, $mdDialog, $mdToast) {
         $scope.closeToast = function() {$mdToast.hide();}
       }
    }
    else if(password != confirmPass) {
      $mdToast.show({
        hideDelay   : false,
        position    : 'bottom',
        parent : $document[0].querySelector('#editUsernamePassword'),
        scope:$scope,
        preserveScope:true,
        controller  : confirmPassErrorCtrl,
        template :  '<md-toast class="md-danger-toast-theme"><div class="md-toast-text flex">Your password fields do not match.</div><div class="md-toast-text"><md-button ng-click="closeToast()">Ok</md-button></md-toast>'
      });
       function confirmPassErrorCtrl($scope, $rootScope, apiSrvc, commonFnSrvc, $mdDialog, $mdToast) {
         $scope.closeToast = function() {$mdToast.hide();}
       }
    }
    else {
      apiSrvc.getData('appDemo1SetUserPassword&password='+password).then(function(response){

        if(response.errors.length > 0) {
          $mdToast.show({
            hideDelay   : false,
            position    : 'bottom',
            parent : $document[0].querySelector('#editUsernamePassword'),
            scope:$scope,
            preserveScope:true,
            controller  : saveNewPassErrorCtrl,
            template :  '<md-toast class="md-danger-toast-theme"><div class="md-toast-text flex">There was an error and your new password was not saved</div><div class="md-toast-text"><md-button ng-click="closeToast()">Ok</md-button></md-toast>'
          });
           function saveNewPassErrorCtrl($scope, $rootScope, apiSrvc, commonFnSrvc, $mdDialog, $mdToast) {
             $scope.closeToast = function() {$mdToast.hide();}
           }
        }
        else {
          $mdToast.show({
            hideDelay   : false,
            position    : 'bottom',
            parent : $document[0].querySelector('#editUsernamePassword'),
            scope:$scope,
            preserveScope:true,
            controller  : saveNewPassCtrl,
            template :  '<md-toast class=""><div class="md-toast-text flex">Your password has been updated successfully!</div><div class="md-toast-text"><md-button class="md-highlight" ng-click="closeToast()">Ok</md-button></md-toast>'
          });
           function saveNewPassCtrl($scope, $rootScope, apiSrvc, commonFnSrvc, $mdDialog, $mdToast) {
             $scope.closeToast = function() {$mdToast.hide();}
           }
        }
      });
    }


  };

  //**********************************************************************************************************//
  //********************************************* Other Functions ********************************************//
  //**********************************************************************************************************//
  $scope.myConvertDate = function(dateToConvert) {
    if(dateToConvert) {
      var dateString = dateToConvert.substr(6);
      var memberSince = new Date(parseInt(dateString));
      return memberSince;
    }

  };
  $scope.limitValue = 3;
  $scope.showAllReviews = function(lengthOfReviews) {

    if($scope.limitValue == lengthOfReviews) {
      $scope.limitValue = 3;
    }
    else {
      $scope.limitValue = lengthOfReviews;
        $(".referenceRating").rating({displayOnly: true, step: 0.5});
    }
  };

  //********************************************** Open / Close **********************************************//
  $scope.openConsultantSystemNotifications = function() {$scope.openCSN = true;};
  $scope.closeConsultantSystemNotifications = function() {$scope.openCSN = false;};
  //
  $scope.openConsultantInterestedOpportunities = function() {$scope.openCIO = true;
  };
  $scope.closeConsultantInterestedOpportunities = function() {$scope.openCIO = false;};
  //
  $scope.openConsultantMyProfile = function() {$scope.openCMP = true; $scope.callLastFunction2();};
  $scope.closeConsultantMyProfile = function() {$scope.openCMP = false;};
  //
  $scope.openConsultantRecentNews = function() {$scope.openCRN = true;};
  $scope.closeConsultantRecentNews = function() {$scope.openCRN = false;};
  //
  $scope.openConsultantApprovedProjects = function() {$scope.openCAP = true;};
  $scope.closeConsultantApprovedProjects = function() {$scope.openCAP = false;};
  //


  // Troubleshooting log
  var counter = 0;
  var counter2 = 0;
  $scope.$watch("consultantInfo.name",function(newValue, oldValue, scope){
    counter = counter + 1;
    if(counter > 2) {
      var params = {
        oldValue: oldValue,
        newValue: newValue,
        info: $scope.consultantInfo
      }
      apiSrvc.sendPostData('appDemo1CreateUILog', params).then(function(response) {

      })
    }

  });
  $scope.$watch("consultantInfo.gpKey",function(newVal, oldVal, scope){
    counter2 = counter2 + 1;
    var params = {
      oldValue: oldVal,
      newValue: newVal,
      info: $scope.consultantInfo
    }
    if(counter2 > 2) {
      apiSrvc.sendPostData('appDemo1CreateUILog', params).then(function(response) {

      })
    }
  });

});
