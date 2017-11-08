function MoreResultsRetrieval(client){ 
	this.getConfigurationFormState = function(data){};
}
function ClickBasedRetrieval(client){
	MoreResultsRetrieval.call(this, client);

	this.getConfigurationFormState = function(data){ 
		return "ServiceMoreResultsSelection";
	};
}
function ScrollDownBasedRetrieval(client){
	MoreResultsRetrieval.call(this, client);
}


function MoreElementsConfig(){

	this.adaptPlaceholderExample = function(data) {
		document.querySelector("#search_service_name").setAttribute(
			"placeholder", 
			document.querySelector("#search_service_name").getAttribute("placeholder") + " " + data.domainName
		);
	};
};

serviceCreator.controller('ServiceMoreResultsController', function($scope, $state, ServiceService) {

    AbstractController.call(this, $scope, $state);

    $scope.moreResults = {
    	strategy: {
    		className: undefined,
    	}
    };

    $scope.loadDataModel = function() {
      ServiceService.getService().then(function(service) {
        $scope.service.moreResults.strategy = service.moreResults.strategy;
      }); 
    };
    $scope.saveDataModel = function() {
      ServiceService.setInput($scope.service.moreResults.strategy);
    };
    $scope.undoActionsOnDom = function() {
		$scope.disableDomElementSelection(me.triggablesSelector); 
    };
    $scope.loadNextStep = function() {
      if($scope.areRequirementsMet()){

      	var nextFormState = new window[me.moreResults.strategy]().getConfigurationFormState();
	    if(nextFormState == undefined) nextFormState = "ServiceFilters";
	    console.log(nextFormState);
      }
    };
    $scope.loadSubformBehaviour = function() { 

    };
    $scope.onTriggerSelection = function(data){
		$scope.moreResults.strategy.onTriggerSelection(data);
	}
	$scope.showMissingRequirementMessage = function(){
		$scope.moreResults.strategy.showMissingRequirementMessage();
	};
	$scope.areRequirementsMet = function(){

		return $scope.moreResults.strategy.areRequirementsMet();
	};
	$scope.addParamsConfigurationControls = function(controls){
		document.querySelector("#trigger_mechanism_params_area").appendChild(controls);
	};
	$scope.isElementSelected = function(elemType) {
		return ($scope.userDefInputXpath)? true : false;
	};
	$scope.loadStrategyConfig = function(option){
		console.log("HOLA");
		console.log(option);
		if(!option.classList.contains("active")){

			console.log(1);
			$scope.unselectAllRadios();
			console.log(2);
			option.classList.add("active");
			console.log(3);
			option.querySelector("input[type=radio]").click();
			console.log(4);
			$scope.moreResults.strategy = option.querySelector("input[type=radio]").getAttribute("value");
		}
	};
	$scope.unselectAllRadios = function() {
		document.querySelectorAll(".list-group-item").forEach(function(option){
			option.classList.contains("active")
				option.classList.remove("active");
		});
	};
    $scope.initialize();
});