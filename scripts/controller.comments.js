bible2012App.controller('CommentsCtrl', function($http, $scope, $rootScope, $log, $routeParams, config) {
    $scope.previousReady = false;
    $scope.nextReady = true;
    $scope.pageNumber = 1;
    $scope.commentCount = 100;
    $scope.commentsAvailable = false;
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
