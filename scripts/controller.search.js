'use strict';

bible2012App.controller('SearchCtrl', function($log, $http, $scope, $location, config, utilities, search) {
    var bcv = bcv || new bcv_parser;
    $scope.search = function(e) {
        $log.log(bcv.parse($scope.searchResult));
        var parsed = bcv.parse($scope.searchResult);
        if (parsed.entities[0] && parsed.entities[0].passages) {
        var result = parsed.entities[0].passages[0],
            startBook = utilities.bookNumberFromOsis(result.start.b),
            startChapter = result.start.c,
            startVerse = result.start.v,
            endBook = utilities.bookNumberFromOsis(result.end.b),
            endChapter = result.end.c,
            endVerse = result.end.v,
            valid = result.valid.valid;

        if (valid && startBook != null && startChapter != null && startVerse != null && endVerse != null) {
            config.update({book: startBook, sc: startChapter, sv: startVerse, ev: endVerse});
            return $location.path('/bible/' + utilities.getVersionKeyFromNumber(config.book) + '/' + config.book + '/' + config.sc + '/' + config.sv + '/' + config.ev);
        }
        if (valid && startBook != null && startChapter != null && startVerse != null) {
            config.update({book: startBook, sc: startChapter, sv: startVerse, ev: 0});
            return $location.path('/bible/' + utilities.getVersionKeyFromNumber(config.book) + '/' + config.book + '/' + config.sc + '/' + config.sv);
        }
        if (valid && startBook != null && startChapter != null) {
            config.update({book: startBook, sc: startChapter, sv: 0, ev: 0});
            return $location.path('/bible/' + utilities.getVersionKeyFromNumber(config.book) + '/' + config.book + '/' + config.sc);
        }
        if (valid && startBook != null) {
            config.update({book: startBook, sc: 1, sv: 0, ev: 0});
            return $location.path('/bible/' + utilities.getVersionKeyFromNumber(config.book) + '/' + config.book + '/' + config.sc);
        }       
        }
        // If you've gotten this far then it's an invalid passage or a natural text search...

        $http({
            method: 'GET',
            cache: true,
            url: config.searchUrl + 'q=' + parsed.s 
        })
        .success(function(data) {
            search.update(data);
        });

    };
});
