bible2012App.controller('SearchResultsCtrl', function($log, $scope, search) {
    $scope.$on('search.update', function(e, data) {
        $scope.results = data;
    });
});
