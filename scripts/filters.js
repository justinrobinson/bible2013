'use strict';

bible2012App
.filter('getBookNameFromNumber', function($log, config) {
    return function(input) {
        var index = config.currentVersionIndex || config.nltIndex; // In the event this is a reading-plan passage, default to nltIndex as no index has been loaded yet
        for (var key in index) {
            if (index.hasOwnProperty(key)) {
                if (Number(index[key].BookNumber) === Number(input)) {
                    return index[key].BookName;
                }
            }
        }
    };
});
