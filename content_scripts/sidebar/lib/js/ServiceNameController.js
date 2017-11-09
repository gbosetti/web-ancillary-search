serviceCreator.controller('ServiceNameController', function($scope, $state, ServiceService) {

    AbstractController.call(this, $scope, $state);

    $scope.service = { name: "", url: undefined};

    $scope.loadDataModel = function() {
      ServiceService.getService().then(function(service) {
        if(service){
          $scope.service.name = service.name;
          $scope.service.url = service.url;
        }
      }); 
    };
    $scope.saveDataModel = function() {
      ServiceService.setCurrentServiceKey($scope.service.name);
      ServiceService.setName($scope.service.name);
      ServiceService.setUrl($scope.service.url);

      /*browser.runtime.sendMessage({
        call: "getCurrentUrl",
        args: { scoped: ".next", callback: 'saveUrl' }
      });*/      
    };
    $scope.saveUrl = function() {
      ServiceService.setUrl($scope.service.url);
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
    $scope.adaptPlaceholderExample = function(data) {
      document.querySelector("#search_service_name").setAttribute(
        "placeholder", 
        document.querySelector("#search_service_name").getAttribute("placeholder") + " " + data.domainName
      );
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