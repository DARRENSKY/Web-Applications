'use strict';

var cs142App = angular.module('cs142App', ['ngRoute', 'ngMaterial', 'ngResource']);

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

cs142App.controller('MainController', ['$scope', '$resource', function ($scope, $resource) {
    $scope.main = {
        title: 'Users',
        userName: 'Austin Jones',
        currentView: '',
        currentUser: '',
    };

    /* Pull info from db */
    var Info = $resource('/test/info');
    Info.get({}).$promise.then(function(info) {
        $scope.main.version = info.__v;
    });
}]);
