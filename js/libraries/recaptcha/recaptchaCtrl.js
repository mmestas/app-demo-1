app.controller('recaptchaCtrl', function ($scope, apiSrvc, commonFnSrvc, vcRecaptchaService) {
	console.log("this is your reCaptcha's controller");
	$scope.response = null;
	$scope.widgetId = null;

	$scope.model = {
		key: '6LdeSDEUAAAAAIoaEO9ZUZe_Mx95zx7Mnz2y5umZ'
	};

	$scope.setResponse = function (response) {
		$scope.response = response;
	};

	$scope.setWidgetId = function (widgetId) {
		$scope.widgetId = widgetId;
	};

	$scope.cbExpiration = function() {
		vcRecaptchaService.reload($scope.widgetId);
		$scope.response = null;
	 };

	$scope.submit = function () {

		/*
		* SERVER SIDE VALIDATION
		*/

		// *********************************************
		var AppData = {};
		AppData.response = $scope.response;

   		apiSrvc.sendPostData('appDemo1ProcessReCaptcha', AppData).then(function(response) {

			var valid = response.data;

			if (valid) {
			} else {

				// In case of a failed validation you need to reload the captcha
				// because each response can be checked just once
				vcRecaptchaService.reload($scope.widgetId);
			}


   	 	})
		.finally(function() {
			// Maybe Stop Block UI
		});
		// *********************************************

	};
});
