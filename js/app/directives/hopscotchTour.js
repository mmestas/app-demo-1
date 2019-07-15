app.directive('pipelineTour', function(HSTour) {
  return {
    restrict: 'AE',
    link: function(scope, element, attr) {
      var pipelineTourConfig = {
        id: 'angular-pipeline-tour',
          steps: [
            {
              title: 'Settings',
              content: 'Here are the settings.',
              target: 'pipelineSettings',
              placement: 'left'
            },
            {
              title: 'Settings',
              content: 'Click Here to Add an Opportunity to your pipeline.',
              target: 'addOpBtn',
              placement: 'left'
            },
            {
              title: 'My content',
              content: 'Here is where I put my content.',
              target: 'pipelineDropzones',
              placement: 'right'
            },
            {
              title: 'Opportunities',
              content: 'Drag row to reorder or click on a tile to see details and edit.',
              target: 'item_0',
              placement: 'bottom'
            }
          ]
      };

      console.log(pipelineTourConfig);
      var tour = new HSTour(pipelineTourConfig);
      tour.start();
    }
  };
});
