bible2012App.directive('myJplayer', function($log, $filter, config) {
    return {
        restrict: 'A',
        controller: function($scope, $element, $attrs) {
            $scope.prepareTracks = function(data) {
                var result = [];
                angular.forEach(data, function(value, key) {
                    result.push({
                            'title': $filter('getBookNameFromNumber')(value.book) + " " + value.chapter,
                            'mp3': config.bibleAudioUrl + 
                                (String(value.book).length < 2 ? "" + "0" + value.book : value.book) +
                            '_' +
                            (
                                value.book == 19
                                ?
                                String(value.chapter).length < 2 ?  "" + "00" + value.chapter : "" + "0" + value.chapter
                                : 
                                String(value.chapter).length < 2 ? "" + "0" + value.chapter : value.chapter
                            ) +
                            '.mp3'
                    });
                });
                return result;
            }
        },
        link: function(scope, element, attrs) {
            var player = '#jquery_jplayer_' + attrs.class,
                cssSelector = '#jp_container_' + attrs.class,
                supplied = 'mp3',
                wmode = 'window';

            function updatePlayer(e, data) {
                $log.log('e, data, class', e, data, attrs.class);
                if (e.name != attrs.class + 'Updated') return;
                $(player).jPlayer('destroy');

                var tracks = scope.prepareTracks(data);
                var p = new jPlayerPlaylist(
                    {
                        jPlayer: player,
                        cssSelectorAncestor: cssSelector
                    },
                        tracks, 
                    {
                        swfPath: '../swf/',
                        supplied: supplied,
                        wmode: wmode
                    }
                );
            }
            $log.log('player:', $(player));

            scope.$on('readingPlanUpdated', function(e, data) {
                updatePlayer(e, data);
            });

            scope.$on('bibleUpdated', function(e, data) {
                updatePlayer(e, data);
            }); 
        }
    };
});
