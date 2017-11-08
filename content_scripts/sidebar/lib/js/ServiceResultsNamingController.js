serviceCreator.controller('ServiceResultsNamingController', function($scope, $state, ServiceService) {

    AbstractController.call(this, $scope, $state);
    $scope.service = { 
      results: { name: undefined }
    };

    $scope.loadDataModel = function() {
      ServiceService.getService().then(function(service) {
        console.log("loading", service.results);
        $scope.service.results.name = service.results.name;
      }); 
    };
    $scope.saveDataModel = function() {
      console.log("saving", $scope.service.results);
      ServiceService.setResultsName($scope.service.results.name);
    };
    $scope.loadValidationRules = function() {
      $('form').validate({  "rules": {
          "results_tag": {
              "minlength": 2,
              "required": true
          }
      }});
    };
    $scope.areRequirementsMet = function(){
    	return ($scope.results && $scope.results.name)? true:false;
    };
    $scope.loadSubformBehaviour = function() { };
    $scope.initialize();
});