app.directive('loginResponsiveHeader', function () {
    return {
        restrict: 'A', //This menas that it will be used as an attribute and NOT as an element. I don't like creating custom HTML elements
        replace: true,
        templateUrl: "/views/headers/loginResponsive.html",
        controller: ['$scope', '$filter', function ($scope, $filter) {
          // function openNav() {
          //     document.getElementById("mySidenav").style.width = "95%";
          // }
          // var sideNav =  angular.element( document.querySelector( '#mySidenav' ).style.width = "95%");
          $scope.openNav = function() {
            document.getElementById("mySidenav").style.width = "95%";
          }
          $scope.closeNav = function() {
              document.getElementById("mySidenav").style.width = "0";
          }
          // function closeNav() {
          //     document.getElementById("mySidenav").style.width = "0";
          // }
        }]
    }
});
