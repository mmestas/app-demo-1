app.controller('dashCtrl', function($rootScope, $scope, $state, $stateParams, $location, $document,  $timeout, apiSrvc, commonFnSrvc, passDataSrvc, NgTableParams, Upload, upload, $filter, blockUI, $http, $mdDialog, $mdToast, $location, authSrvc, envSrvc, config) {

self.$inject = ["NgTableParams", "ngTableGroupedList"];

/************************************************************************************************************/
/*************************************************** INIT  **************************************************/
/************************************************************************************************************/
  $scope.passDataSrvc = passDataSrvc;
  $scope.dashInit = function() {
    console.log('dash is called');
    var verifyActiveAcct = function(response) {
      if(response) {
        $scope.appDemo1GetCompanyProjectsForDash();
        
      }
    };
    $scope.getAccountStatus(verifyActiveAcct);
  };
  $scope.getDashProjectDetails = function(gpKey) {
    $rootScope.appDemo1GetFindExperts(gpKey);
  };
  $scope.getProjectDetailsForDash = function(gpKey, project, myDashProjects) {
    $scope.getGpKey(gpKey);
    angular.forEach($scope.myDashProjects, function(eachProject) {
      eachProject.active = false;
    })
    if(project) {
      project.active = true;
    }

  };
  $scope.myProfileInit = function() {
    var verifyActiveAcct = function(response) {
      if(response) {
        authSrvc.getUserInfoForProfile($scope);
        $scope.appDemo1GetCompanyInformation();
        $scope.cropperHtml = '';
      }
    }
    $scope.getAccountStatus(verifyActiveAcct);
  };
  $scope.myProjectsInit = function() {
    $scope.appDemo1GetProjectStatusList();
    authSrvc.getUserInfo($scope);
    $scope.appDemo1GetCompanyProjects();
  };
  $scope.appDemo1ProcessLogout = function() {
    apiSrvc.getData('appDemo1ProcessLogout').then(function(response){
      $state.go('signIn');
    });
  };
  $scope.goToMyAccount = function() {
    window.location.href = "/myaccount.asp";
  };
  $scope.getProjectDetails = function(gpKey) {
    apiSrvc.getData('appDemo1GetProjectDetails&gpkey=' + gpKey).then(function(response){
      $scope.dashboardEngagements = response.data.Engagements;
      $scope.projectDetails = response.data;
      if($scope.projectDetails.exposure === 3) {
        $scope.projectDetails.exposure = 1;
      }
      $scope.shortlist = response.data.Shortlist;
      $scope.favorites = response.data.Favorites;
      $scope.bench = response.data.Bench;
      $scope.quotesReceived = response.data.QuotesReceived;
      $scope.engagementsToApprove = response.data.EngagementsToApprove;
      $scope.engagements = response.data.Engagements;
      $scope.completedEngagements = [];
      // NOTE: There needs to be a better way to do this!!
      angular.forEach($scope.engagements, function(engagement) {
        if($scope.completedEngagements.length > 0) {
          angular.forEach($scope.completedEngagements, function(ce) {
            if(ce.gpkey === engagement.gpkey) {}
            else {
              angular.forEach(engagement.tasks, function(task) {
                if(task.completed && task.approved) {
                  $scope.completedEngagements.push(engagement);
                }
              })
            }
          });
        }
        else {
          angular.forEach(engagement.tasks, function(task) {
            if(task.completed && task.approved) {
              if ($scope.completedEngagements.indexOf(engagement) == -1) {
                  $scope.completedEngagements.push(engagement);
              }
            }
          })
        }
      })
    });
  };
  $scope.getEngagementsForProject = function(gpKey) {
    $scope.hiddenEngagementKey = gpKey;
    apiSrvc.getData('appDemo1GetProjectDetails&gpkey=' + gpKey).then(function(response){
      $scope.dashboardEngagements = response.data.Engagements;
      $scope.projectDetails = response.data;
      if($scope.projectDetails.exposure === 3) {
        $scope.projectDetails.exposure = 1;
      }
      $scope.quotesReceived = response.data.QuotesReceived;
      $scope.engagementsToApprove = response.data.EngagementsToApprove;
      $scope.engagements = response.data.Engagements;
      $scope.completedEngagements = [];
      // NOTE: There needs to be a better way to do this!!
      angular.forEach($scope.engagements, function(engagement) {
        if($scope.completedEngagements.length > 0) {
          angular.forEach($scope.completedEngagements, function(ce) {
            if(ce.gpkey === engagement.gpkey) {}
            else {
              angular.forEach(engagement.tasks, function(task) {
                if(task.completed && task.approved) {
                  $scope.completedEngagements.push(engagement);
                }
              })
            }
          });
        }
        else {
          angular.forEach(engagement.tasks, function(task) {
            if(task.completed && task.approved) {
              if ($scope.completedEngagements.indexOf(engagement) == -1) {
                  $scope.completedEngagements.push(engagement);
              }
            }
          })
        }
      })
    });
  };

/**********************************************************************************************************/
/****************************************** SYSTEM NOTIFICATIONS ******************************************/
/**********************************************************************************************************/
  $scope.initializeCollapse = function() {
    $('.collapsible').collapsible();
  };
  $scope.appDemo1GetUserNotifications = function() {
    var newNotifications = [];
    if($scope.notificationList) {

    }
    else {
      apiSrvc.getData('appDemo1GetUserNotifications').then(function(response){
        $scope.notificationList = response.data;
        angular.forEach($scope.notificationList, function(item, key) {
          if(!item.markAsRead) {
            newNotifications.push(item);
            $scope.newNotifications = newNotifications.length;
          }
          if(newNotifications.length > 0) {
            $scope.alertNewNotification = true;
          }
          else {
            $scope.alertNewNotification = false;
          }
        })
      });
    }

  };
  $scope.deleteMsg = function(msg) {
    msg.isDeleted = true;
    $scope.newNotifications = $scope.newNotifications - 1;
    apiSrvc.getData('appDemo1DeleteUserNotification&gpKey='+msg.gpKey).then(function(response){
    });
  };
  $scope.markAsRead = function(msg) {
    msg.markAsRead = true;
    $scope.newNotifications = $scope.newNotifications - 1;
    apiSrvc.getData('appDemo1ReadUserNotification&gpKey='+msg.gpKey+'&markAsRead='+true).then(function(response){
    });
  };
  $scope.markAsUnread = function(msg) {
    msg.markAsRead = false;
    $scope.newNotifications = $scope.newNotifications + 1;
    apiSrvc.getData('appDemo1ReadUserNotification&gpKey='+msg.gpKey+'&markAsRead='+false).then(function(response){
    });
  };
  $scope.readMsgsVisible = false;
  $scope.loadReadMsgs = function() {$scope.readMsgsVisible = true;};
  $scope.hideReadMsgs = function() {$scope.readMsgsVisible = false;};

/************************************************************************************************************/
/******************************************* DELETE and ARCHIVE  ********************************************/
/************************************************************************************************************/
  $scope.statusChangeSelect = function(status, project) {
    if(status == 1) {$scope.goToProjectDetails(project);}
    else if(status == 2) {$state.go('projectDetails', {id: project.gpKey, projectParams: project,  selectedProgressTab: 0, showEditProjectFields: true, showDuplicateProject: false, cameFromDashboard: true});
    }
    else if(status == 6) {$state.go('projectDetails', {id: project.gpKey, projectParams: project,  selectedProgressTab: 0, showEditProjectFields: false, showDuplicateProject: true, cameFromDashboard: true});
    }
    else if(status == 3) {$scope.closeProject(project);}
    else if(status == 4) {$scope.archiveProject(project);}
    else if(status == 5) {$scope.deleteProject(project);}
    else {}
  };
  $scope.deleteProject = function(project) {
      $scope.project = project;
      $scope.projectIsDeleted = false;
      $mdDialog.show({
        controller: aysModalCtrl,
        templateUrl: '/views/company/dashboard/projects/areYouSureModal.html',
        clickOutsideToClose:true,
        scope:$scope,
        preserveScope:true,
        parent: angular.element(document.querySelector('.gp-dashWrapper')),
        locals: {
             projectData: $scope.project,
             userInfoData: $scope.userInfo
           }
      }).finally(function() {
        if($scope.projectIsDeleted) {
          var refresh = true;
          $scope.appDemo1GetCompanyProjectsForDash(refresh);
          $scope.appDemo1GetDashboardCompanyUserProjects(refresh);
        }

      });

  };
  $scope.archiveProject = function(project) {
    $mdToast.show({
        hideDelay   : false,
        position    : 'bottom',
        parent : $document[0].querySelector('.navbar-fixed-top'),
        scope:$scope,
        preserveScope:true,
        controller  : archiveProjectWarningToastCtrl,
        template :  '<md-toast class="md-warning-toast-theme"><div class="md-toast-text flex">Are you sure you want to archive this project?</div><div class="md-toast-text "><md-button ng-click="closeArchive()">Cancel</md-button><md-button ng-click="yesArchive()">Yes, Archive</md-button></div></md-toast>'
      });
     function archiveProjectWarningToastCtrl($scope, $rootScope, apiSrvc, commonFnSrvc, $mdDialog, $mdToast) {
       $scope.closeArchive = function() {$mdToast.hide();}
       $scope.yesArchive = function() {
         apiSrvc.getData('appDemo1ProcessProjectArchive&gpKey='+project.gpKey).then(function(response) {
           $mdToast.hide();
           var refresh = true;
           $scope.appDemo1GetCompanyProjectsForDash(refresh);
           $scope.appDemo1GetDashboardCompanyUserProjects(refresh);
         })
       }
     }
  };
  $scope.closeProject = function(project) {
    $mdToast.show({
        hideDelay   : false,
        position    : 'top',
        parent : $document[0].querySelector('.navbar-fixed-top'),
        scope:$scope,
        preserveScope:true,
        controller  : closeProjectWarningToastCtrl,
        template :  '<md-toast class="md-warning-toast-theme"><div class="md-toast-text flex">Are you sure you want to close this project?</div><div class="md-toast-text "><md-button ng-click="closeCloseProject()">Cancel</md-button><md-button ng-click="yesCloseProject()">Yes, Close Project</md-button></div></md-toast>'
      });
     function closeProjectWarningToastCtrl($scope, $rootScope, apiSrvc, commonFnSrvc, $mdDialog, $mdToast) {
       $scope.closeCloseProject = function() {$mdToast.hide();}
       $scope.yesCloseProject = function() {
         apiSrvc.getData('appDemo1ProcessProjectClosed&gpKey='+project.gpKey).then(function(response) {
           $mdToast.hide();
           var refresh = true;
           $scope.appDemo1GetCompanyProjectsForDash(refresh);
           $scope.appDemo1GetDashboardCompanyUserProjects(refresh);
         })
       }
     }
  };

/************************************************************************************************************/
/********************************************** Remote Methods **********************************************/
/************************************************************************************************************/
  $scope.appDemo1GetCompanyInformation = function() {
    apiSrvc.getData('appDemo1GetCompanyInformation').then(function(response){
      $scope.companySnapshots = response.data.CompanySnapshots;
      $scope.companyInfoBoxes = response.data.CompanyInfoBoxes;
    });
  };
  $scope.appDemo1GetCompanyProfile = function() {
    // apiSrvc.getData('appDemo1GetCompanyProfile&gpKey='+$stateParams.userParams.Company.gpKey).then(function(response) {
    //   $scope.companyInfo = response.data;
    //   $rootScope.companyInfo = response.data;
    // })
    console.log('appDemo1GetCompanyProfile', $rootScope.userInfo);
    commonFnSrvc.appDemo1GetCompanyProfile($scope, $rootScope.userInfo);
  };
  $scope.appDemo1GetProjectStatusList = function() {
    apiSrvc.getData('appDemo1GetProjectStatusList').then(function(response){
      $scope.projectStatusList = response.data;
    });
  };
  $scope.appDemo1GetCompanyProjects = function() {
    apiSrvc.getData('appDemo1GetCompanyProjects').then(function(response){
      $scope.myProjects = response.data;
      //New 1.29.18
      var projectList = response.data;
      $scope.projectListTableParams = new NgTableParams({}, { dataset: projectList});
      angular.forEach(projectList, function(project) {
        project.dateCreated = $filter('dateConverter')(project.dateCreated);
        project.dateCreated = $filter('date')(project.dateCreated);
      })
      $scope.titleFilter = {
        title: {
          id: "text",
          placeholder: "Filter by title",
        }
      };
      $scope.ownerFilter = {
        'owner.name': {
          id: "text",
          placeholder: "Filter by owner",
        }
      };
      $scope.statusFilter = {
        'status.name': {
          id: "text",
          placeholder: "Filter by status",
        }
      };
      $scope.dateCreatedFilter = {
        dateCreated: {
          id: "text",
          placeholder: "Filter by date created",
        }
      };

    });
  };


  $scope.getAccountStatus = function(verifyActiveAcct) {
    commonFnSrvc.getAccountStatus($scope, verifyActiveAcct);
  };

  /******************** Projects FOR DASHBOARD ********************/
  $scope.getActiveAndClosedProjectsNumber = function(dashProjects) {
    var ActProj = [];
    var ClosedProj = [];
    angular.forEach(dashProjects, function(project) {
      if(project.status.gpKey === '{74699447-4fad-47f9-9f68-48a3e86b7f5e}') {ClosedProj.push(project);}
      else {ActProj.push(project);}
      $scope.numClosedProj = ClosedProj.length;
      $scope.numActProj = ActProj.length;
    })
  };
  $scope.appDemo1GetCompanyProjectsForDash = function(refresh) {
    $scope.showMyProjects = false;
    $scope.poProjects = false;
    $scope.allProjects = true;

    if($scope.companyDashProjects && !refresh) {
      $scope.getActiveAndClosedProjectsNumber($scope.companyDashProjects);
    }
    else {
      apiSrvc.getData('appDemo1GetDashboardCompanyProjects').then(function(response){
        $scope.companyDashProjects = response.data;
        $scope.closeProjectEngagmentDashList = false;
        var ActProj = [];
        var ClosedProj = [];
        angular.forEach($scope.companyDashProjects, function(project) {
          if(project.status.gpKey === '{74699447-4fad-47f9-9f68-48a3e86b7f5e}') {ClosedProj.push(project);}
          else {ActProj.push(project);}
          $scope.numClosedProj = ClosedProj.length;
          $scope.numActProj = ActProj.length;

          angular.forEach(project.Engagements, function(engagement) {
            //NEW LABLES 1.24.19
            // Modified for new rating system 2.5.19
            engagement.label = "";
            if(engagement.consultantSubmitted) {
              if(engagement.companyRejected) {
                // Company rejected the quote
                engagement.label = "Rejected";
                engagement.labelClass = "label-danger";
              }
              else if(engagement.companyApproved) {
                //Added back in MM 4.17.19
                var notPaid = true;
                var notRate = true;
                var notCompleted = true;
                //End Added back in MM 4.17.19

                if(engagement.rated) {
                  engagement.label = "Completed";
                  engagement.labelClass = "label-default";
                }
                else {
                  var keepGoing = true;
                  if(engagement.quoteInvitationInfo.quoteType === 1) {
                    //fixed
                    angular.forEach(engagement.quoteInvitationInfo.qFix, function(fixed) {
                      if(keepGoing) {
                        if(fixed.completed) {
                          if(fixed.approved) {
                            engagement.label = "Rate";
                            engagement.labelClass = "label-primary";
                          }
                          else {
                            engagement.label = "Accept & Pay";
                            engagement.labelClass = "label-warning";
                          }
                        }
                        else {
                            engagement.label = "Approved";
                            engagement.labelClass = "label-success";
                        }
                      }
                    })
                  }
                  else if(engagement.quoteInvitationInfo.quoteType === 2) {
                    //hourly
                    angular.forEach(engagement.quoteInvitationInfo.qHours, function(hourly) {
                      //There's a bug here - notPaid is not defined ahead of time... throwing an error in the console
                      if(notPaid) {
                        if(hourly.completed) {
                          if(hourly.approved) {
                            if(hourly.rated) {
                              engagement.label = "Completed";
                              engagement.labelClass = "label-default";
                            }
                            else {
                              notRate = false;
                              var ratingNeeded = true;
                              engagement.label = "Rate";
                              engagement.labelClass = "label-primary";
                            }
                          }
                          else {
                            notPaid = false;
                            engagement.label = "Accept & Pay";
                            engagement.labelClass = "label-warning";
                          }
                        }
                        else {
                          if(notPaid && notRate) {
                            engagement.label = "Approved";
                            engagement.labelClass = "label-success";
                          }
                        }
                      }
                    })
                  }
                  else if(engagement.quoteInvitationInfo.quoteType === 3) {
                    engagement.label = "Recurring";
                    engagement.labelClass = "label-success";
                  }
                }

              }
              else {
                  // Consultant has submitted a quote
                  engagement.label = "Submitted";
                  engagement.labelClass = "label-primary";
              }
            }
            else if(engagement.consultantRejected) {
              // Consultant has rejected a quote
              engagement.label = "Rejected";
              engagement.labelClass = "label-danger";
            }
            else if(engagement.consultantOCINDARejected) {
              // Consultant did not accept the NCA or OCI
                engagement.labelClass = "label-danger";
                if(engagement.oci && !engagement.nda) {
                  engagement.label = "OCI Rejected";
                }
                else if(!engagement.oci && engagement.nda) {
                  engagement.label = "NDA Rejected";
                }
                else {
                  engagement.label = "NDA & OCI Rejected";
                }

            }
            else {
              // Company has submitted a quote but the Consultant has not responded
              engagement.label = "Waiting";
              engagement.labelClass = "label-default";
            }

          })

        })
        if(response.data.length > 0) {
          var gpKeyFirstProject = response.data[0].gpKey;
        }

        var firstProject = response.data[0];
        $scope.getProjectDetailsForDash(gpKeyFirstProject, firstProject);
        var projectList = response.data;
        $scope.projectListTableParams = new NgTableParams({}, { dataset: projectList});
        $scope.postedDateString = '/Date(1516731885000)/';
      });
    }
  };
  $scope.appDemo1GetDashboardCompanyUserProjects = function(refresh) {
    $scope.showMyProjects = true;
    $scope.poProjects = true;
    $scope.allProjects = false;
    if($scope.myDashProjects && !refresh) {
      $scope.getActiveAndClosedProjectsNumber($scope.myDashProjects);
    }
    else {
          apiSrvc.getData('appDemo1GetDashboardCompanyUserProjects').then(function(response){ //NOTE: REAL REMOTE METHOD - KEEP
          $scope.myDashProjects = response.data; //NOTE: REAL KEEP
          $scope.closeProjectEngagmentDashList = false;
          var ActProj = [];
          var ClosedProj = [];
          angular.forEach($scope.myDashProjects, function(project) {
            if(project.status.gpKey === '{74699447-4fad-47f9-9f68-48a3e86b7f5e}') {ClosedProj.push(project);}
            else {ActProj.push(project);}
            $scope.numClosedProj = ClosedProj.length;
            $scope.numActProj = ActProj.length;
            project.projectIsAllowedToClose = true; //property to check if All engagements are finished and allowed to close
            angular.forEach(project.Engagements, function(engagement) {
              engagement.label = "";
              if(engagement.consultantSubmitted) {
                if(engagement.companyRejected) {
                  engagement.label = "Rejected";
                  engagement.labelClass = "label-danger";
                }
                else if(engagement.companyApproved) {
                  if(engagement.rated) {
                    engagement.label = "Completed";
                    engagement.labelClass = "label-default";
                  }
                  else {
                    var keepGoing = true;
                    if(engagement.quoteInvitationInfo.quoteType === 1) {
                      //fixed
                      angular.forEach(engagement.quoteInvitationInfo.qFix, function(fixed) {
                        if(keepGoing) {
                          if(fixed.completed) {
                            if(fixed.approved) {
                              engagement.label = "Rate";
                              engagement.labelClass = "label-primary";
                            }
                            else {
                              engagement.label = "Accept & Pay";
                              engagement.labelClass = "label-warning";
                            }
                          }
                          else {
                              engagement.label = "Approved";
                              engagement.labelClass = "label-success";
                          }
                        }
                      })
                    }
                    else if(engagement.quoteInvitationInfo.quoteType === 2) {
                      //hourly
                      angular.forEach(engagement.quoteInvitationInfo.qHours, function(hourly) {
                        if(keepGoing) {
                          if(hourly.completed) {
                            if(hourly.approved) {
                              engagement.label = "Rate";
                              engagement.labelClass = "label-primary";
                            }
                            else {
                              engagement.label = "Accept & Pay";
                              engagement.labelClass = "label-warning";
                            }
                          }
                          else {
                              engagement.label = "Approved";
                              engagement.labelClass = "label-success";
                          }
                        }
                      })

                    }
                    else if(engagement.quoteInvitationInfo.quoteType === 3) {
                      //recurring
                      engagement.label = "Recurring";
                      engagement.labelClass = "label-success";
                    }
                  }

                }
                else {
                    engagement.label = "Submitted";
                    engagement.labelClass = "label-primary";
                }
              }
              else if(engagement.consultantRejected) {
                engagement.label = "Rejected";
                engagement.labelClass = "label-danger";
              }
              else if(engagement.consultantOCINDARejected) {
                  engagement.labelClass = "label-danger";
                  if(engagement.oci && !engagement.nda) {
                    engagement.label = "OCI Rejected";
                  }
                  else if(!engagement.oci && engagement.nda) {
                    engagement.label = "NDA Rejected";
                  }
                  else {
                    engagement.label = "NDA & OCI Rejected";
                  }

              }
              else {
                engagement.label = "Waiting";
                engagement.labelClass = "label-default";
              }

            })

          })
          if(response.data.length > 0) {
            var gpKeyFirstProject = response.data[0].gpKey;
          }

          var firstProject = response.data[0];
          $scope.getProjectDetailsForDash(gpKeyFirstProject, firstProject);
          var projectList = response.data;
          $scope.projectListTableParams = new NgTableParams({}, { dataset: projectList});
          $scope.postedDateString = '/Date(1516731885000)/';

        })
      }
    };
  $scope.getQuotesForDash = function() {
    $scope.appDemo1GetCompanyUserQuotesReceived();
  };
  $scope.getEngagementsForDash = function() {
    $scope.appDemo1GetCompanyUserEngagementsToApprove();
  };
  $scope.appDemo1GetCompanyQuotesReceived = function() {
    $scope.poProjects = false;
    $scope.allProjects = true;
    apiSrvc.getData('appDemo1GetCompanyQuotesReceived').then(function(response){
      var companyEngagementQuotes = response.data;
      var allEngagements = [];
      angular.forEach(companyEngagementQuotes, function(project) {
        angular.forEach(project.QuotesReceived, function(quote) {
          allEngagements.push(quote);
        })
        $scope.allEngagements = allEngagements;
      })
      $scope.engagementQuotes = response.data;
      $scope.allEngagementQuotes = response.data;

      var groupByTitle = function(item) {
        return item.project.title + '<small> - Posted' + $scope.getDifference(item.project.dateCreated) + ' days ago </small>';
      };
      groupByTitle.title = "Project"
      $scope.engagementQuotesTableParams = new NgTableParams({
        // group: "project.title"
        group: groupByTitle
      },
      { dataset: allEngagements,
        groupOptions: {
          isExpanded: false
        }
      });
    });
  };
  $scope.appDemo1GetCompanyUserQuotesReceived  = function() {
    $scope.poProjects = true;
    $scope.allProjects = false;
    apiSrvc.getData('appDemo1GetCompanyUserQuotesReceived').then(function(response){
      var userEngagementQuotes = response.data;
      var allEngagements = [];
      angular.forEach(userEngagementQuotes, function(project) {
        angular.forEach(project.QuotesReceived, function(quote) {
          allEngagements.push(quote);
        })
      })
      $scope.engagementQuotes = response.data;
      $scope.userEngagementQuotes = response.data;
      var groupByTitle = function(item) {
        return '<span ng-click="getProjectDetails('+item.project+')">' + item.project.title + '</span> <small> - Posted' + $scope.getDifference(item.project.dateCreated) + ' days ago </small>';
      };
      groupByTitle.title = "Project"
      $scope.engagementQuotesTableParams = new NgTableParams({
        // group: "project.title"
        group: groupByTitle
      },
      { dataset: allEngagements,
        groupOptions: {
          isExpanded: false
        }
      });
    });
  };
  $scope.appDemo1GetCompanyEngagementsToApprove = function() {
    $scope.poProjects = false;
    $scope.allProjects = true;
    apiSrvc.getData('appDemo1GetCompanyEngagementsToApprove').then(function(response){
      var companyEngagementsToApprove = response.data;
      var allEngagements = [];
      angular.forEach(companyEngagementsToApprove, function(project) {
        angular.forEach(project.EngagementsToApprove, function(engagement) {
          allEngagements.push(engagement);
        })
      })
      $scope.allEngagementsToApprove = response.data;
      $scope.engagementsToApproveTableParams = new NgTableParams({
        group: "project.title"
      },
      { dataset: allEngagements,
        groupOptions: {
          isExpanded: false
        }
      });
    });
  };
  $scope.appDemo1GetCompanyUserEngagementsToApprove  = function() {
    $scope.poProjects = true;
    $scope.allProjects = false;
    apiSrvc.getData('appDemo1GetCompanyUserEngagementsToApprove').then(function(response){
      var userEngagementToApprove = response.data;
      var allEngagements = [];
      angular.forEach(userEngagementToApprove, function(project) {
        angular.forEach(project.EngagementsToApprove, function(engagement) {
          allEngagements.push(engagement);
        })
      })
      $scope.userEngagementsToApprove = response.data;
      $scope.engagementsToApproveTableParams = new NgTableParams({
        group: "project.title"
      },
      { dataset: allEngagements,
        groupOptions: {
          isExpanded: false
        }
      });
    });
  };
  $scope.getDifference = function(postedDateString) {
    var postedDate = new Date(postedDateString.match(/\d+/) * 1);
    var postedDay = postedDate.getTime();
    var todaysDate = new Date();
    var today = todaysDate.getTime();
    var oneDay = 24*60*60*1000;
    var daysAgo = Math.round(Math.abs((todaysDate.getTime() - postedDate.getTime())/(oneDay)));
    return daysAgo;


  };
  $scope.appDemo1GetCategories = function() {
    apiSrvc.getData('appDemo1GetCategories').then(function(response){
      $scope.categories = response.data;
    });
  };
  $scope.appDemo1GetMobileCarriers = function() {
    apiSrvc.getData('appDemo1GetMobileCarriers').then(function(response){
      $scope.mobileCarriers = response.data;
    });
  };
  $scope.appDemo1GetUserProfile = function(gpKey) {
    apiSrvc.getData('appDemo1GetUserProfile&gpKey='+gpKey).then(function(response){
      $scope.profileInfo = response.data;
    });
  };

/************************************************************************************************************/
/********************************************** Categories **********************************************/
/************************************************************************************************************/
  $scope.showSubCategories = false;
  $scope.addSelectedSubCategories = function() {
    var selectedItems = $filter('filter')($scope.subCategories, { checked: true });
    angular.forEach($scope.subCategories, function (value, index) {
      $scope.selectedItems = selectedItems;
    });
  };
  $scope.removeSubCategoryItem = function(index, item) {
    $scope.selectedItems.splice(index, 1);
    item.checked = false;
  };

/************************************************************************************************************/
/************************************************* FILE UPLOAD **********************************************/
/************************************************************************************************************/
  $scope.uploadFiles = function(file, field, event) {
    if(event && event.currentTarget && event.currentTarget.files && event.currentTarget.files[0]) {
      $scope.cleanFileSelect(event);
      $scope.handleFileSelect(event);
    }
  };
  $scope.imageUrl = '/images/app1url_Logo_Sm.png';
  $scope.handleFileSelect = function(evt) {
      var file = evt.currentTarget.files[0];
      var reader = new FileReader();
      reader.onload = function (evt) {
          $scope.$apply(function($scope){
              $scope.imageUrl=evt.target.result;
              $('.imgCropper-image').attr('src', evt.target.result);
          });
      };
      reader.readAsDataURL(file);
  };
  $scope.cleanFileSelect = function(evt) {
    $scope.imageUrl = null;
    angular.element(document.querySelector('#profilePhoto')).value = "";
  };
  $scope.updateProfile = function(profileInfo, image) {
    if(profileInfo.password) {
      var jsonDataObject = {
        firstName: profileInfo.firstName,
        lastName: profileInfo.lastName,
        email: profileInfo.email,
        password: profileInfo.password,
        generatePassword: 0,
        mobileCarrier: profileInfo.mobileCarrier,
        phone: profileInfo.phone,
        mobilePhone: profileInfo.mobilePhone,
        allowTextNotifications: profileInfo.allowTextNotifications,
        gpKey: profileInfo.gpKey
      }
    }
    else {
      var jsonDataObject = {
        firstName: profileInfo.firstName,
        lastName: profileInfo.lastName,
        email: profileInfo.email,
        generatePassword: 0,
        mobileCarrier: profileInfo.mobileCarrier,
        phone: profileInfo.phone,
        mobilePhone: profileInfo.mobilePhone,
        allowTextNotifications: profileInfo.allowTextNotifications,
        gpKey: profileInfo.gpKey
      }
    }

    if ((profileInfo != null) && (image != null)) {
      upload({
          url: __env.apiUrl+'/index.asp?remotemethodaddon=appDemo1SetUserProfile&RequestBinary=true',
          method: 'POST',
          data : {
            jsonData : JSON.stringify(jsonDataObject),
            imageFilename: image
          }
        }).then(function(response) {
          $mdToast.show({
            hideDelay   : false,
            position    : 'bottom',
            parent : $document[0].querySelector('#editMyProfile'),
            scope:$scope,
            preserveScope:true,
            controller  : userEditFormToastCtrl,
            template :  '<md-toast><div class="md-toast-text flex">Your info has been updated and saved!</div><div class="md-toast-text "><md-button class="md-highlight" ng-click="closeUserEditToast()">Ok</md-button></div></md-toast>'
          });
         function userEditFormToastCtrl($scope, $rootScope, apiSrvc, commonFnSrvc, $mdDialog, $mdToast) {
           $scope.closeUserEditToast = function() {$mdToast.hide()}
         }
        });
    }
    else if ((profileInfo != null) && (image = 'undefined')) {
      upload({
          url: __env.apiUrl+'/index.asp?remotemethodaddon=appDemo1SetUserProfile&RequestBinary=true',
          method: 'POST',
          data : {
            jsonData : JSON.stringify(jsonDataObject),
          }
        }).then(function(response) {
          $mdToast.show({
            hideDelay   : false,
            position    : 'bottom',
            parent : $document[0].querySelector('#editMyProfile'),
            scope:$scope,
            preserveScope:true,
            controller  : userEditFormToastCtrl,
            template :  '<md-toast><div class="md-toast-text flex">Your info has been updated and saved!</div><div class="md-toast-text "><md-button class="md-highlight" ng-click="closeUserEditToast()">Ok</md-button></div></md-toast>'
          });
         function userEditFormToastCtrl($scope, $rootScope, apiSrvc, commonFnSrvc, $mdDialog, $mdToast) {
           $scope.closeUserEditToast = function() {$mdToast.hide()}
         }
        });
    }
  };

/************************************************************************************************************/
/************************************************** LINKS ***************************************************/
/************************************************************************************************************/
  $scope.goToDashboard = function() {$state.go('company');};
  $scope.goToMyAccount = function() {$state.go('myAccount');};
  $scope.goToMyProfile = function() {$state.go('myProfile');};
  $scope.goToMyProjects = function() {$state.go('myProjects');};
  $scope.goToContractsSearch = function() {$state.go('contractsSearch');};
  $scope.goToTrendingOpportunities = function() {$state.go('trendingOpportunities');};
  $scope.goToResources = function() {$state.go('resources');};
  $scope.goToPostAProject = function() {$state.go('postProject');};
  $scope.goToFindExperts = function() {$state.go('findExperts');};
  $scope.goToAwardProject = function() {$state.go('awardProject');};
  $scope.goToManageProject = function() {$state.go('manageProject');};
  $scope.goToVIP = function() {$state.go('VIP');};
  $scope.goToBench = function() {$state.go('bench');};

/**********************************************************************************************************/
/************************************************** MY PROJECTS *******************************************/
/**********************************************************************************************************/

/*********************************************** Filter *******************************************/
  $scope.statusFilter = '';
  $scope.filterStatus = function(status) {
    if(status) {
      $scope.statusFilter = status.gpKey;
    }
    else {
      $scope.statusFilter = '';
    }
  };

/**********************************************************************************************************/
/************************************************** Get Details *******************************************/
/**********************************************************************************************************/
  $scope.goToProjectDetails = function(project) {
    if(project.status.gpKey === '{79839C99-B83A-4420-A867-10ACF3BBDAB5}') {
      $state.go('projectDetails', {id: project.gpKey, projectParams: project,  selectedProgressTab: 1});
    }
    else if(project.status.gpKey === '{A40E44D2-332E-4D01-9039-28E52B5193FB}') {
      $state.go('projectDetails', {id: project.gpKey, projectParams: project,  selectedProgressTab: 2});
    }
    else if(project.status.gpKey === '{74699447-4fad-47f9-9f68-48a3e86b7f5e}') {
      $state.go('projectDetails', {id: project.gpKey, projectParams: project,  selectedProgressTab: 3});
    }
    else {
      $state.go('projectDetails', {id: project.gpKey, projectParams: project,  selectedProgressTab: 0});
    }
  };
  $scope.getGpKey = function(gpKey) {
    $scope.projectGpKey = gpKey;
    passDataSrvc.currentProject.gpKey = gpKey;
  };
  $scope.goToSubmittedQuotes = function(project, tab) {
    $state.go('projectDetails', {id: project.gpKey, projectParams: project, selectedProgressTab: tab});
  };

/**********************************************************************************************************/
/***************************************** Get Details from Dash List *************************************/
/**********************************************************************************************************/
// NOTE: Use this function to get project detais from dashboard?
  $scope.getProjectDetailsFromDashList = function(project) {};
  $scope.goToSubmittedQuotes = function(project, tab) {
    $state.go('projectDetails', {id: project.gpKey, projectParams: project, selectedProgressTab: tab});
  };

/**********************************************************************************************************/
/************************************************** JQUERY ************************************************/
/**********************************************************************************************************/
/*********************************** Toggle Side Menu **********************************/
  $scope.toggleMenu = function() {
    var offCanvas = angular.element( document.querySelector( '#offCanvasRow' ) );
    if(offCanvas.hasClass('active')) {
      offCanvas.removeClass('active');
    }
    else {
      offCanvas.addClass('active');
    }
  };

/*********************************** Star Rating **********************************/
  $scope.star = function(starValue) {
      $("#input-star").rating({displayOnly: true, step: 0.5});
      $('#input-star').rating('update', starValue);
  };

/************************************************************************************************************/
/********************************************** Modal/Dialogs ***********************************************/
/************************************************************************************************************/
  $scope.showPostProjectModal= function(ev) {
    $rootScope.newProjectPosted = false;
    $mdDialog.show({
      controller: postProjectModalCtrl,
      templateUrl: '/views/company/postAProject/postAProjectModal.html',
      parent: angular.element(document.querySelector('#companyDashboard')),
      locals: {
           userInfoData: $scope.userInfo
         },
      targetEvent: ev,
      clickOutsideToClose:true,
      scope: $scope,
      preserveScope: true
    })
    .finally(function() {
      if($rootScope.newProjectPosted ) {
          $state.go('projectDetails', {id: $rootScope.newProjectDetailsFromModal.gpKey, projectParams: $rootScope.newProjectDetailsFromModal,  selectedProgressTab: 1});
      }
    });
  };
  $scope.openReplyModal = function(project) {
    $scope.project = project;
    $mdDialog.show({
      controller: replyMsgCtrl,
      templateUrl: '/views/company/dashboard/systemNotifications/replyModal.html',
      clickOutsideToClose:true,
      parent: angular.element(document.querySelector('.gp-dashWrapper')),
      locals: {
           projectData: $scope.project,
           userInfoData: $scope.userInfo
         }
    });
  };

  /****************************************** OPEN CLOSE PANELS **************************/
  $scope.openCDP = true;
  $scope.openCompanyDashProjects = function() {$scope.openCDP = true;};
  $scope.closeCompanyDashProjects = function() {$scope.openCDP = false;};
  //
  $scope.openCDE = false;
  $scope.openCompanyDashEngagements = function() {
    $scope.openCDE = true;

    $scope.appDemo1GetUserNotifications(); //added refactoring 7.18
  };
  $scope.closeCompanyDashEngagements = function() {$scope.openCDE = false;};
  //
  $scope.openCompanyDashNews = function() {$scope.openCDN = true;};
  $scope.closeCompanyDashNews = function() {$scope.openCDN = false;};
  //
  /***************************** DASHBOARD ENGAGEMENT MODALS ****************************/
  $scope.showTrue = false; //for testing
  $scope.openEngagementModal = function(ev, en, ui) {
    $scope.showTrue = false; //for testing
    if(en.companyApproved) {
      $scope.showEngagementsToApproveModal(ev, en, ui);
    }
    else if (!en.consultantSubmitted) {
      console.log('do nothing');
    }
    else {
      $scope.showQuoteReviewModal(ev, en, ui);
    }
  };

  $scope.openEngagmentModalFromNotification = function(ev, enGpKey, ui) {
    apiSrvc.getData('appDemo1GetConsultantEngagement&gpkey='+enGpKey).then(function(response){
      console.log(response.data);
      var en = response.data;
      $scope.openEngagementModal(ev, en, ui);
    });

  };
  $scope.goToProjectFromNotification = function(ev, projGpKey, ui) {
    apiSrvc.getData('appDemo1GetProjectDetails&gpkey=' + projGpKey).then(function(response){
      $scope.projectDetails = response.data;
      if($scope.projectDetails.exposure === 3) {
        $scope.projectDetails.exposure = 1;
      }
      $scope.goToProjectDetails($scope.projectDetails);
    });
  };

  //////////////////// Show Review Quote Details Modal  ////////////////////////

  $scope.showQuoteReviewModal = function(ev, qd, ui) {
    $rootScope.approveToast = false;
    $rootScope.rejectToast = false;
    var addNewAP = {name: "Add New AP", guid: "0", addNew: true};
    apiSrvc.getData('appDemo1GetAccountStatusInfo').then(function(response) {
      console.log('showQuoteReviewModal');
      $scope.accountInfo = response.data;
      $mdDialog.show({
        controller: quoteReviewModalCtrl,
        templateUrl: '/views/company/projectDetails/reviewQuotes/quoteReviewModal.html',
        parent: angular.element(document.querySelector('body')),
        targetEvent: ev,
        clickOutsideToClose:false,
        scope:$scope,
        preserveScope:true,
        locals: {
          quoteDetails: qd,
          userInfo: ui,
          // companyUsers: $scope.companyUsers,
          accountInfoData : $scope.accountInfo,
          envURL: $scope.envURL
           },
        onRemoving: function (event, removePromise) {
           if($rootScope.approveToast) {
             qd.companyApproved = true;
             $mdToast.show(
               // $mdToast.simple({parent : $document[0].querySelector('#gp-QuotesPanel')})
              $mdToast.simple({parent : $document[0].querySelector('#appBody')})
                .textContent('You have approved this offer!')
                .hideDelay(3000)
                .theme("warning-toast")
                .position('top right')
            );
           }
           if($rootScope.rejectToast) {
             qd.companyRejected = true;
             $mdToast.show(
              $mdToast.simple({parent : $document[0].querySelector('#appBody')})
                .textContent('You have rejected this offer')
                .hideDelay(false)
                .position('top right')
                .theme("warning-toast")
                .action('Ok')
            );
           }

         }
      });
    });
  };

  //////////////////// Show Review Quote Details Modal  ////////////////////////
  $scope.showEngagementsToApproveModal = function(ev, ed, ui) {
    $mdDialog.show({
      controller: engagementsToApproveModalCtrl,
      templateUrl: 'views/company/projectDetails/manageEngagements/engagementsToApproveModal.html',
      parent: angular.element(document.querySelector('body')),
      targetEvent: ev,
      clickOutsideToClose:true,
      scope:$scope,
      preserveScope:true,
      locals: {
        userInfo: ui,
        engagementDetails: ed,
        accountInfoData : $scope.accountInfo,
        envURL: $scope.envURL,
        planInformation: $scope.planInformation
      },
      onRemoving: function (event, removePromise) {
        // alert('event');
        $scope.showTrue = true; //for testing
        if($rootScope.openEIModal) {
          $scope.showEngagementInviteModal(event, ed);
        }
        ed.actionNeeded = false;
        ed.ratingNeeded = false;
        ed.tasks = $scope.engagementDetails.tasks;
        ed.quoteInvitationInfo.qFix = $scope.engagementDetails.quoteInvitationInfo.qFix;
        //
        if($scope.engagementDetails.quoteInvitationInfo.quoteType==0){
          // Before Quote Invite
          angular.forEach(ed.tasks, function(task) {
            if(task.completed && !task.approved) {
              ed.actionNeeded = true;
            }
            if(task.completed && task.approved && !task.rated) {
              ed.ratingNeeded = true;
            }
          })
        } else if($scope.engagementDetails.quoteInvitationInfo.quoteType==1) {
          // After Quote Invite
            // Fixed
            angular.forEach($scope.engagementDetails.quoteInvitationInfo.qFix, function(task) {
              if(task.completed && !task.approved) {
                ed.actionNeeded = true;
              }
              if(task.completed && task.approved && !task.rated) {
                ed.ratingNeeded = true;
              }
            })
            //
        } else if($scope.engagementDetails.quoteInvitationInfo.quoteType==2) {
          // After Quote Invite
          // Hourly
          angular.forEach($scope.engagementDetails.quoteInvitationInfo.qHours, function(task) {
            if(task.completed && !task.approved) {
              ed.actionNeeded = true;
            }
            if(task.completed && task.approved && !task.rated) {
              ed.ratingNeeded = true;
            }
          })
          //
        }  else if($scope.engagementDetails.quoteInvitationInfo.quoteType==3) {
          // After Quote Invite
          // Recurring
          if($scope.engagementDetails.quoteInvitationInfo.qRecurring.completed && !$scope.engagementDetails.quoteInvitationInfo.qRecurring.approved) {
            ed.actionNeeded = true;
          }
          if($scope.engagementDetails.quoteInvitationInfo.qRecurring.completed && $scope.engagementDetails.quoteInvitationInfo.qRecurring.approved && !$scope.engagementDetails.quoteInvitationInfo.qRecurring.rated) {
            ed.ratingNeeded = true;
          }
          //
        }
        //
      }
    });
  };


}); // END of CONTROLLER
