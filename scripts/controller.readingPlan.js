'use strict';

bible2012App.controller('ReadingPlanCtrl', function($location, $rootScope, $scope, $log, $routeParams, $http, config, utilities, $timeout, $filter) {
    // Update global configuration settings
    config.update({ planId:$routeParams.planId, day:$routeParams.day, OTReading: null}); // Make sure to reset OTReading so that the reading pane knows if it's to use that or not.
    $scope.planId = config.planId;
    $scope.readingBook;
    $scope.readingChapter;
    $scope.readingVerse;
    $scope.result = [];
    $scope.data = [];
    $scope.plans = ['New and Old Testament', 'New Testament Only'];
    $scope.plan = $scope.plans[Number($scope.planId)-1];
    $scope.planClick = function($index) {
        $location.path('/reading-plan/' + (Number($index) + 1) + '/' + config.day);
    };
    $scope.previous = function() {
        $location.path('/reading-plan/' + config.planId + '/' + (Number(config.day) > 1 ? (Number(config.day) - 1) : 366));
    };
    $scope.next = function() {
        $location.path('/reading-plan/' + config.planId + '/' + (Number(config.day) < 367 ? (Number(config.day) + 1) : 1));
    };
    $scope.readingResults = function(results) {
        $scope.reading = results;
    }
    $scope.$on('readingResultsUpdated', $scope.readingResults);
    $scope.date = config.convertDayToDate(config.day);
    $scope.change = function() {
        config.update({day: config.convertDateToDay($scope.date)});
        var date = $scope.date;
        $location.path('/reading-plan/' + config.planId + '/' + config.convertDateToDay(date));
    };
    $scope.update = function() {
        $http({
                method: 'GET',
                cache: true,
                url: config.apiUrl + 'api=getPlanData&planId=' + config.planId + '&day=' + config.day
        })
        .success(function(data) {
            var result = data.response.result[0];
            $scope.DevotionTitle = result.DevotionTitle;
            $scope.DevotionURL = result.DevotionURL;
            if ($scope.planId == 1) config.OTReading = utilities.parseReadingPlanPassage(result.OTReading);
            config.NTReading = utilities.parseReadingPlanPassage(result.NTReading);
        })
        .then(function(data) {
            if (config.OTReading != null) {
                fetchReadingPassages($.merge(config.OTReading, config.NTReading));
            } else {
                fetchReadingPassages(config.NTReading);
            }
            function fetchReadingPassages(reading) {
                $rootScope.$broadcast('readingPlanUpdated', reading);
                for (var i = 0; i < reading.length; i++) {
                    (function(index) {
                            $http({
                                    method:'GET',
                                    cache: true,
                                    url:config.apiUrl + 'api=getPassage&version=nlt&book='+ reading[index].book + '&sc=' + reading[index].chapter
                            }).success(function(data) {
                            $scope.data[index] = [];
                            $scope.data[index].push({'index': index}, {'title': $filter('getBookNameFromNumber')(reading[index].book) + ' ' + reading[index].chapter}, {'book': reading[index].book}, {'chapter': reading[index].chapter}, {'passage': data.response.result});
                            }).then(function() {
                            if ($scope.data.length == reading.length) {
                                $scope.result = $scope.data;
                            }
                            });
                    }(i));
                }
            }
        });
    };
    // start everything off
    $scope.update();
});
