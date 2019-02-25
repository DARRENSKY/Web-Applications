'use strict';

cs142App.controller('UserListController', ['$scope', function ($scope) {
    $scope.main.title = 'Users';
    $scope.users = {};

    /* Gets list of all user objects. */
    let loadUserList = function(response) {
        $scope.$apply(function() {
            $scope.users.list = JSON.parse(response.responseText); 
        });
    };
    $scope.FetchModel('/user/list', loadUserList);
}]);