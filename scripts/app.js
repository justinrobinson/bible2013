'use strict';
/**
 * This sets up the bible2012App Module and each route for various page states.
 */
var bible2012App = angular.module('bible2012App', ['ui'])
.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
        //$locationProvider.html5Mode(true); // Buggy
        $routeProvider
         .when('/reading-plan/:planId/:day', {
                templateUrl: '../bible2013/views/readingPlan.html',
                controller: 'ReadingPlanCtrl'
        })
        .when('/reading-plan/:planId/:day?p=intro', {
                templateUrl: '../bible2013/views/readingPlan.html',
                controller: 'ReadingPlanCtrl'
        })
        .when('/bible/:versionKey/:book/:sc', {
                templateUrl: '../bible2013/views/bible.html',
                controller: 'BibleCtrl'
        })
        .when('/bible/:versionKey/:book/:sc/:sv', {
                templateUrl: '../bible2013/views/bible.html',
                controller: 'BibleCtrl'
        })
        .otherwise({
                redirectTo: '/bible/nlt/43/1'
        });
}]);
