'use strict';

function tabsCtrl($scope, $element, $rootScope, bibleService) {
    $scope.bible = bibleService;
    $scope.selectedPane;
    var panes = $scope.panes = [];
    $scope.select = function (pane) {
        angular.forEach(panes, function (pane) {
            pane.selected = false;
        });
        pane.selected = true;
        $rootScope.$broadcast('tabSelected', pane.title);
    }
    this.addPane = function (pane) {
        if (panes.length == 0) $scope.select(pane);
        panes.push(pane);
    }
}
