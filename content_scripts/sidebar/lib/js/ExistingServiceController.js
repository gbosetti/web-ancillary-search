serviceCreator.controller('ExistingServiceController', function($scope, $state, ServiceService) {

    AbstractController.call(this, $scope, $state);

    $scope.loadSubformBehaviour = function() {

      browser.runtime.sendMessage({
        call: "getCurrentUrl",
        args: { scoped: ".next", callback: 'onUrlNotification' }
      });
    };
    $scope.onUrlNotification = function(data){

      ServiceService.getMatchingServices(data.url).then(function(services) {
        
        if(Object.keys(services).length > 0){
          $scope.loadExistingServicesInstructions();
          $scope.loadExistingServices(services);
        }
        else {
          $scope.loadNoServicesFoundInstructions();
        }
        $scope.localize();
        ServiceService.setCurrentServiceKey(undefined);

      }); 
    };
    $scope.loadExistingServicesInstructions = function(){
      document.querySelector("#welcome_instructions").setAttribute("i18n-data", "matching_services_instructions");
    };
    $scope.loadNoServicesFoundInstructions = function(){
      document.querySelector("#welcome_instructions").setAttribute("i18n-data", "no_matching_services_instructions");
    };
    $scope.areRequirementsMet = function(){
      return true;
    };
    $scope.loadServiceUI = function(service){

      var listItem = document.createElement("li");
          listItem.className = "list-group-item justify-content-between list-group-item-action";
          listItem.innerHTML =  service.name;

      var label = document.createElement("span");
          label.className = "btn btn-default btn-list";
          label.innerHTML = "<i class='glyphicon glyphicon-edit'></i>";
          listItem.appendChild(label);

      document.querySelector("#existing_services").appendChild(listItem);
  	};
    $scope.loadExistingServices = function(services){
      Object.keys(services).forEach(function(key) {
        $scope.loadServiceUI(services[key]);
      });
    }
    $scope.initialize();
});