'use strict';

cs142App.controller('UserListController', ['$scope', '$resource', function ($scope, $resource) {
    $scope.main.title = 'Users';
    $scope.main.users = {};

    var Users = $resource('/user/list');
    Users.query({}, function(users) {
        $scope.main.users = users;
    }, function(err) {
        console.log(JSON.stringify(err));
    });

    /* Gets the recent action in string form */
    $scope.getAction = function (user) {
        return user.lastAction.action;
    };

    /* Gets the photo thumbnail */
    $scope.getThumbnail = function (user) {
        return user.lastAction.photo;
    };

    /* True if user's last action was anything but posting photo */
    $scope.recentActionDefault = function (user) {
        return user.lastAction && user.lastAction.action;
    };

    /* True if user's last action was uploading a photo */
    $scope.recentPhotoAction = function (user) {
        return user.lastAction && user.lastAction.photo;
    };

    /* True if user hasn't had a recent action */
    $scope.noRecentAction = function (user) {
        return !user.lastAction;
    };

    $scope.main.updateRecentActivity = function (id, action) {
        var Users = $resource('/user/list');
        Users.query({}, function(users) {
            $scope.main.users = users;
        }, function(err) {
            console.log(JSON.stringify(err));
        });
    };
}]);