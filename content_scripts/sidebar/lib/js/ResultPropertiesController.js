serviceCreator.controller('ResultPropertiesController', function($scope, $state, ServiceService) {

    AbstractController.call(this, $scope, $state);
    $scope.service = { 
      results: { name: undefined }
    };
    
    $scope.loadDataModel = function() {
      /*ServiceService.getService().then(function(service) {
        $scope.service.results.name = service.results.name;
      }); */
    };
    $scope.saveDataModel = function() {
      //ServiceService.setResultsName($scope.service.results.name);
    };
    $scope.areRequirementsMet = function() {
      return false;
    }
    $scope.loadSubformBehaviour = function() { 
      
    };
    $scope.initialize();
});