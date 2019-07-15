app.filter("dateConverter", function() {
    var re = /\/Date\(([0-9]*)\)\//;
    var neg = /\/Date\(\-([0-9]*)\)\//;
    return function(x) {
      if(x) {
        var m = x.match(re);
        var n = x.match(neg);
        if( m ) return new Date(parseInt(m[1]));
        if( n ) return new Date(parseInt(-n[1]));
        else return null;

      }

    };
});

app.filter("daysLeft", function() {
  return function (dateConverter) {
    var today = new Date();
    var timeDiff = Math.abs(dateConverter.getTime() - today.getTime());//shows only the difference in time (will always be positive)
    var timeDiff2 = (dateConverter.getTime() - today.getTime());//Shows how much time is left or past due
    var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); //shows only the difference in days (will always be positive)
    var diffDays2 = Math.ceil(timeDiff2 / (1000 * 3600 * 24)); //Shows how many days are left or past due
    return diffDays2;
  }
});
