bible2012App.controller('CommentsCtrl', function($http, $scope, $rootScope, $log, $routeParams, config) {
    $scope.previousReady = false;
    $scope.nextReady = true;
    $scope.pageNumber = 1;
    $scope.commentCount = 100;
    $scope.previous = function() {
        if ($scope.pageNumber != 1) {
            $scope.pageNumber = Number($scope.pageNumber) - 1;
            $scope.load();
        }
    };
    $scope.next = function() {
        if ($scope.pageNumber * 10 < $scope.commentCount) {
            $scope.pageNumber = Number($scope.pageNumber) + 1;
            $scope.load();
        }
    };
    $scope.$on('commentButtonClicked', function() {
        $scope.load();
    });
    $scope.$on('readingPlanUpdated', function() {
        $scope.load();
    });
    $scope.load = function() {
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
            }
        });
    };
});
