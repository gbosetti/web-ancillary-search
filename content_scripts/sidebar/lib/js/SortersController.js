function SortersMechanism(client) {
  this.getConfigurationFormState = function(){
    return "EndOfProcess";
  };
}
function NoSorters(client){
  MoreResultsRetrieval.call(this, client);
}
function ClickBasedSorter(client){
  MoreResultsRetrieval.call(this, client);
}
function MultipleActionsSorter(client){
  MoreResultsRetrieval.call(this, client);
}


serviceCreator.controller('SortersController', function($scope, $state, ServiceService) {

    AbstractController.call(this, $scope, $state, ServiceService);

    $scope.service = { 
      sorters: undefined /*this should be a collection of sorters with at least a name and a selector*/
    };

    $scope.loadDataModel = function() {
      ServiceService.getService().then(function(service) {

        if(service.sorters){
          $scope.service.sorters = service.sorters;
        }
        
        document.querySelector("#" + $scope.service.sorters).checked = true;
      });
    };
    $scope.saveDataModel = function() {
      ServiceService.setSorters($scope.service.sorters).then(function(){
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
        $scope.service.sorters = container.querySelector("input[type=radio]").getAttribute("value");
        container.querySelector("input[type=radio]").click();
      }
    };
    $scope.areRequirementsMet = function() { 
      return true 
    };
    
    $scope.initialize();
});