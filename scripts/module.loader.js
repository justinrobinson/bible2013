var mod = angular.module('loading', []);

/*
mod.factory('loadingService', function() {
  var service = {
    requestCount: 0,
    isLoading: function() {
      return service.requestCount > 0;
    }
  };
  return service;
});

mod.factory('onStartInterceptor', function(loadingService) {
  return function (data, headersGetter) {
    loadingService.requestCount++;
    return data;
  };
});



mod.factory('onCompleteInterceptor', function(loadingService) {
  return function(promise) {
    var decrementRequestCount = function(response) {
      loadingService.requestCount--;
      return response;
    };
    // Normally we would just chain on to the promise but ...
    return promise.then(decrementRequestCount, decrementRequestCount);
    // ... we are delaying the response by 2 secs to allow the loading to be seen.
    //return delayedPromise(promise, 2000).then(decrementRequestCount, decrementRequestCount);
  };
});

mod.config(function($httpProvider) {
  $httpProvider.responseInterceptors.push('onCompleteInterceptor');
});


mod.run(function($http, onStartInterceptor) {
  $http.defaults.transformRequest.push(onStartInterceptor);
});
*/

mod.controller('LoadingCtrl', function($scope, loadingService) {
  //$scope.$watch(function() { return loadingService.isLoading(); }, function(value) { $scope.loading = value; });
});

