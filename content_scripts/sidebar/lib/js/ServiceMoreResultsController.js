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

serviceCreator.controller('ServiceMoreResultsController', function($scope, $state) {

    AbstractController.call(this, $scope, $state);

    $scope.loadValidationRules = function() { }
    $scope.loadPrevStep = function() {
    	
		$scope.disableDomElementSelection(me.triggablesSelector); 
    	$state.go('ServiceResultsNaming')
    };
    $scope.loadNextStep = function() {
      if($scope.areRequirementsMet()){

      	var nextFormState = new window[me.retrievalStrategy]().getConfigurationFormState();
	    if(nextFormState == undefined) nextFormState = "ServiceFilters";
	    console.log(nextFormState);
      }
    };
    $scope.loadSubformBehaviour = function() { 

      $scope.loadStrategySelectionBehaviour();
    };
    $scope.onTriggerSelection = function(data){
		$scope.currentTriggerStrategy.onTriggerSelection(data);
	}
	$scope.showMissingRequirementMessage = function(){
		$scope.currentTriggerStrategy.showMissingRequirementMessage();
	};
	$scope.areRequirementsMet = function(){

		return $scope.currentTriggerStrategy.areRequirementsMet();
	};
	$scope.associateTriggeringStrategiesBehaviour = function(){

		document.querySelector('#trigger_mechanism').onchange = function(){

			$scope.clearTriggeringStrategyParamsArea();
			$scope.currentTriggerStrategy.undoActionsOnDom();

			$scope.currentTriggerStrategy = new window[this.value]($scope);
			$scope.currentTriggerStrategy.loadParamsConfigControls();
		};
		document.querySelector('#trigger_mechanism').onchange();
	};
	$scope.clearTriggeringStrategyParamsArea = function(){
		document.querySelector("#trigger_mechanism_params_area").innerHTML = "";
	};
	$scope.addParamsConfigurationControls = function(controls){
		document.querySelector("#trigger_mechanism_params_area").appendChild(controls);
	};
	$scope.isElementSelected = function(elemType) {
		return ($scope.userDefInputXpath)? true : false;
	};
	$scope.loadStrategySelectionBehaviour = function() {

		var me = this;
		document.querySelectorAll(".list-group-item").forEach(function(option){
			option.addEventListener("click", function(){
				if(!this.classList.contains("active")){

					me.unselectAllRadios();
					this.classList.add("active");
					this.querySelector("input[type=radio]").click();
					me.retrievalStrategy = this.querySelector("input[type=radio]").getAttribute("value");
				}
			});
		});
	};
	$scope.unselectAllRadios = function() {
		document.querySelectorAll(".list-group-item").forEach(function(option){
			option.classList.contains("active")
				option.classList.remove("active");
		});
	};
    $scope.initialize();
});