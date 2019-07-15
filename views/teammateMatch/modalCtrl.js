function modalCtrl($scope, $rootScope, apiSrvc, commonFnSrvc, $mdDialog, $timeout, $window, result) {
  var NDA_LINK = "http://example.org/";
  $scope.isLoading = false;
  $scope.messageSent = false;
  $scope.result = result;
  $scope.hide = function() {$mdDialog.hide();};
  $scope.cancel = function() {$mdDialog.cancel();};
  $scope.openNDA = function() {
    $window.open(NDA_LINK);
  };
  $scope.send = function() {
    function onTimeout() {
        $scope.isLoading = false;
        $scope.messageSent = true;
    }

    $timeout(onTimeout, 1000);
  }
}

function modalInviteCtrl($scope, $rootScope, apiSrvc, commonFnSrvc, $mdDialog, $timeout, $window, onSigned, onRejected) {
    function Account(name, company, email, referralCode){
        this.name=name;
        this.company=company;
        this.email=email;
        this.referralCode=referralCode;
    }
    $scope.isLoading = false;
    $scope.formSubmitted = false;
    $scope.account = new Account("exmaple 123", "company test", "test@example.org", "REF-123");
    $scope.login = {
        password: "",
        confirmPassword: ""
    };
    $scope.values = {
        agreeToNDA: false,
        agreeToTerms: false
    };
    $scope.hide = function() {
        $mdDialog.hide();
    };
    $scope.cancel = function() {
        $mdDialog.cancel();
        onRejected();
    };
    $scope.submit = function() {
        function onTimeout() {
            $scope.isLoading = false;
            $scope.formSubmitted = true;
            onSigned();
            $scope.hide();
        }

        $timeout(onTimeout, 1000);
    }
}
