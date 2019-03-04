'use strict';

// cs142App.controller('UserListController', ['$scope', function ($scope) {
cs142App.controller('UserListController', ['$scope', '$resource', function ($scope, $resource) {
    $scope.main.title = 'Users';
    $scope.users = {};

    var Users = $resource('/user/list');
    Users.query({}, function(users) {
        $scope.users.list = users;
    }, function(err) {
        console.log(JSON.stringify(err));
    });
}]);