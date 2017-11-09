serviceCreator.controller('ServiceResultsNamingController', function($scope, $state, ServiceService) {

    AbstractController.call(this, $scope, $state);
    $scope.service = { 
      results: { name: undefined }
    };
    
    $scope.loadDataModel = function() {
      ServiceService.getService().then(function(service) {
        $scope.service.results.name = service.results.name;
      }); 
    };
    $scope.saveDataModel = function() {
      ServiceService.setCurrentServiceKey($scope.service.results.name);
      ServiceService.setResultsName($scope.service.results.name);
    };
    $scope.getValidationRules = function() {
      return {  
          "results_tag": {
            "minlength": 2,
            "required": true
          }
      };
    }
    $scope.loadSubformBehaviour = function() { };
    $scope.initialize();
});