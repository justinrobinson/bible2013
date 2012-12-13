'use strict';

bible2012App
.directive('menu', function($log, $location, config, utilities, $rootScope) {
    return {
        restrict: 'A',
        template: '<ul ng-transclude><li ng-repeat="i in menuItems" ng-class="{on:i==selected}" id="sectionC_menu_{{i}}"><a ng-click="click(i)"><span></span>{{i}}</a></li></ul>',
        replace: true,
        transclude: true,
        controller: function($scope, $element, $attrs, $routeParams) {
        },
        link: function(scope, element, attrs) {
            scope.$on('menuClick', function(e, pane) {
                switch(config.currentMenuPane) {
                case 'reading-plan': $location.path('/reading-plan/' + config.planId + '/' + config.day); break;
                case 'bible': $location.path('/bible/' + utilities.getVersionKeyFromNumber(config.version) + '/' + config.book + '/' + config.sc); break;
                case 'comment': $rootScope.$broadcast('commentButtonClicked');
            }});
        }
    };
}).
directive('panes', function($log, config, utilities) {
    return {
        restrict: 'A',
        template: '<div class="panes" ng-transclude></div>',
        transclude: true,
        replace: true,
        scope: true,
        link: function(scope, element, attrs) {
            scope.changePane = function(pane) {
                angular.element('#' + pane + '_pane').show().promise().done(function() {
                    element.animate({left:-angular.element('#' + pane + '_pane').position().left}).promise().done(function() {
                        angular.element('#' + pane + '_pane').nextAll('.pane').each(function(key, val) {
                            angular.element(val).hide();
                        });
                    });
                });    
            };
            scope.$on('menuClick', function(e, pane) {
                scope.changePane(pane);
            });
            scope.$on('paneHomeClick', function(e, pane) {
                scope.changePane(pane);
            });
            scope.$on('search.update', function() {
                scope.changePane('search');
            });
        },
        controller: function($rootScope, $scope, $element, $attrs) {
            $element.find('#' + config.currentMenuPane + '_pane').addClass('on');
            $scope.click = function(pane) {
                config.currentMenuPane = pane;
                $rootScope.$broadcast('paneHomeClick', pane);
            };
            $scope.$on('$routeChangeSuccess', function(scope, next, current) {
                config.currentMenuPane = utilities.getCurrentHashLocation();
                $rootScope.$broadcast('paneHomeClick', config.currentMenuPane);
            });
        }
    };
}).
directive('pane', function(config) {
    return {
        restrict: 'A',
        require: '^panes',
        transclude: true,
        replace: true,
        scope: {title:'@title',pane:'@pane'},
        template: '<div class="pane" id="{{title}}_pane" ng-transclude><a class="home" href="" ng-click="click(\'bible\')">Home</a><h2>{{title}}</h2></div>',
        link: function(scope, element, attrs) {
        },
        controller: function ($log, $rootScope, $scope, $element, $attrs) {
            $scope.currentMenuPane = config.currentMenuPane;
            $scope.click = function click(pane) {
                config.currentMenuPane = pane;
                $rootScope.$broadcast('paneHomeClick', pane);
            };
        }
    };
});
