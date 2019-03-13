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
            when('/favorites', {
                templateUrl: 'components/favorites/favoritesTemplate.html',
                controller: 'FavoritesController'
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
            console.log(JSON.stringify(err));
            alert('Nobody is currently logged in.');
        });
    };

    /* Used to upload a photo */
    var selectedPhotoFile;
    $scope.inputFileNameChanged = function (element) {
        selectedPhotoFile = element.files[0];
        console.log(selectedPhotoFile);
    };
    
    /* Has the user selected a file? */
    $scope.inputFileNameSelected = function () {
        return !!selectedPhotoFile;
    };
    
    /* Upload the photo file selected by the user using a post request to the URL /photos/new */
    $scope.uploadPhoto = function () {
        if (!$scope.inputFileNameSelected()) {
            console.error("uploadPhoto called with no selected file");
            return;
        }
        console.log('fileSubmitted', selectedPhotoFile);
    
        // Create a DOM form and add the file to it under the name uploadedphoto
        var domForm = new FormData();
        domForm.append('uploadedphoto', selectedPhotoFile);
    
        var NewPhoto = $resource('/photos/new');
        NewPhoto.save(domForm).$promise.then(function (response) {
            console.log('Success', response);
        }, function (err) {
            console.log('Error uploading photo', err);
        });
    };
}]);
