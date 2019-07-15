app.controller('teammateMatchInviteCtrl', function($rootScope, $scope, $state, $stateParams, apiSrvc, commonFnSrvc, Upload, upload, $filter, blockUI, $http, $mdDialog, $location, $q, $timeout, authSrvc, envSrvc, config) {
    function opportunity(avatar, link, invite, company) {
        this.avatar = avatar;
        this.link = link;
        this.invite = invite;
        this.company = company;
    }
    function Invite(avatar, setAside, contractType, naics, closeDate, solicationNum) {
        this.avatar = avatar;
        this.setAside = setAside;
        this.contractType = contractType;
        this.naics = naics;
        this.closeDate = closeDate;
        this.solicationNum = solicationNum;
    }
    function InviteAccount(name, email) {
        this.name = name;
        this.email = email;
    }

    var inviteAvatar = "https://via.placeholder.com/267x350";
    var opportunityAvatar = "https://via.placeholder.com/250x100";
    var opportunityLink = "http://example.org/";
    $scope.settings = {
        opportunityBoxDimmed: true
    };
    $scope.opportunity = new opportunity(
        opportunityAvatar,
        opportunityLink,
        new Invite(inviteAvatar, "test-set-aside", "contract-test", "example naics", "close date", "example"),
        Object.assign({},
            //invite page added content fields,
            {
               address1: "address example",
               address2: "address example",
               duns: "duns example",
               cage: "example..",
               phone: "123-XXX-TEST",
               businessType: "mock example..",
               primaryNaicsCode: "test..",
               naicsCodes: "",
               securityClearance: "",
               productAndServicesOffered: "",
               contracts: "",
               certifications: "",
               accounts: [
                    new InviteAccount("Test 123", "test@example.org"),
                    new InviteAccount("another test", "test2@example.org")
                ]

            },
            new TeammateResult("business-1", "NAICS example", "point of contact", "test@example.org", "http://example.org/")
        )
    );
    // Open the Modal //
  $scope.openModal = function(ev) {
    $mdDialog.show({
      controller: modalInviteCtrl,
      templateUrl: '/views/teammateMatch/modalInvite.html',
      parent: angular.element(document.querySelector('.gp-detailWrapper')),
      targetEvent: ev,
      clickOutsideToClose:true,
      locals: {
        opportunity: $scope.opportunity,
        onSigned: function() {
            $scope.settings.opportunityBoxDimmed = false;
        },
        onRejected: function() {
            console.log("NDA was not signed");
        }
      },
      onRemoving: function (event, removePromise) {
      }
    });
  };

    console.log("$scope.opportunity is: ", $scope.opportunity);

});
