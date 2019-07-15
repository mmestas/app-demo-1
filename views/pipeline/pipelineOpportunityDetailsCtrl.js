app.controller('pipelineOpportunityDetailsCtrl', function($rootScope, $scope, $state, $stateParams, apiSrvc, commonFnSrvc, Upload, upload, $filter, blockUI, $http, $mdDialog, $location, $timeout, $q, authSrvc, envSrvc, config, $compile) {

  $scope.pipelineOpportunityInit = function() {

    var verifyActiveAcct = function(response) {
      if(response) {
        authSrvc.getUserInfoForCompanyInfo($scope);
        var oppKey = $stateParams.opportunityKey;
        $scope.oppKey = $stateParams.opportunityKey;
        $scope.appDemo1GetPipelineOpportunityDetails(oppKey);
        $scope.appDemo1GetPipelineOpportunityTasks(oppKey);
        $scope.appDemo1GetPipelineOpportunityTeamMembers(oppKey)
      }
    }
    commonFnSrvc.getAccountStatus($scope, verifyActiveAcct);
  }

  //Get Methods
  $scope.appDemo1GetPipelineSetAsideTypes = function() {
    if($scope.pipelineSetAsideTypes) {}
    else {
      apiSrvc.getData('appDemo1GetBusinessTypes').then(function(response){
        $scope.pipelineSetAsideTypes = response.data;
      })
    }
  }
  $scope.appDemo1GetOpportunitiesTypes = function() {
    if($scope.pipelineOpportunityTypes) {}
    else {
      apiSrvc.getData('appDemo1GetOpportunitiesTypes').then(function(response){
        $scope.pipelineOpportunityTypes = response.data;
      })
    }
  }
  $scope.appDemo1GetOpportunityContractTypes = function() {
    if($scope.contractTypes) {}
    else {
      apiSrvc.getData('appDemo1GetOpportunityContractTypes').then(function(response){
        $scope.contractTypes = response.data;
      })
    }
  }
  $scope.appDemo1GetPipelineAgencies = function() {
    if($scope.pipelineAgencies) {}
    else {
      apiSrvc.getData('appDemo1GetPipelineAgencies').then(function(response){
        $scope.pipelineAgencies = response.data;
      })
    }
  }
  //Stages
  $scope.appDemo1GetPipelineStages = function() {
    if($scope.pipelineStages) {
    }
    else {
      apiSrvc.getData('appDemo1GetPipelineStages').then(function(response){
        $scope.pipelineStages = response.data.companyStages;
        $scope.numberOfStages = response.data.numberOfStages;
      })
    }
  }
  $scope.appDemo1SetPipelineOpportunityStage = function(stage) {
    var stageObj = {
      opportunityKey: $scope.oppKey,
      stageKey: stage.gpKey
    }
    apiSrvc.sendPostData('appDemo1SetPipelineOpportunityStage', stageObj).then(function(response){
      $scope.pipelineOpportunityDetails.stage.name = stage.name;
    })
  }
  //Opportunity Details
  $scope.appDemo1GetPipelineOpportunityDetails = function(oppKey) {
    apiSrvc.getData('appDemo1GetPipelineOpportunityDetails&opportunityKey='+oppKey).then(function(response){
      $scope.pipelineOpportunityDetails = response.data;
      // Date defaults to Dec 30, 1899  This sets it to default to today s date if none is selected/set yet
      $scope.convertDefaultDateFields($scope.pipelineOpportunityDetails.importantDates);
      // if($scope.pipelineOpportunityDetails.importantDates.rfpDate === '/Date(-2209143600000)/') {
      //   $scope.pipelineOpportunityDetails.importantDates.rfpDate = new Date();
      //   $scope.pipelineOpportunityDetails.importantDates.rfpDate = '/Date(' + $scope.pipelineOpportunityDetails.importantDates.rfpDate.getTime() + ')/';
      // }
      // if($scope.pipelineOpportunityDetails.importantDates.draftRfpDate === '/Date(-2209143600000)/') {
      //   $scope.pipelineOpportunityDetails.importantDates.draftRfpDate = new Date();
      //   $scope.pipelineOpportunityDetails.importantDates.draftRfpDate = '/Date(' + $scope.pipelineOpportunityDetails.importantDates.draftRfpDate.getTime() + ')/';
      // }
      // if($scope.pipelineOpportunityDetails.importantDates.proposalDueDate === '/Date(-2209143600000)/') {
      //   $scope.pipelineOpportunityDetails.importantDates.proposalDueDate = new Date();
      //   $scope.pipelineOpportunityDetails.importantDates.proposalDueDate = '/Date(' + $scope.pipelineOpportunityDetails.importantDates.proposalDueDate.getTime() + ')/';
      // }
      // if($scope.pipelineOpportunityDetails.importantDates.closeDate === '/Date(-2209143600000)/') {
      //   $scope.pipelineOpportunityDetails.importantDates.closeDate = new Date();
      //   $scope.pipelineOpportunityDetails.importantDates.closeDate = '/Date(' + $scope.pipelineOpportunityDetails.importantDates.closeDate.getTime() + ')/';
      // }
    })
  }
  //Edit Opportunity Details
  $scope.appDemo1SetPipelineOpportunity = function(opportunity) {
    console.log(opportunity);
    apiSrvc.sendPostData('appDemo1SetPipelineOpportunity', opportunity).then(function(response){
        if(response.errors.length > 0) {
        }
        else {
          $scope.appDemo1GetPipelineOpportunityDetails(opportunity.gpKey);
          if($scope.editOpModalIsOpen) {
            $scope.hide();
          }
          else {

          }
        }
    })
  }

  //Solicitation
  $scope.appDemo1SetPipelineOpportunitySolicitation = function(solicitation) {
    console.log(solicitation);
    apiSrvc.sendPostData('appDemo1SetPipelineOpportunitySolicitation', solicitation).then(function(response){
      if(response.errors.length > 0) {}
      else {
        $scope.pipelineOpportunityDetails = response.data;
        $scope.convertDefaultDateFields($scope.pipelineOpportunityDetails.importantDates);
        $scope.showSolicitationEditFields = false;
      }
    })
  }
  $scope.showSolicitationEditFields = false;
  $scope.editSolicitation = function() {
    $scope.showSolicitationEditFields = true;
    $scope.appDemo1GetOpportunityContractTypes();
    $scope.appDemo1GetPipelineSetAsideTypes();
    $scope.appDemo1GetOpportunitiesTypes();
    $scope.solicitationFields = angular.copy($scope.pipelineOpportunityDetails.solicitation);
  }
  $scope.cancelEditSolicitation = function() {
    $scope.showSolicitationEditFields = false;
  }
  //Tasks
  $scope.appDemo1GetPipelineOpportunityTasks = function(oppKey) {
    apiSrvc.getData('appDemo1GetPipelineOpportunityTasks&opportunityKey='+oppKey).then(function(response){
      $scope.pipelineOpportunityTasks = response.data;
    })
  }
  $scope.appDemo1SetPipelineOpportunityTask = function(newTask) {
    if(newTask.gpKey) {
      task = newTask;
    }
    else {
      task = {
        description: newTask,
        gpKey: ''
      }
    }

    apiSrvc.sendPostData('appDemo1SetPipelineOpportunityTask&description='+task.description+'&gpKey='+task.gpKey+'&opportunityKey='+$scope.oppKey).then(function(response){
      if(response.errors.length > 0) {}
      else {
        $scope.pipelineOpportunityTasks = response.data;
        if($scope.showAddTaskField) {
          $scope.showAddTaskField = false;
        }
        if($scope.showEditExistingTask) {
          $scope.showEditExistingTask = false;
        }
      }
    })
  }
  $scope.showAddTaskField = false;
  $scope.addTask = function() {
    $scope.showAddTaskField = true;
  }
  $scope.cancelAddTask = function() {
    $scope.showAddTaskField = false;
  }
  //Editing Existing importantTasks
  $scope.showExistingTask = false;
  $scope.showAddExistingTask = function() {
    $scope.showExistingTask = true;
  }
  $scope.cancelAddExistingTask = function() {
    $scope.showExistingTask = false;
  }
  $scope.showEditExistingTask = false;
  $scope.editExistingTask = function(task, index) {
    $scope.existingTaskIndex = index;
    $scope.showEditExistingTask = true;
    $scope.editableExistingTask = angular.copy(task);
  }
  $scope.cancelEditExistingTask = function() {
    $scope.existingTaskIndex = null;
    $scope.showEditExistingTask = false;
  }
  //Dates
  $scope.appDemo1SetPipelineOpportunityImportantDates = function(dateFields) {
    var convertDateFields = angular.copy(dateFields);
    // convertDateFields.rfpDate = '/Date(' + convertDateFields.rfpDate.getTime() + ')/';
    // convertDateFields.draftRfpDate = '/Date(' + convertDateFields.draftRfpDate.getTime() + ')/';
    // convertDateFields.proposalDueDate = '/Date(' + convertDateFields.proposalDueDate.getTime() + ')/';
    // convertDateFields.closeDate = '/Date(' + convertDateFields.closeDate.getTime() + ')/';
    // console.log(convertDateFields.rfpDate);
    var importantDates = {
      rfpDate : convertDateFields.rfpDate,
      draftRfpDate : convertDateFields.draftRfpDate,
      proposalDueDate : convertDateFields.proposalDueDate,
      closeDate : convertDateFields.closeDate,
      gpKey : $scope.dateFields.gpKey

    };
    apiSrvc.sendPostData('appDemo1SetPipelineOpportunityImportantDates', importantDates).then(function(response){
      if(response.errors.length > 0) {}
      else {
        $scope.pipelineOpportunityDetails = response.data;
        $scope.convertDefaultDateFields($scope.pipelineOpportunityDetails.importantDates);
        $scope.showDateEditFields = false;
      }
    })
  }
  $scope.showDateEditFields = false;
  $scope.editDates = function() {
    $scope.showDateEditFields = true;
    $scope.dateFields = angular.copy($scope.pipelineOpportunityDetails.importantDates);
    $scope.dateFields.closeDate = $filter('dateConverter')($scope.dateFields.closeDate);
    $scope.dateFields.draftRfpDate = $filter('dateConverter')($scope.dateFields.draftRfpDate);
    $scope.dateFields.proposalDueDate = $filter('dateConverter')($scope.dateFields.proposalDueDate);
    $scope.dateFields.rfpDate = $filter('dateConverter')($scope.dateFields.rfpDate);
  }
  $scope.cancelEditDates = function() {
    $scope.showDateEditFields = false;
  }
  //Team
  $scope.appDemo1GetPipelineOpportunityTeamMembers = function(oppKey) {
    apiSrvc.getData('appDemo1GetPipelineOpportunityTeamMembers&opportunityKey='+oppKey).then(function(response){
      if(response.errors.length > 0) {}
      else {
        $scope.pipelineOpportunityTeamMembers = response.data;
      }
    })
  }
  $scope.showEditTeamMemberFields = false;
  $scope.editTeamMember = function(teamMember) {
    $scope.showAddNewTeamMemberFields = false;
    $scope.memberKey = teamMember.memberKey;
    $scope.showEditTeamMemberFields = true;
  }
  $scope.deleteTeamMember = function(teamMember) {
    console.log(teamMember);
    var teamMemberObj = {
      gpKey: teamMember.gpKey,
      memberKey: teamMember.memberKey,
    }
    apiSrvc.sendPostData('appDemo1RemovePipelineOpportunityTeamMember', teamMemberObj).then(function(response){
      if(response.errors.length > 0) {}
      else {
        console.log(response.data);
        $scope.pipelineOpportunityTeamMembers = response.data;
      }
    })
  }
  $scope.cancelEditTeamMember = function() {
    $scope.showEditTeamMemberFields = false;
    $scope.showAddNewTeamMemberFields = false;
  }
  $scope.showAddNewTeamMemberFields = false;
  $scope.addNewTeamMemberFields = function() {
    $scope.showEditTeamMemberFields = false;
    $scope.appDemo1GetCompanyUsers();
    $scope.showAddNewTeamMemberFields = true;
  }
  $scope.appDemo1GetCompanyUsers = function() {
    console.log('pipeline');

    if($scope.companyUsers) {}
    else {
      apiSrvc.getData('appDemo1GetCompanyUsers').then(function(response){
        $scope.companyUsers = response.data;
      });
    }
  }
  $scope.selectCompanyForTeam = function(selected) {
    $scope.newTeamMember = selected.teamMember;
  }
  $scope.appDemo1SetPipelineOpportunityTeamMember = function(teamMember) {
    if(teamMember.memberKey) {
      var teamMemberObj = {
        gpKey: teamMember.gpKey,
        teamRole: teamMember.teamRole,
        memberKey: teamMember.memberKey,
        allowEdit: teamMember.allowEdit
      }
    }
    else {
      var teamMemberObj = {
        gpKey: '',
        teamRole: teamMember.teamRole,
        memberKey: teamMember.gpKey,
        allowEdit: teamMember.allowEdit
      }
    }
    apiSrvc.sendPostData('appDemo1SetPipelineOpportunityTeamMember', teamMemberObj).then(function(response){
      if(response.errors.length > 0) {}
      else {
        $scope.pipelineOpportunityTeamMembers = response.data;
        $scope.showAddNewTeamMemberFields = false;
        $scope.showEditTeamMemberFields = false;
      }
    })
  }
  //Notes
  $scope.appDemo1GetPipelineOpportunityNotes = function() {
    if($scope.pipelineOpportunityNotes) {}
    else {
      apiSrvc.getData('appDemo1GetPipelineOpportunityNotes&opportunityKey='+$scope.oppKey).then(function(response){
        $scope.pipelineOpportunityNotes = response.data;
      })
    }
  }
  $scope.appDemo1SetPipelineOpportunityNote = function(noteObject) {
    if(!noteObject.gpKey) {
      noteObject.gpKey = '';
    }
    apiSrvc.sendPostData('appDemo1SetPipelineOpportunityNote&description='+noteObject.description+'&opportunityKey='+$scope.oppKey+'&gpKey='+noteObject.gpKey).then(function(response){
      if(response.errors.length > 0) {}
      else {
        $scope.pipelineOpportunityNotes = response.data;
        if($scope.showNoteField) {
          $scope.showNoteField = false;
        }
        if($scope.showEditNoteField) {
          $scope.showEditNoteField = false;
        }
        $scope.newPropspectiveNote = {};
        $scope.newPropspectiveNote.description = '';
      }
    })
  }
  $scope.newPropspectiveNote = {};
  $scope.showNoteField = false;
  $scope.showAddNoteField = function() {
    $scope.showNoteField = true;
  }
  $scope.cancelAddNoteField = function() {
    $scope.showNoteField = false;
  }
  $scope.showEditNoteField = false;
  $scope.editNote = function(note, index) {
    $scope.noteIndex = index;
    $scope.showEditNoteField = true;
    $scope.editableNote = angular.copy(note);
  }
  $scope.cancelEditNote = function() {
    $scope.noteIndex = null;
    $scope.showEditNoteField = false;
  }
  //Files
  $scope.appDemo1GetPipelineOpportunityFiles = function() {
    if($scope.pipelineOpportunityFiles && !$scope.newlySelectedFile) {}
    else {
      apiSrvc.getData('appDemo1GetPipelineOpportunityFiles&opportunityKey='+$scope.oppKey).then(function(response){
        $scope.pipelineOpportunityFiles = response.data;
        $scope.newFile = {};
        $scope.newlySelectedFile = null;
      })
    }

  }
  $scope.appDemo1SetPipelineOpportunityFile = function(file) {
    var selectedFile = '';
    if(file) {
      if(file.filename) {
        selectedFile = '';
        var filegpKey = file.gpKey;
        $scope.newlySelectedFile = null;
      }
      else {
        if($scope.newlySelectedFile) {
          selectedFile = $scope.newlySelectedFile[0];
          var filegpKey = '';
        }
        else {
          console.log('error - no file selected');
        }
      }
      upload({
          url: __env.apiUrl+'/index.asp?remotemethodaddon=appDemo1SetPipelineOpportunityFile&RequestBinary=true&opportunityKey='+$scope.oppKey+'&gpKey='+filegpKey+'&description='+file.description,
          method: 'POST',
          data : {
            documentFileName: selectedFile
          }
        }).then(function(response) {
          if(response.data.errors.length > 0) {console.log('error');}
          else {
            if($scope.newlySelectedFile) {
              $scope.appDemo1GetPipelineOpportunityFiles();
              $scope.showEditFile = false;
            }
            else {
              $scope.newlySelectedFile = null;
              $scope.selectedNewFile = null;
              $scope.newFile.fileName = '';
              $scope.newFile = {};
              $scope.showEditFile = false;
            }
          }
        });
    }
  }
  $scope.newFile = {};
  var textInput = angular.element(document.querySelector('#textInput'));
  $scope.fileNameChanged = function(e) {
    if(e.target.files[0]) {
      $scope.newFile.fileName = e.target.files[0].name;
      $scope.newlySelectedFile = e.target.files;
      //this allows it to change the name
      angular.element(document.querySelector('#textInput')).focus();
    }
    else {
      $scope.newlySelectedFile = null;
    }
  }
  $scope.showEditFile = false;
  $scope.editFile = function(file, index) {
    $scope.fileIndex = index;
    $scope.showEditFile = true;
  }
  $scope.cancelEditFile = function() {
    $scope.showEditFile = false;
  }

  //Convert default date fields
  $scope.convertDefaultDateFields = function(importantDatesObject) {
    // Date defaults to Dec 30, 1899  This sets it to default to today s date if none is selected/set yet
    if(importantDatesObject.rfpDate === '/Date(-2209143600000)/') {
      $scope.pipelineOpportunityDetails.importantDates.rfpDate = new Date();
      $scope.pipelineOpportunityDetails.importantDates.rfpDate = '/Date(' + $scope.pipelineOpportunityDetails.importantDates.rfpDate.getTime() + ')/';
    }
    if(importantDatesObject.draftRfpDate === '/Date(-2209143600000)/') {
      $scope.pipelineOpportunityDetails.importantDates.draftRfpDate = new Date();
      $scope.pipelineOpportunityDetails.importantDates.draftRfpDate = '/Date(' + $scope.pipelineOpportunityDetails.importantDates.draftRfpDate.getTime() + ')/';
    }
    if(importantDatesObject.proposalDueDate === '/Date(-2209143600000)/') {
      $scope.pipelineOpportunityDetails.importantDates.proposalDueDate = new Date();
      $scope.pipelineOpportunityDetails.importantDates.proposalDueDate = '/Date(' + $scope.pipelineOpportunityDetails.importantDates.proposalDueDate.getTime() + ')/';
    }
    if(importantDatesObject.closeDate === '/Date(-2209143600000)/') {
      $scope.pipelineOpportunityDetails.importantDates.closeDate = new Date();
      $scope.pipelineOpportunityDetails.importantDates.closeDate = '/Date(' + $scope.pipelineOpportunityDetails.importantDates.closeDate.getTime() + ')/';
    }
  }

  //Close Details and Return to the Pipeline
  $scope.closeDetails = function() {
    $state.go('pipeline');
  }

  //Edit Opportunity
  $scope.editOpModalIsOpen = false;
  $scope.openEditOppModal = function(ev, oppDetails) {
    console.log(oppDetails);
    $scope.editOpModalIsOpen = true;
    $scope.appDemo1GetOpportunityContractTypes();
    $scope.appDemo1GetPipelineAgencies();
    $scope.appDemo1GetPipelineSetAsideTypes();
    $scope.appDemo1GetOpportunitiesTypes();
    $mdDialog.show({
      controller: editOppDetailsModalCtrl,
      templateUrl: '/views/pipeline/editOppDetailsModal.html',
      parent:  angular.element(document.querySelector('#pipelineDetails')),
      targetEvent: ev,
      clickOutsideToClose:true,
      scope: $scope,
      preserveScope: true,
      locals: {
        opportunityDetails: oppDetails
      }
    });
  }
  function editOppDetailsModalCtrl($scope, $rootScope, apiSrvc, commonFnSrvc, $mdDialog, opportunityDetails) {
    $scope.opportunity = opportunityDetails;
    $scope.opportunity.closeDate = $filter('dateConverter')($scope.opportunity.importantDates.closeDate);
    $scope.opportunity.contractType = opportunityDetails.solicitation.contractType;
    $scope.opportunity.businessType = opportunityDetails.solicitation.businessType;
    $scope.opportunity.naicsCode = opportunityDetails.solicitation.naicsCode;
    $scope.cancel = function() {$mdDialog.cancel();};
    $scope.hide = function() {$mdDialog.hide();};
    // $scope.saveEditsToOpportunity = function(opportunity) {
    //   console.log(opportunity);
    //   apiSrvc.sendPostData('appDemo1SetPipelineOpportunity', opportunity).then(function(response){
    //       if(response.errors.length > 0) {
    //         $scope.updatePipeline = false;
    //       }
    //       else {
    //         $scope.updatePipeline = true;
    //         $scope.hide();
    //       }
    //   })
    // }
  }
  //Delete Opportunity
  $scope.openDeleteOppModal = function(ev) {
    $mdDialog.show({
      controller: deleteOpportunityModalCtrl,
      templateUrl: '/views/pipeline/deleteOpportunityModal.html',
      parent:  angular.element(document.querySelector('#pipelineDetails')),
      targetEvent: ev,
      clickOutsideToClose:true,
      scope: $scope,
      preserveScope: true,
      locals: {
      }
    });
  }
  function deleteOpportunityModalCtrl($scope, $rootScope, apiSrvc, commonFnSrvc, $mdDialog) {
    $scope.cancel = function() {$mdDialog.cancel();};
  }
  $scope.appDemo1RemovePipelineOpportunity = function() {
    apiSrvc.getData('appDemo1RemovePipelineOpportunity&gpKey='+$scope.oppKey).then(function(response){
      if(response.errors.length > 0) {
        $mdDialog.cancel();
        $scope.errorMsg = 'There was a problem deleting this opportunity';
      }
      else {
        $state.go('pipeline');
      }
    })
  }


}); //End of Controller
