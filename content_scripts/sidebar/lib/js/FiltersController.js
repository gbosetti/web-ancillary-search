function FiltersMechanism(client) {
  this.getConfigurationFormState = function(){
    return "EndOfProcess";
  };
}
function NoFilter(client){
  FiltersMechanism.call(this, client);
}
function ClickBasedFilter(client){
  FiltersMechanism.call(this, client);
}
function MultipleActionsFilter(client){
  FiltersMechanism.call(this, client);
}


serviceCreator.controller('FiltersController', function($scope, $state, ServiceService) {

    AbstractController.call(this, $scope, $state, ServiceService);

    $scope.service = { 
      filters: undefined /*this should be a collection of filters with at least a name and a selector*/
    };

    $scope.loadDataModel = function() {
      ServiceService.getService().then(function(service) {

        if(service.filters){
          $scope.service.filters = service.filters;
        }
        
        document.querySelector("#" + $scope.service.filters).checked = true;
      });
    };
    $scope.saveDataModel = function() {
      ServiceService.setFilters($scope.service.filters).then(function(){
        ServiceService.updateServices();
        ServiceService.logService();
      });
    };
    $scope.loadSubformBehaviour = function() { 
      document.querySelectorAll(".list-group-item").forEach(function(elem){
        elem.onclick = function(){
          $scope.loadStrategyConfig(this);
        };
      });
    };
    $scope.loadStrategyConfig = function(container){

      if(!container.classList.contains("active-item")){

        $scope.unselectAllRadios();
        container.classList.add("active-item");
        $scope.service.filters = container.querySelector("input[type=radio]").getAttribute("value");
        container.querySelector("input[type=radio]").click();
      }
    };
    $scope.areRequirementsMet = function() { 
      return true 
    };
    
    $scope.initialize();
});