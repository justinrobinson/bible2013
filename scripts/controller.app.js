'use strict';

bible2012App.controller('AppCtrl', function($log, $scope, $location) {
    //$scope.current = $location.path().split('/')[1];
    $scope.$on('$routeChangeSuccess', function(scope, next, current) {
        $scope.current = $location.path().split('/')[1];
    });
});
