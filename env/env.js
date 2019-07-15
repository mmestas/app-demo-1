(function (window) {
    window.__env = window.__env || {};
    if(
      (window.origin === 'https://www.app1urlapp.com') ||
      (window.origin === 'https://app1urlapp.com') ||
      (location.origin === 'https://www.app1urlapp.com') ||
      (location.origin === 'https://app1urlapp.com')
      ){
      window.__env.apiUrl = '';
      window.__env.protocol = 'https';
      window.__env.protocolIncludeASP = false;
      window.__env.baseUrl = '';
      // Whether or not to enable debug mode
      // Setting this to false will disable console output
      window.__env.enableDebug = true;

      window.__env.pageTitle = "app1url App";

      window.__env.linkedIn = {
        apiKey: "77etqxtilgudcw",
      };
    }
    else if((window.origin === 'http://app1stagingurl.sitefpo.com') || (location.origin === 'http://app1stagingurl.sitefpo.com')) {
      window.__env.apiUrl = '//app1stagingurl.sitefpo.com';
      window.__env.protocol = 'http';
      window.__env.protocolIncludeASP = false;
      window.__env.baseUrl = '';
      // Whether or not to enable debug mode
      // Setting this to false will disable console output
      window.__env.enableDebug = true;

      window.__env.pageTitle = "app1url Staging";

      window.__env.linkedIn = {
        apiKey: "772utp34wape2e",
      };
    }
    else if((window.origin === 'http://app1testingurl.sitefpo.com') || (location.origin === 'http://app1testingurl.sitefpo.com')) {
      window.__env.apiUrl = '//app1testingurl.sitefpo.com';
      window.__env.protocol = 'http';
      window.__env.protocolIncludeASP = false;
      window.__env.baseUrl = '';
      // Whether or not to enable debug mode
      // Setting this to false will disable console output
      window.__env.enableDebug = true;

      window.__env.pageTitle = "app1url Testing";

      window.__env.linkedIn = {
        apiKey: "77hxvl6ydt985t",
      };
    }
    else if(location.hostname === 'localhost') {
      window.__env.apiUrl = '//app1stagingurl.sitefpo.com';
      window.__env.protocol = 'http';
      window.__env.protocolIncludeASP = false;
      window.__env.baseUrl = '';
      window.__env.enableDebug = true;
      window.__env.pageTitle = "app1url Staging Local";
      window.__env.linkedIn = {
        apiKey: "772utp34wape2e",
      };
    }
    else {
      //Default to production
      window.__env.apiUrl = 'https://app1urlapp.com';
      window.__env.protocol = 'https';
      window.__env.protocolIncludeASP = false;
      window.__env.baseUrl = '';
      window.__env.enableDebug = true;
      window.__env.pageTitle = "app1url App";
      window.__env.linkedIn = {
      apiKey: "77etqxtilgudcw",
      };
    }



}(this));
