/**
 * Define StatesController for the states component of CS142 project #4
 * problem #2.  The model data for this view (the states) is available
 * at window.cs142models.statesModel().
 */

cs142App.controller('StatesController', ['$scope', function($scope) {

   // Replace this with the code for CS142 Project #4, Problem #2
   // console.log('window.cs142models.statesModel()', JSON.stringify(window.cs142models.statesModel()));

   if ($scope.main) {
      $scope.main.title = 'CS142 Project #4 - States';
   }

   /*
    * Stores original list of states.
    */
   $scope.states = window.cs142models.statesModel().sort();

   /*
    * Keeps track of which states are currently displayed. 
    */
   $scope.visibleStates = $scope.states;

   /* 
    * Keeps track of input field value.
    */
   $scope.inputString = '';

   /* 
    * Keeps track of the substring used to filter the states.
    */
   $scope.substring = '';

   /* 
    * Filters out states that don't contain the parameter as a substring.
    */
   $scope.filterStates = function(substring) {
      $scope.visibleStates = substring ? $scope.states.filter(state => state.toLowerCase().includes(substring.toLowerCase())) : $scope.states; 
      $scope.substring = substring;
   }
}]);
