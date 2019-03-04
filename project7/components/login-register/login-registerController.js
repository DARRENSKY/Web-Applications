'use strict';

cs142App.controller('LoginRegisterController', ['$scope', '$resource', '$location', function ($scope, $resource, $location) {
    $scope.log = {
        loginName: '',
        password: '',
    };

    $scope.register = {
        loginName: '',
        password: '',
        confirmPassword: '',
    };

    var LoggedInUser = $resource('/admin/login');
    $scope.login = function() {
        LoggedInUser.save({login_name: $scope.log.loginName}).$promise.then(function(loggedInUser) {
            $scope.main.loggedInUser = loggedInUser;
            $scope.main.message = 'Hi ' + loggedInUser.first_name; 
            $location.path('/users/' + loggedInUser._id);
        }, function (err) {
            alert('Username does not exist');
        });
    }
}]);