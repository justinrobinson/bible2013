bible2012App.controller('CommentsCtrl', function($http, $scope, $log, $routeParams, config) {
    $scope.$on('commentButtonClicked', function() {
        $http({
                method: 'GET',
                cache: true,
                url: '../php/json_comments.php?url=http://biblestudy.cbn.com/BibleINAYear.aspx?day=' + $routeParams.day + '%26plan=' + $routeParams.planId
        })
        .success(function(data) {
            $scope.comments = data.article.comments;
        });
    });
});
