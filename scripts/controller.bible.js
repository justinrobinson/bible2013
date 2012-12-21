'use strict';
/**
 * Bible Controller
 * 
 * @this {BibleCtrl}
 * @param {function} $log A console wrapper for logging and debugging. Dependeny Injected.
 * @param {object} $scope A reference to 'this'. Dependency Injected.
 * @param {object} $http Provides methods for ajax calls. Dependency Injected.
 * @param {object} $routeParams Provides route parameters. Dependency Injected.
 * @param {object} config The global configuration settings for the entire app. Dependency Injected.
 * @param {object} utilities The global utilities for the entire app. Dependency Injected.
 */
bible2012App.controller('BibleCtrl', function($log, $scope, $http, $location, $routeParams, $rootScope, config, utilities) {
    // Update global configuration settings
    // Check to see if it's a verse range with a dash
    var sv, ev, startVerse, endVerse;
    sv = $routeParams.sv || 0;
    ev = $routeParams.ev || 0;
    startVerse = 0;
    endVerse = 0;
    $log.log('sv:', sv);
    if (!!~$routeParams.sv.indexOf(',') || !!~$routeParams.sv.indexOf('-')) {
        if (!!~$routeParams.sv.indexOf(',')) {
            sv = sv.split(',');
        }
        $log.log('sv:', sv);
        if (!!~$routeParams.sv.indexOf('-')) {
            if (angular.isArray(sv)) {
                angular.forEach(sv, function(value, key) {
                    sv[key] = sv[key].split('-');
                });
            } else {
                sv = sv.split('-');
            }
        }
        $log.log('sv:', sv);
        if (angular.isArray(sv)) {
            if (angular.isArray(sv[0])) {
                startVerse = sv[0][0];
            } else {
                startVerse = sv[0];
            }
            if (angular.isArray(sv[sv.length-1])) {
                endVerse = sv[sv.length-1][sv[sv.length-1].length-1];
            } else {
                endVerse = sv[sv.length-1];
            }
        }
    } else {
        startVerse = sv;
        endVerse = sv;
    }
    $log.log('sv:', sv);
    $log.log('startVerse:', startVerse, 'endVerse:', endVerse);
    config.update({version: utilities.getVersionNumberFromKey($routeParams.versionKey), book: $routeParams.book, sc: $routeParams.sc, sv: startVerse, ev: endVerse});
    $scope.verseOn = function(verse) {
        var bool = false,
            verse = Number(verse);
        if (verse >= Number(startVerse) && verse <= Number(endVerse)) {
            bool = true;
        }
        return bool;
    };
    $rootScope.$broadcast('bibleUpdated', [{'version': config.version, 'book': config.book, 'chapter': config.sc, 'sv': config.sv}]);
    $scope.book = config.book;
    //$scope.bookName = utilities.getBookName();
    $scope.sc = config.sc;
    $scope.sv = config.sv;
    $scope.ev = config.ev;
    $scope.chapters = utilities.getChapters();
    $scope.verses = utilities.getVerses();
    $scope.passageAvailable = false;
    $scope.books = utilities.getBooks();
    // Update books with new version index
    $scope.getBooks = function() {
        if (config.currentVersionIndex == null) {
            setTimeout($scope.getBooks, 100);
            return;
        }
        $scope.books = utilities.getBooks();
    }
    // Used for initial load
    $scope.getBooks();

    $scope.previousChapterClick = function() {
        $scope.passageAvailable = false;
        utilities.getPreviousBibleChapter();
    };
    $scope.nextChapterClick = function() {
        $scope.passageAvailable = false;
        utilities.getNextBibleChapter();
    };
    $scope.bookClick = function($index) {
        $scope.passageAvailable = false;
        $scope.book = config.book = Number($index)+1;
        $scope.bookName = utilities.getBookName();
        $scope.chapters = utilities.getChapters();
        $scope.chapter = config.sc = 1;
        $location.path('bible/' + config.versions[config.version].versionkey + '/' + config.book + '/' + config.sc);
    };
    $scope.chapterClick = function($index) {
        $scope.passageAvailable = false;
        $scope.sc = config.sc = Number($index)+1;
        $scope.sv = config.sv = 1;
        $location.path('bible/' + config.versions[config.version].versionkey + '/' + config.book + '/' + config.sc);
    };
    $scope.verseClick = function($index) {
    };
    $log.log('passage:', config.book, config.sc, config.sv);
    // Fetch the new passage
    $http({
        method: 'GET',
        cache: true,
        url: config.apiUrl + 'api=getPassage&version=' + config.versions[config.version].versionkey + '&book=' + config.book + '&sc=' + config.sc
    })
    .success(function(data) {
        $scope.passage = data.response.result;
        $scope.passageAvailable = true;
    })
    .then(function() {
        // Fetch the new passage copyright
        $http({
            method: 'GET',
            cache: true,
            url: config.apiUrl + 'api=getCopyright&version=' + config.versions[config.version].versionkey
        })
        .success(function(data) {
            $scope.copyright = data.response.result.CopyrightInfo;
            $scope.passageAvailable = true;
        })
        .error(function(a, b, c, d) {
            $log.log('BibleCtrl $http copyright error: ', a, b, c, d);
        });
    });
});
