app.service('apiSrvc', function ($http, $location) {
    // Enable cross domain calls
    $http.defaults.useXDomain = true;

    delete $http.defaults.headers.common['X-Requested-With'];

  	//*****************************
    this.getData = function(addonName,queryString) {
  		if (queryString){
        queryString = '&' + queryString;
  		} else {
  			queryString = "";
  		}
  		return $http.get(__env.apiUrl+'/index.asp?remotemethodaddon='+addonName + queryString)
  		.then( function(result){
  			return result.data
  		}, function(error) {
  			console.error( 'Error: getData callback' );
  		})
  	}
  	//*****************************
  this.sendPostData = function(addonName,jsonDataObject) {
    var objectToPost = angular.toJson(jsonDataObject);
    var jsonDataObject = angular.fromJson(objectToPost);
    return $http.post(__env.apiUrl+'/index.asp?remotemethodaddon=' + addonName, { jsonData : JSON.stringify(jsonDataObject) } )
  		.then( function(result){
  			console.debug( 'return Post Data OK' );
  			return result.data
  		}, function(error) {
  			console.error("Error: sendPostData callback");
  		})
  	}
    //*****************************
  this.postFullJson = function(addonName,jsonDataObject) {
    return $http.post(__env.apiUrl+'/index.asp?remotemethodaddon=' + addonName, jsonDataObject )
      .then( function(result){
        console.debug( 'return Post Data OK' );
        return result.data
      }, function(error) {
        console.error("Error: sendPostData callback");
      })
    }

 });
