app.controller('approvedProjectsCtrl', function($rootScope, $scope, $state, $stateParams, apiSrvc, commonFnSrvc, NgTableParams, Upload, upload, $filter, blockUI, $http, $mdDialog, textAngularManager, $document, $mdToast, $location, authSrvc, envSrvc, config) {

$scope.initAP = function() {
}

  $scope.appDemo1GetConsultantApprovedProjects = function() {
    var newProjects = [];
    apiSrvc.getData('appDemo1GetConsultantApprovedProjects').then(function(response){
      $scope.approvedProjectsList = response.data;
      $rootScope.approvedProjectsList = response.data;
      if($rootScope.openProjectsAccordion) {
         $scope.openCSN = true;
      }
    });
  }
  $scope.initializeCollapse = function() {
    $('.collapsible').collapsible();
  }

  $scope.appDemo1SetConsultantEngagementTask = function(task, parentParentIndex, parentIndex, index) {
    if(task.hoursCompleted === 0) {
      $mdToast.show(
        $mdToast.simple({parent : $document[0].querySelector('#taskToastContainer_'+parentParentIndex+ ' #task_'+index)})
         .textContent('Please enter your completed hours for this task')
         .hideDelay(3000)
         .theme("warning-toast")
         .position('top')
     );
    }

    else if(task.itemizedExpenses.length > 0 ) {
      var keepGoing = true;
      angular.forEach(task.itemizedExpenses, function(item) {
        if(keepGoing) {
          if(!item.description) {
            $mdToast.show(
             $mdToast.simple({parent : $document[0].querySelector('#taskToastContainer_'+parentIndex+ ' #task_'+index)})
               .textContent('Please enter a description for your itemized expense.')
               .hideDelay(3000)
               .theme("warning-toast")
               .position('top')
            );
            keepGoing = false;
          }
          else if(!item.amount) {
            $mdToast.show(
             $mdToast.simple({parent : $document[0].querySelector('#taskToastContainer_'+parentIndex+ ' #task_'+index)})
               .textContent('Please enter an amount for your itemized expense')
               .hideDelay(3000)
               .theme("warning-toast")
               .position('top')
            );
            keepGoing = false;
          }
        }
      })
      if(keepGoing) {
        params = {
          gpKey: task.gpKey,
          hoursCompleted: task.hoursCompleted,
          itemizedExpenses : task.itemizedExpenses
        }
        apiSrvc.sendPostData('appDemo1SetConsultantEngagementTask', params).then(function(response) {
          task.completed = response.data.completed;
        })
          return task;
      }
    }
    else {
      params = {
        gpKey: task.gpKey,
        hoursCompleted: task.hoursCompleted,
        itemizedExpenses : task.itemizedExpenses
      }
      apiSrvc.sendPostData('appDemo1SetConsultantEngagementTask', params).then(function(response) {
        task.completed = response.data.completed;
      })
        return task;
    }
  }

  //// TODO
  $scope.appDemo1SetConsultantEngagementFixedTask = function(task, parentParentIndex, parentIndex, index) {
    params = {
      gpKey: task.gpKey,
      itemizedExpenses : angular.fromJson(angular.toJson(task.itemizedExpenses))
    };
    apiSrvc.sendPostData('appDemo1SetConsultantEngagementFixed', params).then(function(response) {
      task.completed = response.data.completed;
      return task;
    })
 }


  // *********************************
  $scope.appDemo1SetConsultantEngagementHourlyTask = function(task, parentParentIndex, parentIndex, index) {
    if(task.hoursCompleted == 0) {
      $mdToast.show(
        $mdToast.simple({parent : $document[0].querySelector('#taskToastContainerHourly_'+parentParentIndex+ ' #taskHourly_'+index)})
         .textContent('Please enter your completed hours for this task')
         .hideDelay(3000)
         .theme("warning-toast")
         .position('top')
     );
    }

    else if(task.itemizedExpenses.length > 0 ) {
      var keepGoing = true;
      angular.forEach(task.itemizedExpenses, function(item) {
        if(keepGoing) {
          if(!item.description) {
            $mdToast.show(
             $mdToast.simple({parent : $document[0].querySelector('#taskToastContainerHourly_'+parentIndex+ ' #taskHourly_'+index)})
               .textContent('Please enter a description for your itemized expense.')
               .hideDelay(3000)
               .theme("warning-toast")
               .position('top')
            );
            keepGoing = false;
          }
          else if(!item.amount) {
            $mdToast.show(
             $mdToast.simple({parent : $document[0].querySelector('#taskToastContainerHourly_'+parentIndex+ ' #taskHourly_'+index)})
               .textContent('Please enter an amount for your itemized expense')
               .hideDelay(3000)
               .theme("warning-toast")
               .position('top')
            );
            keepGoing = false;
          }
        }
      })
      if(keepGoing) {
        params = {
          gpKey: task.gpKey,
          hoursCompleted: task.hoursCompleted,
          itemizedExpenses : angular.fromJson(angular.toJson(task.itemizedExpenses))
        }
        apiSrvc.sendPostData('appDemo1SetConsultantEngagementHourly', params).then(function(response) {
          task.completed = response.data.completed;
        })
          return task;
      }
    }
    else {
      params = {
        gpKey: task.gpKey,
        hoursCompleted: task.hoursCompleted,
        itemizedExpenses : angular.fromJson(angular.toJson(task.itemizedExpenses))
      }
      apiSrvc.sendPostData('appDemo1SetConsultantEngagementHourly', params).then(function(response) {
        task.completed = response.data.completed;
      })
        return task;
    }
  }
  // *********************************

  $scope.appDemo1SetConsultantEngagementRecurringTask = function(task, parentParentIndex, parentIndex, index) {
    params = {
      gpKey: task.gpKey,
      itemizedExpenses : angular.fromJson(angular.toJson(task.itemizedExpenses))
    };
    apiSrvc.sendPostData('appDemo1SetConsultantEngagementRecurring', params).then(function(response) {
      task.completed = response.data.completed;
      return task;
    })
 }

  ////

  $scope.consultantCompletedEngagements = false;
  //
  $scope.showCompletedEngagements = function() {
    $scope.consultantCompletedEngagements = true;
  }
  $scope.showActiveEngagements = function() {
    $scope.consultantCompletedEngagements = false;
  }

  $scope.addItemExpense = function(task, parentParentIndex, parentIndex, index) {
    if(task.itemizedExpenses.length === 10) {
      $mdToast.show(
       $mdToast.simple({parent : $document[0].querySelector('#taskToastContainer_'+parentParentIndex+ ' #task_'+index)})
         .textContent('Maximum amount of items entered')
         .hideDelay(3000)
         .theme("warning-toast")
         // .position('bottom')
     );
    }
    else {
      var expenseObj = {description: null, amount: null};
      task.itemizedExpenses.push(expenseObj);
    }
  }

  $scope.addItemExpenseFixed = function(task, parentParentIndex, parentIndex, index) {
    if(task.itemizedExpenses.length === 10) {
      $mdToast.show(
       $mdToast.simple({parent : $document[0].querySelector('#taskToastContainerFixed_'+parentParentIndex+ ' #taskFixed_'+index)})
         .textContent('Maximum amount of items entered')
         .hideDelay(3000)
         .theme("warning-toast")
         // .position('bottom')
     );
    }
    else {
      var expenseObj = {description: null, amount: null};
      task.itemizedExpenses.push(expenseObj);
    }
  }

  $scope.addItemExpenseHourly = function(task, parentParentIndex, parentIndex, index) {
    if(task.itemizedExpenses.length === 10) {
      $mdToast.show(
       $mdToast.simple({parent : $document[0].querySelector('#taskToastContainerHourly_'+parentParentIndex+ ' #taskHourly_'+index)})
         .textContent('Maximum amount of items entered')
         .hideDelay(3000)
         .theme("warning-toast")
         // .position('bottom')
     );
    }
    else {
      var expenseObj = {description: null, amount: null};
      task.itemizedExpenses.push(expenseObj);
    }
  }

  $scope.addItemExpenseRecurring = function(task, parentParentIndex, parentIndex, index) {
    if(task.itemizedExpenses.length === 10) {
      $mdToast.show(
       $mdToast.simple({parent : $document[0].querySelector('#taskToastContainerRecurring_'+parentParentIndex+ ' #taskRecurring_'+index)})
         .textContent('Maximum amount of items entered')
         .hideDelay(3000)
         .theme("warning-toast")
         // .position('bottom')
     );
    }
    else {
      var expenseObj = {description: null, amount: null};
      task.itemizedExpenses.push(expenseObj);
    }
  }


  $scope.removeItemExpense = function(task, index) {
    task.itemizedExpenses.splice(index, 1);
  }

  $scope.initAP();
});
