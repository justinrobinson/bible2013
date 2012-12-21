'use strict';
/**
 * Bible Versions Controller
 * 
 * @this {BibleVersionsCtrl}
 * @param {function} $location Provides url location methods. Dependency Injected.
 * @param {function} $route Provides.... Dependency Injected.
 * @param {object} $routeParams Provides route parameters. Dependency Injected.
 * @param {function} $log A console wrapper for logging and debugging. Dependeny Injected.
 * @param {object} config The global configuration settings for the entire app. Dependency Injected.
 */
bible2012App.controller('BibleVersionsCtrl', function($location, $route, $routeParams, $log, $scope, $http, config, utilities) {
    config.version = utilities.getVersionNumberFromKey($routeParams.versionKey);
    $scope.versions = config.versions; 
    $scope.versionKey = utilities.getVersionKeyFromNumber();
    $scope.versionClick = function(i) {
        config.version = i;
        $scope.versionKey = $scope.versions[i].versionkey;
        $scope.versionName = $scope.versions[i].name;
        $http({
            method: 'GET',
            cache: true,
            url: config.apiUrl + 'api=getIndex&version=' + $scope.versionKey
        })
        .success(function(data) {
            config.currentVersionIndex = data.response.result;
            $log.log('changing versions');
            $location.path('bible/' + utilities.getVersionKeyFromNumber(config.version) + '/' + config.book + '/' + config.sc + ((config.sv != 0) ? ('/' + config.sv) : ''));
            $log.log('end changing versions');
        })
        .error(function(a, b, c, d) {
            $log.log('BibleVersionsCtrl $http error:', a, b, c, d);
        });
    };

    // When BibleVersionsCtrl initially loads it will run this once
    $scope.versionClick(config.version);
});
