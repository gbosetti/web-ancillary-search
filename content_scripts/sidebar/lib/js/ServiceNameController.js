serviceCreator.controller('ServiceNameController', function($scope, $state, ServiceService) {

    AbstractController.call(this, $scope, $state);

    $scope.service = { name: undefined };

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
        "rules": {
          "search_service_name": {
            "minlength": 2,
            "required": true
          }
        }
      };
    };
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
        browser.i18n.getMessage("example_acronym") + " " + data.domainName
      );
      $scope.focusElement("#search_service_name");
    };
    $scope.initialize();
});