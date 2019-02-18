'use strict';

cs142App.controller('UserPhotosController', ['$scope', '$routeParams', function($scope, $routeParams) {
    /* Pulled from URL routing. */
    var userId = $routeParams.userId;
    let currentUser = window.cs142models.userModel(userId)

    $scope.main.currentView = "Photos of ";
    $scope.main.currentUser = currentUser.first_name + " " + currentUser.last_name;

    $scope.photos = {
        list: window.cs142models.photoOfUserModel(userId),  /* List of photos posted by user with userId. */
    };

    /* Returns commenter's name as a string. */
    $scope.getUserName = function(comment) {
        return comment.user.first_name + " " + comment.user.last_name;
    }

    /* Returns date as a readable string. */
    $scope.getDate = function(date) {
        let d = new Date(date);
        return d.toDateString() + " at " + d.toLocaleTimeString();
    }
}]);
