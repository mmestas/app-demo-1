app.filter('mask',function(){
      return function(input){
           var last=input.substring(input.length-4,input.length);
           var first=input.substring(0,input.length-4);
              first=first.replace(/[a-zA-Z0-9]/g,'X');
            var res=first+last;
            return res;
      }
});
