app.directive('starRatingAfterRepeat', function() {
  // console.log('star directive');
  return function(scope, element, attrs) {
	scope.$watch('$last',function(v){
      if (v) {
        // console.log('LAST');
        scope.callLastFunction();
		    // scope.callLastFunction2();
  	  }
    });
  };

})
