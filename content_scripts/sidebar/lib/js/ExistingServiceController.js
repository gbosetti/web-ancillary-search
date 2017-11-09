serviceCreator.controller('ExistingServiceController', function($scope, $state, ServiceService) {

    AbstractController.call(this, $scope, $state);

    $scope.loadSubformBehaviour = function() {

      browser.runtime.sendMessage({
        call: "getCurrentUrl",
        args: { scoped: ".next", callback: 'onUrlNotification' }
      });
    };
    $scope.onUrlNotification = function(data){

      console.log("calling getMatchingServices");
      ServiceService.getMatchingServices(data.url).then(function(services) {
        
        if(services.length > 0){
          console.log(333);
          $scope.loadExistingServicesInstructions();
          $scope.loadExistingServices(services);
        }
        else {
          console.log(444);
          $scope.loadNoServicesFoundInstructions();
        }
        console.log(555);
        $scope.localize();
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
  	$scope.loadExistingServices = function(services){
      for (var i = services.length - 1; i >= 0; i--) {
        console.log(services[i])
      }
    }
    $scope.initialize();
});