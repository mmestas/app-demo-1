app.filter('telephone', function(){
    return function(input) {
      var number = input || '';
      number = number.trim().replace(/[-\s\(\)]/g, '');

      if(number.length === 11) {
        var area = ['(', '+', number.substr(0,2) ,')'].join('');

        var local = [number.substr(2, 3), number.substr(5, 3), number.substr(8, 11)].join('-');

        return [area,local].join(' ')
      }

      if(number.length === 10) {
        var area = ['(', number.substr(0,3) ,')'].join('');
        var local = [number.substr(3, 3), number.substr(6, 11)].join('-');

        return [area,local].join(' ')
      }

      return number;
    };
  });
