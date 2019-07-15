app.directive('currencyFilter', ['$filter', function ($filter) {
   return {
       require: 'ngModel',
       link: function (elem, $scope, attrs, ngModel) {

           ngModel.$formatters.push(function (val) {
               return '$' + val
           });
           ngModel.$parsers.push(function (val) {
               return val.replace(/^\$/, '')
           });
         }
       }


}])
