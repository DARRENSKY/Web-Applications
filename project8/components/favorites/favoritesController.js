'use strict';

cs142App.controller('FavoritesController', ['$scope', '$resource', '$mdDialog', function ($scope, $resource, $mdDialog) { 
    $scope.favorites = {};

    /* Gets current user's list of favorites */
    var Favorites = $resource('/favorites');
    Favorites.query({}).$promise.then(function (favorites) {
        $scope.favorites.list = favorites; 
    }, function (err) {
        console.log(JSON.stringify(err));
    });

    /* Removes a favorite from current user's favorite list */
    $scope.deleteFavorite = function (favorite) {
        var RemoveFavorite = $resource('/favorites/delete');
        RemoveFavorite.save({ photoID: favorite._id }).$promise.then(function (response) {
            $scope.favorites.list = $scope.favorites.list.filter(photo => photo._id !== favorite._id);
        }, function (err) {
            console.log(JSON.stringify(err));
        });
    };

    /* Displays a modal with the thumbnail expanded to a larger view */
    $scope.showModal = function (favorite) {
        let date = (new Date(favorite.date_time)).toLocaleString();
        $mdDialog.show({
            template: 
                '<div style="display: flex; flex-direction: column; align-items: center">' +
                    '<img ng-src="/images/' + favorite.file_name + '">' + 
                    '<text style="padding: 15px 0px 15px 0px">' + date + '</text>' +
                '</div>',
            clickOutsideToClose: true,
        });
    };
}]);