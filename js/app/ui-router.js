app.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
  $locationProvider.html5Mode(true).hashPrefix('!')
  $urlRouterProvider
  .when('/consultantDashboard', '/consultantDashboard/dashboard-landing')
  $stateProvider
    .state('signUp', {
        url: '/',
        templateUrl: 'views/signupLanding.html',
        controller: 'loginCtrl'
    })
    .state('signIn', {
      url: '/login' ,
      templateUrl : 'views/signIn.html',
      controller: 'loginCtrl',
      resolve: {factory: checkRouting}
  	})
    //consultant sign up
    .state('consultantSignUpWithReferralCode' , {
      controller: 'consultantSignUpCtrl',
      url: '/signUp/:codeId',
      templateUrl: "views/consultant/consultantSignUp/consultantSignUp.html"
    })
    .state('consultantSignUp' , {
      controller: 'consultantSignUpCtrl',
      url: '/signUp',
      templateUrl: "views/consultant/consultantSignUp/consultantSignUp.html"
    })
    //Consultant Marketing Sign up
    .state('consultantMarketingSignUp' , {
      controller: 'consultantSignUpCtrl',
      url: '/freelance-consultant' ,
      templateUrl: "views/consultant/consultantSignUp/marketingConsultantSignUpLandingPage.html"
    })
    //Company Marketing Sign up
    .state('companyMarketingSignUp' , {
      controller: 'signUpCtrl',
      url: '/government-contractor' ,
      templateUrl: "views/company/signUpPro/marketingCompanySignUpLanding.html",
      params: {marketingSite : true}
    })
    //company sign up
    .state('step1-Company', {
      url: '/accountSignUp/:codeId' ,
      templateUrl : 'views/company/signupPro/companyInfoSAM.html',
      controller: 'signUpCtrl',
      params: {appInfoParams : null, marketingSite : false}
  	})
    .state('confirmEmail', {
      url: '/confirmEmail' ,
      templateUrl : 'views/company/signupPro/confirmEmail.html',
      controller: 'signUpCtrl'
  	})
    .state('verifySignUp', {
      url: '/verifySignUp' ,
      templateUrl : 'views/company/signupPro/verifySignUp.html',
      controller: 'signUpCtrl',
      params: {SignUpId : null}
  	})
    .state('step4-Company', {
      url: '/selectPlan' ,
      templateUrl : 'views/company/signupPro/selectPlan.html',
      controller: 'signUpCtrl',
      params: {marketingSite : false, SignUpId: null}
  	})
    .state('step4-USCB', {
      url: '/purchaseReferralPlan' ,
      templateUrl : 'views/company/signupPro/purchaseReferralPlan.html',
      controller: 'signUpCtrl',
      params: {marketingSite : false, SignUpId: null}
  	})
    .state('thankyou', {
      url: '/thankyou',
      templateUrl : 'views/company/signupPro/thankyou.html',
      controller: 'signUpCtrl'
  	})
    //COMPANY USERS
    .state('company' , {
      controller: 'dashCtrl',
      url: '/companyDashboard' ,
      templateUrl: "views/company/dashboard/dashboard.html",
      // params: {userParams: null},
      resolve: {factory: checkRouting}
    })
    .state('myProjects' , {
      controller: 'dashCtrl',
      url: '/myProjects' ,
      templateUrl: "views/company/projects/projectList.html",
      resolve: {factory: checkRouting}
    })
    .state('projectDetails' , {
      controller: 'detailCtrl',
      url: '/projectDetails/:id',
      params: {projectParams : null, selectedProgressTab : null, showEditProjectFields : false, showDuplicateProject: false, cameFromDashboard : false},
      templateUrl: "/views/company/projectDetails/myProjectDetails.html",
      resolve: {factory: checkRouting}
    })
    .state('postProject' , {
      controller: 'postAProjectCtrl',
      url: '/postProject' ,
      templateUrl: "views/company/postAProject/postAProject.html",
      resolve: {factory: checkRouting}
    })
    .state('createOSProject' , {
      controller: 'osCreateProjectCtrl',
      url: '/createOSProject' ,
      templateUrl: "views/opportunitySearch/osCreateProject.html",
      params: {opportunityDetails: null},
      resolve: {factory: checkRouting}
    })
    .state('legalDocs' , {
      controller: 'legalDocsCtrl',
      url: '/legalDocs' ,
      templateUrl: "views/company/legalDocs/legalDocs.html",
    })
    .state('myAccount' , {
      controller: 'myAcctCtrl',
      url: '/myAccount' ,
      templateUrl: "views/company/myAccount.html",
      resolve: {factory: checkRouting}
    })
    .state('myProfile' , {
      controller: 'dashCtrl',
      url: '/myProfile' ,
      templateUrl: "views/company/myProfile.html",
      // resolve: {factory: checkRouting}
    })
    .state('companyProfile' , {
      controller: 'companyProfileCtrl',
      url: '/companyProfile' ,
      params: {editCompanyUsers: null},
      templateUrl: "views/company/companyProfile/companyProfile.html",
      // resolve: {factory: checkRouting}
    })
    .state('upgradePlan' , {
      controller: 'plansCtrl',
      url: '/plans' ,
      templateUrl: "views/company/plans/upgrade.html",
      resolve: {factory: checkRouting}
    })
    .state('expertProfile' , {
      controller: 'consultantDetailsCtrl',
      url: '/expert-profile/:id',
      params: {expertDetails : null},
      templateUrl: "views/company/expertDetails/consultantDetails.html",
      resolve: {factory: checkRouting}
    })
    .state('expiredMembership', {
      controller: 'expiredMembershipCtrl',
      url: '/expired-membership',
      templateUrl: "views/company/expiredMembership/expiredMembership.html",
      resolve: {factory: checkRouting}
    })
    //CONSULTANT USERS
    .state('consultant' , {
      controller: 'consultantDashCtrl',
      url: '/consultantDashboard' ,
      templateUrl: "views/consultant/consultantDashboard/consultantDashboard.html",
      resolve: {factory: checkRouting},
      params: {openNotifications : null, signUpLocation: null}
    })
    .state('consultant.dashboard' , {
      url: '/dashboard-landing' ,
      templateUrl: "views/consultant/consultantDashboard/landing.html",
    })
    .state('consultant.notifications' , {
      url: '/notifications' ,
      templateUrl: "views/consultant/consultantDashboard/systemNotifications/systemNotifications.html",
    })
    .state('consultant.invites' , {
      url: '/invites' ,
      templateUrl: "views/consultant/consultantDashboard/systemNotifications/quoteInvites.html",
    })
    .state('consultant.opportunities' , {
      url: '/opportunities' ,
      templateUrl: "views/consultant/consultantDashboard/interestedOpportunities/interestedOpportunities.html",
    })
    .state('consultant.myProfile' , {
      url: '/profile' ,
      templateUrl: "views/consultant/consultantDashboard/myProfile/myProfile.html",
    })
    .state('consultant.engagements' , {
      url: '/engagements' ,
      templateUrl: "views/consultant/consultantDashboard/approvedProjects/engagements.html",
    })
    .state('consultant.paymentInfo' , {
      url: '/paymentInfo' ,
      templateUrl: "views/consultant/consultantDashboard/myPaymentInfo/myPaymentInfo.html",
    })
    .state('consultantLegalDocs' , {
      controller: 'consultantLegalDocsCtrl',
      url: '/myLegalDocs' ,
      templateUrl: "views/consultant/legalDocs/legalDocs.html",
    })
    .state('personalSettings' , {
      controller: 'consultantDashCtrl',
      url: '/personalSettings' ,
      templateUrl: "views/consultant/personalSettings.html",
      resolve: {factory: checkRouting}
    })
    .state('quoteInvitation' , {
      controller: 'quoteInvitationCtrl',
      url: '/quoteInvitation/:engagementKey' ,
      params: {engagementKey : null, engagementData: null},
      templateUrl: "views/consultant/consultantDashboard/quoteInvitation/quoteInvitation.html",
      resolve: {factory: checkConsultantAuth}
    })
    .state('needsNDA' , {
      controller: 'consultantDashCtrl',
      url: '/needsNDA' ,
      templateUrl: "views/consultant/consultantDashboard/systemNotifications/needsNDA.html",
    })
    //
    .state('invitedAuthSignIn' , {
      controller: 'invitedAuthCtrl',
      url: '/temporaryLogin' ,
      params: {projectKey : null, quoteKey: null},
      templateUrl: "views/company/invitedAuthorizedPayer/invitedAuthLogin.html"
    })
    .state('invitedAuthNewUserProfileForm' , {
      controller: 'invitedAuthCtrl',
      url: '/newCompanyUserForm' ,
      params: {projectKey : null, quoteKey: null},
      templateUrl: "views/company/invitedAuthorizedPayer/invitedAuthNewUserProfileForm.html"
    })
    .state('invitedAuthEngagementDetails' , {
      controller: 'invitedAuthCtrl',
      url: '/engagementToAuthorize' ,
      params: {projectKey : null, quoteKey: null},
      templateUrl: "views/company/invitedAuthorizedPayer/invitedAuthEngagementDetails.html"
    })
    .state('invitedReferenceRating' , {
      controller: 'referenceRatingCtrl',
      url: '/referenceRating' ,
      params: {referenceRatingKey : null},
      templateUrl: "views/referenceRating/referenceRating.html"
    })
    .state('referenceThankYou' , {
      controller: 'referenceRatingCtrl',
      url: '/referenceComplete' ,
      params: {referenceRatingKey : null},
      templateUrl: "views/referenceRating/referenceThankYou.html"
    })
    .state('referenceError' , {
      controller: 'referenceRatingCtrl',
      url: '/referenceError' ,
      params: {referenceRatingKey : null},
      templateUrl: "views/referenceRating/referenceError.html"
    })
    .state('consultantInviteValidation' , {
      controller: 'consultantInviteValidationCtrl',
      url: '/consultantInvite' ,
      params: {ConsultantInvitationId : null},
      templateUrl: "views/consultant/consultantInviteValidation/invite.html"
    })
    .state('companyInviteValidation' , {
      controller: 'companyInviteValidationCtrl',
      url: '/companyInvite' ,
      params: {CompanyInvitationId : null},
      templateUrl: "views/company/companyInviteValidation/invite.html"
    })
    //
    .state('pipeline' , {
      controller: 'pipelineCtrl',
      url: '/pipeline' ,
      templateUrl: "views/pipeline/pipeline.html"
    })
    .state('pipelineOpportunity' , {
      controller: 'pipelineOpportunityDetailsCtrl',
      url: '/pipelineOpportunity/:opportunityKey' ,
      params: {opportunityKey: null},
      templateUrl: "views/pipeline/pipelineOpportunity.html"
    })
    .state('pipelineSettings' , {
      controller: 'pipelineSettingsCtrl',
      url: '/pipelineSettings' ,
      templateUrl: "views/pipeline/pipelineSettings.html"
    })
    .state('opportunity' , {
      controller: 'opportunityCtrl',
      url: '/opportunitySearch' ,
      templateUrl: "views/opportunitySearch/opportunitySearch.html"
    })
    .state('teammateMatch' , {
      controller: 'teammateMatchCtrl',
      url: '/teammateMatch' ,
      templateUrl: "views/teammateMatch/teammateMatch.html"
    })
    .state('teammateMatchInvite' , {
      controller: 'teammateMatchInviteCtrl',
      url: '/teammateMatchInvite' ,
      templateUrl: "views/teammateMatch/teammateMatchInvite.html"
    })
    .state('csaDashboard' , {
      controller: 'csaCtrl',
      url: '/csaDashboard' ,
      templateUrl: "views/csa/impersonation.html",
      // resolve: {factory: checkAuth}
    })
    .state('adminDashboard' , {
      controller: 'adminCtrl',
      url: '/adminDashboard' ,
      templateUrl: "views/adminDash/impersonation.html",
      // resolve: {factory: checkAuth}
    })
    .state('adminConsultantDashboard' , {
      controller: 'adminConsultantCtrl',
      url: '/admin-consultant-dashboard' ,
      templateUrl: "views/admin-ConsultantDash/impersonation.html",
      // resolve: {factory: checkAuth}
    })

    //Design only
    .state('designUI' , {
      controller: 'designUICtrl',
      url: '/designUI' ,
      templateUrl: "views/designUI/designUI.html"
    })
  }).run(function($rootScope, $state, $stateParams, $location, envSrvc, apiSrvc) {
    $rootScope.envURL = envSrvc.envURL;
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
    // $rootScope.appDemo1GetCompanyUsers = function() {
    //   console.log('ui-router');
    //   if($rootScope.rootCompanyUsers) {}
    //   else {
    //     apiSrvc.getData('appDemo1GetCompanyUsers').then(function(response){
    //       $rootScope.rootCompanyUsers = response.data;
    //       var addNew = {name: "Add New", gpKey: null};
    //        $rootScope.rootCompanyUsers.push(addNew);
    //     });
    //   }
    // }

    $rootScope.restoreUser = function(userInfo) {
      apiSrvc.getData('appDemo1RestoreFromImpersonateUser').then(function(response){
        if(response.errors.length > 0) {

        }
        else if(!response.data.isImpersonateAdmin  && response.data.isInImpersonateGroup) {
          $state.go('csaDashboard');
        }
        else if(response.data.isImpersonateAdmin && response.data.isConsultant) {
          $state.go('adminConsultantDashboard');
        }
        else if(response.data.isImpersonateAdmin && !response.data.isConsultant) {
          $state.go('adminDashboard');
        }
        else {

        }
      })
    }

  })

app.config(function($mdThemingProvider) {
  $mdThemingProvider.theme('danger-toast');
  $mdThemingProvider.theme('warning-toast');
  $mdThemingProvider.definePalette('gpBlueTheme', {
    '50': 'c2dae4',
    '100': '8ab8cc',
    '200': '59a2c1',
    '300': '418dad',
    '400': '2e7492',
    '500': '1f5b75',
    '600': '165069',
    '700': '0d3f54',
    '800': '093b50',
    '900': '043144',
    'A100': '49c9ff',
    'A200': '39c1fb',
    'A400': '2abefd',
    'A700': '05b0f9',
    'contrastDefaultColor': 'light',    // whether, by default, text (contrast)
                                        // on this palette should be dark or light

    'contrastDarkColors': ['50', '100', //hues which contrast should be 'dark' by default
     '200', '300', '400', 'A100'],
    'contrastLightColors': undefined    // could also specify this if default was 'dark'
  });
  $mdThemingProvider.theme('default')
    .primaryPalette('gpBlueTheme')
    .accentPalette('orange');


});
