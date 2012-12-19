bible2012App.controller('CommentsCtrl', function($http, $scope, $rootScope, $log, $routeParams, config) {
    $scope.previousReady = false;
    $scope.nextReady = true;
    $scope.pageNumber = 1;
    $scope.commentCount = 100;
    $scope.commentsAvailable = false;
    $scope.textarea = 'Add your comment.';
    $scope.submitComment = function() {
        $log.log('New comment is:', $scope.textarea);
    };
    /*
     *
     * Object {article: Object}
article: Object
comment_count: "42"
comments: Array[10]
0: Object
$$hashKey: "00Y"
can_delete: "No"
comment_id: "2866541"
comment_rating: "0"
comment_text: "&quot;Father my loving King in Jesus name I praise you! Glory to You Lord Jesus Christ forever! Holy Spirit be blessed! Lord Jehovah in Jesus name I praise You for Your Holy Word stands forever! Your promises are yes and amen!! Thank You Father for Your love in Jesus name! Thank You my Father for the favor of God is upon me in Jesus name! Father Your Word says in John 14:14,'Ask Anything In My Name And I will Do It!&quot;, I believe You Father and I expect to receive based on Your truth and faithfulness!! Glory Hallelujah Jesus!! Psalm 37:4,'delight thyself in the Lord and He shall give you the desires of your heart!'. I believe and I receive in Jesus name I thank You Father Jehovah Yahweh, Amen!!&quot;"
display_name: "Peter Frank Santovito"
friendly_time: "2 hours ago"
mycbn_user_name: "4fd97bb2-caa5-4e7a-8b26-74a21b2f09c0"
profile_img_src: "http://my.cbn.com/mod/profile/icondirect.php/?username=4fd97bb2-caa5-4e7a-8b26-74a21b2f09c0&size=small"
profile_link: "http://my.cbn.com/pg/profile/4fd97bb2-caa5-4e7a-8b26-74a21b2f09c0"
unix_timestamp: "1355917426"

*/
    $scope.previous = function() {
        if ($scope.pageNumber != 1) {
            $scope.nextEnabled = true;
            $scope.pageNumber = Number($scope.pageNumber) - 1;
            $scope.load();
        } else {
            $scope.nextEnabled = false;
        }
    };
    $scope.next = function() {
        if ($scope.pageNumber * 10 < $scope.commentCount) {
            $scope.previousEnabled = true;
            $scope.pageNumber = Number($scope.pageNumber) + 1;
            $scope.load();
        } else {
            $scope.nextEnabled = false;
        }
    };
    $scope.$on('commentButtonClicked', function() {
        $scope.load();
    });
    $scope.$on('readingPlanUpdated', function() {
        $scope.load();
    });
    $scope.load = function() {
        $scope.commentsAvailable = false;
        $http({
                method: 'GET',
                params: {
                    p: $scope.pageNumber
                },
                cache: true,
                url: '../php/json_comments.php?url=http://biblestudy.cbn.com/BibleINAYear.aspx?day=' + $routeParams.day + '%26plan=' + $routeParams.planId
        })
        .success(function(data) {
            $log.log('comment data:', data);
            if (data.article.comments.length > 0) {
                $scope.commentCount = data.article.comment_count;
                $scope.comments = data.article.comments;
                if ($scope.pageNumber == 1) {
                    $scope.previousEnabled = false;
                } else {
                    $scope.previousEnabled = true;
                }
                if ($scope.pageNumber * 10 < $scope.commentCount) {
                    $scope.nextEnabled = true;
                } else {
                    $scope.nextEnabled = false;
                }
                $scope.commentsAvailable = true;
            }
        });
    };
});
