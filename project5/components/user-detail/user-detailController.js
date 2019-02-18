'use strict';

cs142App.controller('UserDetailController', ['$scope', '$routeParams', function ($scope, $routeParams) {
    var userId = $routeParams.userId;
    var user = window.cs142models.userModel(userId);

    /* Contains all necessary user details for user-detail page. */
    $scope.userDetail = {
        name: user.first_name + " " + user.last_name, 
        photo: window.cs142models.photoOfUserModel(userId)[0].file_name,
        location: user.location,
        description: user.description,
        occupation: user.occupation,
        id: user._id,
    };

    /* Adjust header. */
    $scope.main.currentUser = $scope.userDetail.name;
    $scope.main.currentView = "";
}]);