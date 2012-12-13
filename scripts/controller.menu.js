'use strict';

bible2012App.controller('MenuCtrl', function($log, $rootScope, $scope, $routeParams, $location, config, utilities) {
    $scope.menuItems = ['bible', 'reading-plan', 'audio', 'share', 'comment', 'resources'];
    $scope.click = function(pane) {
        $scope.selected = config.currentMenuPane = pane;
        $rootScope.$broadcast('menuClick', pane); //animate slider when this is broadcast
    };
    $scope.$on('$routeChangeSuccess', function(scope, next, current) {
        $scope.selected = config.currentMenuPane;
        config.update($routeParams);
    });
});
//
