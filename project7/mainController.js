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
            when('/login-register', {
                templateUrl: 'components/login-register/login-registerTemplate.html',
                controller: 'LoginRegisterController'
            }).
            otherwise({
                redirectTo: '/users'
            });
    }]);

cs142App.controller('MainController', ['$scope', '$rootScope', '$resource', '$location', 
                                       function ($scope, $rootScope, $resource, $location) {
    $scope.main = {
        title: 'Users',
        loggedInUser: null,
        message: 'Please login',
        currentView: '',
        currentUser: '',
    };

    /* Pull info from db */
    var Info = $resource('/test/info');
    Info.get({}).$promise.then(function(info) {
        $scope.main.version = info.__v;
    });

    /* No logged-in user, redirect to /login-register unless already there */
    $rootScope.$on( "$routeChangeStart", function(event, next, current) {
        if (!$scope.main.loggedInUser) {
            if (next.templateUrl !== "components/login-register/login-registerTemplate.html") {
                $location.path("/login-register");
            }
        }
    });

    /* Logout a user */
    var Logout = $resource('/admin/logout');
    $scope.logout = function() {
        Logout.save({}).$promise.then(function(response) {
            $scope.main.loggedInUser = null;
            $scope.main.message = 'Please login';
            $location.path('/login/register');
        }, function(err) {
            alert('Nobody is currently logged in.');
        });
    }
}]);
