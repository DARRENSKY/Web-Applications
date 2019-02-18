'use strict';

cs142App.controller('UserPhotosController', ['$scope', '$routeParams', function($scope, $routeParams) {
    /* Pulled from URL routing. */
    var userId = $routeParams.userId;
    $scope.photos = {};

    /* Gets current user's name. */
    let getUser = function(response) {
        let user = JSON.parse(response.responseText);
        $scope.$apply(function() {
            $scope.main.currentView = 'Photos of ';
            $scope.main.currentUser = user.first_name + ' ' + user.last_name;
        });
    };
    $scope.FetchModel('/user/' + userId, getUser);

    /* Gets current user's photos. */
    let getPhotos = function(response) {
        let photos = JSON.parse(response.responseText);
        $scope.$apply(function() {
            $scope.photos.list = photos;
        });
    };
    $scope.FetchModel('/photosOfUser/' + userId, getPhotos);

    /* Returns commenter's name as a string. */
    $scope.getUserName = function(comment) {
        return comment.user.first_name + " " + comment.user.last_name;
    };

    /* Returns date as a readable string. */
    $scope.getDate = function(date) {
        let d = new Date(date);
        return d.toDateString() + " at " + d.toLocaleTimeString();
    };
}]);
