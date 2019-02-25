'use strict';

cs142App.controller('UserDetailController', ['$scope', '$routeParams', '$resource', function ($scope, $routeParams, $resource) {
    var userId = $routeParams.userId;
    $scope.userDetail = {};

    /* Pull user from db */
    var User = $resource('/user/' + userId);
    User.get({_id: userId}).$promise.then(function(user) {
        $scope.userDetail = {
            name: user.first_name + ' ' + user.last_name,
            location: user.location,
            description: user.description,
            occupation: user.occupation,
            id: user._id,
        };
        $scope.main.currentUser = $scope.userDetail.name;
        $scope.main.currentView = '';
    });

    /* Pull profile picture from db */
    var Photos = $resource('/photosOfUser/' + userId);
    Photos.query({}).$promise.then(function(photos) {
        $scope.userDetail.photo = photos[0].file_name;
    });
}]);