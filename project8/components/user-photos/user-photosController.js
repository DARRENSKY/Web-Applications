'use strict';

cs142App.controller('UserPhotosController', ['$scope', '$routeParams', '$resource', function($scope, $routeParams, $resource) {
    /* Pulled from URL routing. */
    var userId = $routeParams.userId;

    $scope.photos = {
        list: [],
        newComments: {},
    };

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
        for (let i = 0; i < photos.length; i++) {
            let favorited = $scope.main.loggedInUser.favorites.includes(photos[i]._id);
            let liked = photos[i].likes.includes($scope.main.loggedInUser._id);
            let numLikes = photos[i].likes.length;
            $scope.photos.list.push({
                photo: photos[i], 
                favorited: favorited, 
                liked: liked,
                numLikes: numLikes, 
            });
        }
        $scope.photos.list.sort(function (photoA, photoB) {
            if (photoA.numLikes === photoB.numLikes) {
                return photoA.photo.date_time < photoB.photo.date_time ? 1 : -1;
            }
            return photoB.numLikes - photoA.numLikes;
        });
    }, function (err) {
        console.log(JSON.stringify(err));
    });

    /* Returns commenter's name as a string. */
    $scope.getUserName = function (comment) {
        return comment.user.first_name + " " + comment.user.last_name;
    };

    /* Returns date as a readable string. */
    $scope.getDate = function (date) {
        return (new Date(date)).toLocaleString();
    };

    /* Adds comment to photo, written by logged in user. */
    $scope.addComment = function (index) {
        var Comment = $resource('/commentsOfPhoto/' + $scope.photos.list[index].photo._id);
        Comment.save({ comment: $scope.photos.newComments[index] }).$promise.then(function (comment) {
            $scope.photos.list[index].photo.comments.push(comment); 
            $scope.photos.newComments[index] = '';
            $scope.main.updateRecentActivity($scope.main.loggedInUser._id, {action: 'commented on a photo'});
        }, function (err) {
            console.log(JSON.stringify(err));
            alert('Comment needs to be nonempty');
        });
    };

    /* Favorites a photo by adding to current user's list of favorites */
    $scope.favorite = function (index) {
        var Favorite = $resource('/favorites');
        Favorite.save({ photoID: $scope.photos.list[index].photo._id }).$promise.then(function (response) {
            $scope.photos.list[index].favorited = true;
        }, function (err) {
            console.log(JSON.stringify(err));
        });
    };

    /* Likes a photo by adding current user's id to list of likes on photo */
    $scope.like = function (index, alreadyLiked) {
        var Like = $resource('/like');
        Like.save({ photoID: $scope.photos.list[index].photo._id, alreadyLiked: alreadyLiked }).$promise.then(function (response) {
            $scope.photos.list[index].liked = !$scope.photos.list[index].liked;
            $scope.photos.list[index].numLikes += alreadyLiked ? -1 : 1; 
        }, function (err) {
            console.log(JSON.stringify(err));
        });
    };
}]);
