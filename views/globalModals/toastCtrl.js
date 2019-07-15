app.controller('toastCtrl', function($mdToast, $mdDialog, $document, $scope, toastMessage, toastFunction) {

    $scope.toastMessage = toastMessage;

    $scope.closeToast = function() {
      $mdToast.hide(toastFunction).then(function(result) {});
    };

});
