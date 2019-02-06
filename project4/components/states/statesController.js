/**
 * Define StatesController for the states component of CS142 project #4
 * problem #2.  The model data for this view (the states) is available
 * at window.cs142models.statesModel().
 */

cs142App.controller('StatesController', ['$scope', function($scope) {
   if ($scope.main) {
      $scope.main.title = 'CS142 Project #4 - States';
   }

   /*
    * This object contains any variables that change throughout use.
    */
   $scope.states = {
      // Stores original list of states.
      allStates: window.cs142models.statesModel().sort(),

      // Keeps track of which states are currently visible.
      visibleStates: window.cs142models.statesModel().sort(),

      // Keeps track of input field value.
      inputString: '',

      // Keeps track of the substring used to filter the states.
      substring: '',
   };

   /* 
    * Filters out states that don't contain the parameter as a substring.
    */
   $scope.filterStates = function(substring) {
      $scope.states.visibleStates = substring ? $scope.states.allStates.filter(state => state.toLowerCase().includes(substring.toLowerCase())) : $scope.states.allStates; 
      $scope.states.substring = substring;
   }
}]);
