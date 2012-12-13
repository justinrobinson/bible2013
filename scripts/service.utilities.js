'use strict';

bible2012App.factory('utilities', function($log, $http, $location, $rootScope, config) {
  // Service logic
  // ...

  function updateBibleLocation() {
      $location.path('bible/' + config.versions[config.version].versionkey + '/' + config.book + '/' + config.sc);
  }

  // Public API here
  return {
      bookNumberFromOsis: function (book) {
        var result;
        angular.forEach(config.osis, function(value, key) {
            if (value === book) {
                result = Number(key) + 1;
            }
        });
        return result;
    },
    getCurrentHashLocation: function() {
        return $location.path().split('/')[1];
    },
    getVersionKeyFromNumber: function() {
        var versions = config.versions,
            version = config.version;
        for (var key in versions) {
            if (versions.hasOwnProperty(key)) {
                if ( Number(key) === Number(version) ) {
                    return versions[key].versionkey;
                }
            }
        }
    },
    getVersionNameFromNumber: function() {
        var versions = config.versions,
            version = config.version;
        for (var key in versions) {
            if (versions.hasOwnProperty(key)) {
                if ( Number(key) === Number(version) ) {
                    return versions[key].name;
                }
            }
        }
    },
    getVersionNumberFromKey: function(versionKey) {
        var versions = config.versions,
            version = config.version;
        for (var key in versions) {
            if (versions.hasOwnProperty(key)) {
                if ( versionKey === versions[key].versionkey ) {
                    return key;
                }
            }
        }
    },
    getChapters: function() {
        var chapters = config.nltIndex[Number(config.book)-1].TotalChapters,
            arr = [];
        for (var i = 0; i < chapters; i++) {
            arr.push(Number(i) + 1);
        }
        return arr;
    },
    getBooks: function() {
        var index = config.currentVersionIndex;
        var arr = [];
        for (var key in config.currentVersionIndex) {
            arr.push(config.currentVersionIndex[key].BookName);
        }
        return arr;
    },
    getBookName: function() {
        for (var key in config.currentVersionIndex) {
            if ( Number(config.book) === Number(config.currentVersionIndex[key].BookNumber) ) {
                return config.currentVersionIndex[key].BookName;
            }
        }
    },
    getVerses: function() {
        var verses = config.nltIndex[Number(config.book)-1].ChapterDetail.split(',')[Number(config.sc)-1],
            arr = [];
        for (var i = 0; i < verses; i++) {
            arr.push(Number(i) + 1);
        }
        return arr;
    },
    getPreviousBibleChapter: function() {
        var index = config.currentVersionIndex,
        book = config.book,
        chapter = config.sc;

        if (Number(chapter) > 1) {
            chapter--;
        } else if (Number(chapter) === 1) {
            if (Number(book) > 1) {
                book--;
                chapter = Number(index[book-1].TotalChapters);
            } else {
                book = 66;
                chapter = 22;
            }
        }
        config.book = book;
        config.sc = chapter;

        updateBibleLocation();

    },
    getNextBibleChapter: function() {
        var index = config.currentVersionIndex,
        book = config.book,
        chapter = config.sc;
        if (Number(chapter) < Number(index[book-1].TotalChapters)) {
            chapter++;
        } else if (Number(chapter) === Number(index[book-1].TotalChapters)) {
            if (Number(book) < 66) {
                $log.log('book',book);
                book++;
                chapter = 1;
            } else {
                $log.log('reset');
                book = 1;
                chapter = 1;
            }
        }
        config.book = book;
        config.sc = chapter;

        updateBibleLocation();

    },
    updateBibleLocation: updateBibleLocation,
    parseReadingPlanPassage: function(passage) {

        var index = config.nltIndex,
        arr = passage.split(' '),
        book,
        chapter,
        result;

        function isString(val) { return !!String(val); }

        function isNumber(val) { return !!Number(val); }

        function isRomanNumeral(val) {
            var result = new RegExp('/^i{1,3}$/i');
            return result.test(val);
        }

        function convertRomanNumeralToNumber(val) {
            switch(val.toLowerCase()) {
                case 'i': val = 1; break;
                case 'ii': val = 2; break;
                case 'iii': val = 3; break;
            }
            return val;
        }
        function getBookNumberFromName(val) {
            for (var key in index) {
                if (index.hasOwnProperty(key)) {
                    if (index[key].BookName.toLowerCase().replace(/\s/g, '') === val.toLowerCase()) {
                        val = index[key].BookNumber;
                    }
                }
            }
            return val;
        }
        function createReadingPlanResult(book, chapter) {
            var result = [];
            if (chapter == null) { chapter = 1; }
            if (!!~String(chapter).indexOf(':')) {
                result.push({'book': Number(book), 'chapter': Number(chapter.split(':')[0])});
            } else if (!!~String(chapter).indexOf('-')) { // Convert chapter to string to deal with edge case that chapter comes in as Number
                var arr = chapter.split('-'),
                startChapter = Number(arr[0]),
                endChapter = Number(arr[1]);
                for (var i = startChapter; i <= endChapter; i++) {
                    result.push({'book': Number(book), 'chapter': i});
                }
            } else {
                result.push({'book': Number(book), 'chapter': Number(chapter)});
            }
            return result;
        }
        // If book contains prefixed number then split into two and concatanate.
        if (
                (
                    isNumber(arr[0]) || // It's a number like 1, 2 or 3...
                    isString(arr[0]) && isRomanNumeral(arr[0]) // OR it's a Roman Numeral like I, II, III, i, ii or iii.
                )   && isString(arr[0]) // Make sure the 0th index is a String like 'Timothy' or 'Peter'.
            )
        {
            if ( isRomanNumeral(arr[0]) ) {
                arr[0] = convertRomanNumeralToNumber(arr[0]);
            }
            book = arr[0] + arr[1].toLowerCase(); // Should now look like 1timothy or 2peter
            chapter = arr[2];
        // ...otherwise the 0th index is a book and the 1st index is a chapter
        } else {
            book = arr[0];
            chapter = arr[1] || 1; // Malachi doesn't have a chapter associated so just assign 1 as default.
        }
        // Get the book number from name
        book = getBookNumberFromName(book);
        // Create reading plan result
        result = createReadingPlanResult(book, chapter);
        return result;
    }
  };
});
