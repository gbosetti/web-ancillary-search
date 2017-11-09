serviceCreator.controller('ServiceNameController', function($scope, $state, ServiceService) {

    AbstractController.call(this, $scope, $state);

    $scope.service = { name: "" };

    $scope.loadDataModel = function() {
      ServiceService.getService().then(function(service) {
        $scope.service.name = service.name;
      }); 
    };
    $scope.saveDataModel = function() {
      ServiceService.setName($scope.service.name);
    };
    
    $scope.getValidationRules = function() {
      return {  
        "search_service_name": {
            "minlength": 2,
            "required": true
        }
      };
    }
    $scope.loadSubformBehaviour = function() { 

      $scope.callPlaceholderNameAdaptation();
    };
    $scope.callPlaceholderNameAdaptation = function() {
      //The only way I ound to communicate the iframe content to the outside
      browser.runtime.sendMessage({
        call: "adaptPlaceholder",
        args: { scoped: "#search_service_name", callback: 'adaptPlaceholderExample' }
      });
    };
    $scope.removeErrorMessages = function() {
      $scope.hideErrorMessage("nameAlreadyExistsError");
    };
    $scope.loadNextStep = function(nextState) {

      if($scope.areRequirementsMet()){
        ServiceService.uniqueNameService($scope.service.name).then(function(nameAlreadyExists) {

          if(!nameAlreadyExists){
            $scope.saveDataModel();
            $scope.undoActionsOnDom();
            $state.go(nextState);
          }
          else{
            $scope.showErrorMessage("nameAlreadyExistsError", "#search_service_name", "service_name_already_exists");
            $scope.focusElement("#search_service_name");
          };
        }); 
      };
    };
    
    $scope.initialize();
});