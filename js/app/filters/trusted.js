app.filter('trusted', function($sce) {
    return function(val) {
        return $sce.trustAsHtml(val);
    };
});
