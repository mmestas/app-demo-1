//********************** SERVICE For LinkedIn Auth ********************//
app.service('linkedInService', function($q) {
    this.OnLinkedInFrameworkLoad = function() {
      console.log('onlinkedin');
      var deferred = $q.defer();
      IN.User.authorize(function(){
        deferred.resolve(OnLinkedInAuth())
      });
      return deferred.promise;
    }
    function OnLinkedInAuth() {
      console.log('onlinkedInAuth');
      var deferred = $q.defer();

      IN.API.Profile("me")
      .fields([
            "date-of-birth",
            "educations:(id,schoolName,fieldOfStudy,startDate,endDate,degree)",
            "email-address",
            "firstName",
            "headline",
            "id",
            "industry",
            "lastName",
            "location:(name,country:(code))",
            "pictureUrl",
            "picture-urls::(original)",
            "positions:(company,title,summary,startDate,endDate,isCurrent)",
            "public-profile-url",
            "skills",
            "summary",
            "specialties"])
      .result(function(result){
        console.log(result);
        var profile = {
            firstname: result.values[0].firstName,
            lastname: result.values[0].lastName,
            photo: result.values[0].pictureUrl,
            headline: result.values[0].headline,
            id: result.values[0].id,
            location: result.values[0].location,
            specialties: result.values[0].specialties,
            positions: result.values[0].positions,
            publicProfileUrl: result.values[0].publicProfileUrl,
            summary: result.values[0].summary,
            educations: result.values[0].educations,
            dob: result.values[0].dateOfBirth,
            email: result.values[0].emailAddress
        }
        console.log(profile);
        deferred.resolve(profile);
      });
      return deferred.promise;
    }
});


//********************** LinkedIn SignUp function ********************//
//Define eScope
var eScope;
// onLinkedInLoad();
function onLinkedInLoad(){
  eScope.$apply(function(){
    eScope.getLinkedInData();
  })
};

//execute on logout event
function onLinkedInLogout() {
	location.reload(true);
}

//execute on login event
function onLinkedInLogin() {
	// pass user info to angular
	angular.element(document.getElementById("appBody")).scope().$apply(
		function($scope) {
			$scope.getLinkedInData();
		}
	);
}
