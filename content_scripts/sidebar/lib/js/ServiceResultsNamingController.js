serviceCreator.controller('ServiceResultsNamingController', function($scope, $state) {

    AbstractController.call(this, $scope, $state);

    $scope.loadValidationRules = function() {
      $('form').validate({  "rules": {
          "results_tag": {
              "minlength": 2,
              "required": true
          }
      }});
    }
    $scope.loadPrevStep = function() {
        $state.go('ServiceResultsSelection')
    };
    $scope.loadNextStep = function() {
      if($scope.areRequirementsMet()){
        $state.go('ServiceMoreResultsRetrieval')
      }
    };
    $scope.areRequirementsMet = function(){
    	return ($scope.results && $scope.results.name)? true:false;
    };
    $scope.loadSubformBehaviour = function() { };
    $scope.initialize();
});