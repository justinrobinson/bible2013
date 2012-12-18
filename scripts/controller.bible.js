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
    config.update({version: utilities.getVersionNumberFromKey($routeParams.versionKey), book: $routeParams.book, sc: $routeParams.sc});
    $rootScope.$broadcast('bibleUpdated', [{'version': config.version, 'book': config.book, 'chapter': config.sc}]);
    $scope.book = config.book;
    //$scope.bookName = utilities.getBookName();
    $scope.sc = config.sc;
    $scope.sv = config.sv;
    $scope.ev = config.ev;
    $scope.chapters = utilities.getChapters();
    $scope.verses = utilities.getVerses();
    $scope.passageAvailable = false;
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
        $log.log('BibleCtrl verseClick:', $index);
    };
    // Fetch the new passage
    $http({
        method: 'GET',
        cache: true,
        url: config.apiUrl + 'api=getPassage&version=' + config.versions[config.version].versionkey + '&book=' + config.book + '&sc=' + config.sc
    })
    .success(function(data) {
        $scope.passage = data.response.result;
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
