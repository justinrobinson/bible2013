'use strict';

bible2012App.directive('audioPlayer', function($log, $filter, config) {
    return {
        restrict: 'A',
        transclude: true,
        scope: {
            id: "@"
        },
        templateUrl: 'views/audioPlayer.html',
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
            $log.log('link:', scope, element, attrs);
            function updatePlayer(data) {
                var player = '#jquery_jplayer_' + attrs.id,
                    cssSelector = '#jp_container_' + attrs.id,
                    supplied = 'mp3',
                    wmode = 'window';

                $(player).jPlayer('destroy');

                player.playlist = new jPlayerPlaylist(
                    {
                        jPlayer: player,
                        cssSelectorAncestor: cssSelector
                    },
                    scope.prepareTracks(data), 
                    {
                        swfPath: '../swf/',
                        supplied: supplied,
                        wmode: wmode
                    }
                );
            }
            scope.$on('readingPlanUpdated', function(e, data) {
                updatePlayer(data);
            });
            scope.$on('bibleUpdated', function(e, data) {
                updatePlayer(data);
            }); 
        }
    };
});
