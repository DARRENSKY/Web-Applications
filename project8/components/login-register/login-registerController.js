'use strict';

cs142App.controller('LoginRegisterController', ['$scope', '$resource', '$location', function ($scope, $resource, $location) {
    /* State for login fields */
    $scope.log = {
        loginName: '',
        password: '',
    };

    /* State for register fields */
    $scope.register = {
        firstName: '',
        lastName: '',
        loginName: '',
        location: '',
        description: '',
        occupation: '',
        password: '',
        confirmPassword: '',
    };

    /* Login function */
    var LoggedInUser = $resource('/admin/login');
    $scope.login = function () {
        if (!$scope.log.loginName) {
            alert('Please enter your username');
            return;
        } else if (!$scope.log.password) {
            alert('Please enter your password');
            return;
        }

        LoggedInUser.save({
            login_name: $scope.log.loginName,
            password: $scope.log.password
        }).$promise.then(function (loggedInUser) {
            $scope.main.loggedInUser = loggedInUser;
            $scope.main.message = 'Hi ' + loggedInUser.first_name; 
            $scope.main.updateRecentActivity(loggedInUser._id, {action: 'logged in'});
            $location.path('/users/' + loggedInUser._id);
        }, function (err) {
            console.log(JSON.stringify(err));
            alert('Account with the username and password you entered does not exists');
        });
    };

    /* Register function */
    var NewUser = $resource('/user');
    $scope.register = function () {
        if (!$scope.register.firstName) { 
            alert('Please fill out your first name');
            return;
        } else if (!$scope.register.lastName) {
            alert('Please fill out your last name');
            return;
        } else if (!$scope.register.loginName) {
            alert('Please fill out your username');
            return;
        } else if (!$scope.register.password) {
            alert('Password is required');
        } else if ($scope.register.password !== $scope.register.confirmPassword) {
            alert('Passwords don\'t match');
            return; 
        }

        NewUser.save({
            first_name: $scope.register.firstName,
            last_name: $scope.register.lastName,
            login_name: $scope.register.loginName,
            location: $scope.register.location ? $scope.register.location : '',
            description: $scope.register.description ? $scope.register.description : '',
            occupation: $scope.register.occupation ? $scope.register.occupation : '',
            password: $scope.register.password,
        }).$promise.then(function (user) {
            $scope.register.firstName = '';
            $scope.register.lastName = '';
            $scope.register.loginName = '';
            $scope.register.location = '';
            $scope.register.description = '';
            $scope.register.occupation = '';
            $scope.register.password = '';
            $scope.register.confirmPassword = '';
            $scope.main.updateRecentActivity(user._id);
            alert('Successfully created account');
        }, function (err) {
            console.log(JSON.stringify(err));
            alert('Username already taken');
        });
    };
}]);