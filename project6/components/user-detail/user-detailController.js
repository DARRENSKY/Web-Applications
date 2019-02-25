'use strict';

cs142App.controller('UserDetailController', ['$scope', '$routeParams', function ($scope, $routeParams) {
    var userId = $routeParams.userId;
    $scope.userDetail = {};

    /* Gets current user's details. */
    let getUser = function(response) {
        let user = JSON.parse(response.responseText);
        $scope.$apply(function () {
            $scope.userDetail.name = user.first_name + ' ' + user.last_name;
            $scope.userDetail.location = user.location;
            $scope.userDetail.description = user.description;
            $scope.userDetail.occupation = user.occupation;
            $scope.userDetail.id = user._id;
            $scope.main.currentUser = $scope.userDetail.name;
            $scope.main.currentView = '';
        });
    };
    $scope.FetchModel('/user/' + userId, getUser);

    /* Gets profile photo for current user. */
    $scope.getPhoto = function(response) {
        let photo = JSON.parse(response.responseText)[0].file_name;
        $scope.$apply(function() {
            $scope.userDetail.photo = photo;
        });
    };
    $scope.FetchModel('/photosOfUser/' + userId, $scope.getPhoto);
}]);