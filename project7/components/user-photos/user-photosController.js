'use strict';

cs142App.controller('UserPhotosController', ['$scope', '$routeParams', '$resource', function($scope, $routeParams, $resource) {
    /* Pulled from URL routing. */
    var userId = $routeParams.userId;
    $scope.photos = {};
    $scope.photos.newComments = {};

    /* Pull user from db */
    var User = $resource('/user/' + userId);
    User.get({_id: userId}).$promise.then(function (user) {
        $scope.main.currentView = 'Photos of ';
        $scope.main.currentUser = user.first_name + ' ' + user.last_name;
    }, function (err) {
        console.log(JSON.stringify(err));
    });

    /* Pull user's photos from db */
    var Photos = $resource('/photosOfUser/' + userId);
    Photos.query({_id: userId}).$promise.then(function (photos) {
        $scope.photos.list = photos;
    }, function (err) {
        console.log(JSON.stringify(err));
    });

    /* Returns commenter's name as a string. */
    $scope.getUserName = function (comment) {
        return comment.user.first_name + " " + comment.user.last_name;
    };

    /* Returns date as a readable string. */
    $scope.getDate = function (date) {
        let d = new Date(date);
        return d.toDateString() + " at " + d.toLocaleTimeString();
    };

    /* Adds comment to photo, written by logged in user. */
    $scope.addComment = function (index) {
        var Comment = $resource('/commentsOfPhoto/' + $scope.photos.list[index]._id)
        Comment.save({ comment: $scope.photos.newComments[index] }).$promise.then(function (comment) {
            $scope.photos.list[index].comments.push(comment); 
            $scope.photos.newComments[index] = '';
        }, function (err) {
            if (err) {
                console.log(JSON.stringify(err));
                alert('Comment needs to be nonempty');
            }
        });
    };
}]);
