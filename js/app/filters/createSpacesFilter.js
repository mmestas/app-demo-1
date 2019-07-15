app.filter('createSpacesFilter',function(){
      return function(x) {
        if(x) {
          var m = x.replace(/\//g, ' / ');
          return m;
        }
      }
});
