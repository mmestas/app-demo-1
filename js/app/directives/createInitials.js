app.filter('createInitials', function() {
return function(input) {

  if(input) {
    var name = input;
    var inls = name.match(/\b\w/g) || [];
    inls = ((inls.shift() || '') + (inls.pop() || '')).toUpperCase();
    return inls;
  }

  }
});
