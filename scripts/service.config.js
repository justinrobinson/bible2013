'use strict';
/**
 * This holds the global configuration settings for all aspects of the site
 */
bible2012App.factory('config', function($log, apiUrl, searchUrl, bibleAudioUrl, nltIndex, versions, $location, $routeParams) {
    function getCurrentHashRoot() {
        return $location.path().split('/')[1];
    }
    function getCurrentDayOfYear() {
        var timestamp = new Date().setFullYear(new Date().getFullYear(), 0, 1);
        var yearFirstDay = Math.floor(timestamp/86400000);
        var today = Math.ceil((new Date().getTime()) / 86400000);
        var dayOfYear = today - yearFirstDay;
        return dayOfYear;
    }
    return {
        version: 8, /** Bible Version Number */
        versionKey: 'nlt', /** Bible Version Key */
        book: 43, /** Bible Book Number */
        sc: 1, /** Bible Chapter Number */
        sv: 1, /** Bible Starting Verse Number */
        ev: 5, /** Bible Ending Verse Number */
        planId: 1, /** Reading Plan Default Plan ID */
        day: getCurrentDayOfYear(),
        today: function() {
            var today = new Date();
            var dd = today.getDate();
            var mm = today.getMonth()+1;

            var yyyy = today.getFullYear();
            if (dd < 10) {
                dd = '0' + dd;
            }
            if (mm < 10) {
                mm = '0' + mm;
            }
            today = mm + '/' + dd + '/' + yyyy;
            return today;
        },
        convertDayToDate: function(day) {
            var date = new Date(new Date().getFullYear(), 0);
            return new Date(date.setDate(day));
        },
        convertDateToDay: function(d) {   // d is a Date object
            var yn = d.getFullYear();
            var mn = d.getMonth();
            var dn = d.getDate();
            var d1 = new Date(yn,0,1,12,0,0); // noon on Jan. 1
            var d2 = new Date(yn,mn,dn,12,0,0); // noon on input date
            var ddiff = Math.round((d2-d1)/864e5);
            return ddiff+1; },
        dayOfYear: getCurrentDayOfYear(),
        currentMenuPane: getCurrentHashRoot(),
        /**
         * Gets a value from 'config'
         *
         * @function
         * @this {get}
         * @param {String}
         * @return {value}
         */
        get: function(key) {
            return this[key];
        },
        /**
         * Sets a value to 'config'
         *
         * @this {set}
         * @param {key}
         * @param {value}
         */
        set: function(key, value) {
            this[key] = value;
        },
        /**
         * Sets multiple values to 'config' using json
         *
         * @this {update}
         * @param {object} object e. g. {'version': 8, 'book': 43}
         */
        update: function(object) {
            for (var key in object) {
                if (object.hasOwnProperty(key)) {
                    this[key] = object[key];
                }
            }
        },
        /**
         * The api url which is dependency injected at the top of the file as a paramemter of 'config'. /app/values/apiUrl.js
         *
         * @this {apiUrl}
         * @return {String}
         */
        apiUrl: apiUrl,
        /**
         * The nlt index which is dependency injected at the top of the file as a parameter of 'config' /app/values/nltIndex.js
         *
         * @this {nltIndex}
         * @return {json}
         */
        searchUrl: searchUrl,
        bibleAudioUrl: bibleAudioUrl,
        nltIndex: nltIndex,
        /**
         * Versions of the bible, which is dependency injected at the top of the file as a parameter of 'config' /app/values/versions.js
         *
         * @this {versions}
         * @return {json}
         */
        versions: versions,
        /**
         * Current version index of the bible based on the currently selected version
         *
         * @this {currentVersionIndex}
         * @return {json}
         */
        osis: ["Gen","Exod","Lev","Num","Deut","Josh","Judg","Ruth","1Sam","2Sam","1Kgs","2Kgs","1Chr","2Chr","Ezra","Neh","Esth","Job","Ps","Prov","Eccl","Song","Isa","Jer","Lam","Ezek","Dan","Hos","Joel","Amos","Obad","Jonah","Mic","Nah","Hab","Zeph","Hag","Zech","Mal","Matt","Mark","Luke","John","Acts","Rom","1Cor","2Cor","Gal","Eph","Phil","Col","1Thess","2Thess","1Tim","2Tim","Titus","Phlm","Heb","Jas","1Pet","2Pet","1John","2John","3John","Jude","Rev"]
    };
});
