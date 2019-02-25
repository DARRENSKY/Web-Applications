'use strict';

var cs142App = angular.module('cs142App', ['ngRoute', 'ngMaterial']);

cs142App.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider.
            when('/users', {
                templateUrl: 'components/user-list/user-listTemplate.html',
                controller: 'UserListController'
            }).
            when('/users/:userId', {
                templateUrl: 'components/user-detail/user-detailTemplate.html',
                controller: 'UserDetailController'
            }).
            when('/photos/:userId', {
                templateUrl: 'components/user-photos/user-photosTemplate.html',
                controller: 'UserPhotosController'
            }).
            otherwise({
                redirectTo: '/users'
            });
    }]);

cs142App.controller('MainController', ['$scope', function ($scope) {
    $scope.main = {
        title: 'Users',
        userName: 'Austin Jones',
        currentView: '',
        currentUser: '',
    };

    /*
      * FetchModel - Fetch a model from the web server.
      *   url - string - The URL to issue the GET request.
      *   doneCallback - function - called with argument (model) when the
      *                  the GET request is done. The argument model is the
      *                  objectcontaining the model. model is undefined in
      *                  the error case.
      */
    $scope.FetchModel = function(url, doneCallback) {
        let request = new XMLHttpRequest();
        request.addEventListener("load", function() {
            doneCallback(request);
        });
        request.open("GET", url);
        request.send();
    };

    let getVersion = function(response) {
        let version = JSON.parse(response.responseText);
        $scope.$apply(function() {
            $scope.main.version = version.__v;
        });
        console.log($scope.main.version);
    };
    $scope.FetchModel('/test/info', getVersion);
}]);
