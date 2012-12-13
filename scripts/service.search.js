bible2012App.factory('search', function($log, $rootScope) {
    return {
        update: function(data) {
            this.result = data;
            $rootScope.$broadcast('search.update', this.result);
        },
        result: ''
    };
});
