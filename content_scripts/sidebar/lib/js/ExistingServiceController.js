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

      var listItem = document.createElement("button");
          listItem.className = "list-group-item";
          listItem.textContent = service.name;

      /*var heading = document.createElement("div");
          heading.className = "list-group-item-heading";
          listItem.appendChild(heading);

      var label = document.createElement("label");
          label.className = "list-group-item-label-for-radio";
          label.setAttribute("for", service.name); 
          label.textContent = service.name;
          heading.appendChild(label); 

      var description = document.createElement("p");
          description.setAttribute("class", "list-group-item-text small"); 
          description.textContent = "Displaying: [TODO:service.results.properties]";
          //description.setAttribute("i18n-data", "click_for_more_results_info");
          listItem.appendChild(description);*/

      document.querySelector("#existing_services").appendChild(listItem);
  	};
    $scope.loadExistingServices = function(services){
      Object.keys(services).forEach(function(key) {
        $scope.loadServiceUI(services[key]);
      });
    }
    $scope.initialize();
});