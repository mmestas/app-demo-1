app.directive('rfUploadFile', rfUploadFile);

function rfUploadFile() {
  var directive = {
    restrict: 'E',
    templateUrl: '/views/company/projectDetails/findExperts/modals/uploadFileTemplate.html',
    link: rfUploadFileLink
  };
  return directive;
}

function rfUploadFileLink(scope, element, attrs) {
  var input = $(element[0].querySelector('#fileInput'));
  var button = $(element[0].querySelector('#uploadButton'));
  var textInput = $(element[0].querySelector('#textInput'));

  var input1 = $(element[0].querySelector('#fileInput1'));
  var button1 = $(element[0].querySelector('#uploadButton1'));
  var textInput1 = $(element[0].querySelector('#textInput1'));

  var input2 = $(element[0].querySelector('#fileInput2'));
  var button2 = $(element[0].querySelector('#uploadButton2'));
  var textInput2 = $(element[0].querySelector('#textInput2'));

  var input3 = $(element[0].querySelector('#fileInput3'));
  var button3 = $(element[0].querySelector('#uploadButton3'));
  var textInput3 = $(element[0].querySelector('#textInput3'));

  if (input.length && button.length && textInput.length) {
    button.click(function(e) {
      input.click();
    });
    textInput.click(function(e) {
      input.click();
    });
  }
  if (input1.length && button1.length && textInput1.length) {
    button1.click(function(e) {
      input1.click();
    });
    textInput1.click(function(e) {
      input1.click();
    });
  }
  if (input2.length && button2.length && textInput2.length) {
    button2.click(function(e) {
      input2.click();
    });
    textInput2.click(function(e) {
      input2.click();
    });
  }
  if (input3.length && button3.length && textInput3.length) {
    button3.click(function(e) {
      input3.click();
    });
    textInput3.click(function(e) {
      input3.click();
    });
  }

  scope.button1 = false;
  scope.button2 = false;
  scope.button3 = false;
  scope.button4 = false;

  input.on('change', function(e) {
    var files = e.target.files;
    if (files[0]) {
      scope.fileName = files[0].name;
      scope.file = files[0];
      scope.button1 = true;
    } else {
      scope.fileName = null;
    }
    scope.$apply();
  });
  input1.on('change', function(e) {
    var files = e.target.files;
    if (files[0]) {
      scope.fileName1 = files[0].name;
      scope.file1 = files[0];
      scope.button2 = true;
    } else {
      scope.fileName1 = null;
    }
    scope.$apply();
  });
  input2.on('change', function(e) {
    var files = e.target.files;
    if (files[0]) {
      scope.fileName2 = files[0].name;
      scope.file2 = files[0];
      scope.button3 = true;
    } else {
      scope.fileName2 = null;
    }
    scope.$apply();
  });
  input3.on('change', function(e) {
    var files = e.target.files;
    if (files[0]) {
      scope.fileName3 = files[0].name;
      scope.file3 = files[0];
      scope.button4 = true;
    } else {
      scope.fileName3 = null;
    }
    scope.$apply();
  });
}
