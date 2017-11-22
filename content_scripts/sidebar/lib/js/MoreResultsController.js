function MoreResultsRetrieval(client){ 
	this.getConfigurationFormState = function(data){};
}
function ClickBasedRetrieval(client){
	MoreResultsRetrieval.call(this, client);

	this.getConfigurationFormState = function(data){ 
		return "SortersSelection";
	};
}
function ScrollDownBasedRetrieval(client){
	MoreResultsRetrieval.call(this, client);
}
function NoMoreResults(client){
	MoreResultsRetrieval.call(this, client);

	this.getConfigurationFormState = function(data){ 
		return;
	};
}

serviceCreator.controller('MoreResultsController', function($scope, $state, ServiceService) {

    AbstractController.call(this, $scope, $state, ServiceService);

    $scope.service = {
    	"moreResults": {
	    	"className": 'NoMoreResults',
	    }
    };

    $scope.loadDataModel = function() {
      ServiceService.getService().then(function(service) {
        $scope.service.moreResults = service.moreResults;

        var option = document.querySelector("#" + $scope.service.moreResults.className);
        if(option) option.checked = true;
      }); 
    };
    $scope.saveDataModel = function() {
      ServiceService.setMoreResultsStrategy($scope.service.moreResults.className);
    };
    $scope.undoActionsOnDom = function() {
		$scope.disableDomElementSelection($scope.triggablesSelector); 
    };
    $scope.getValidationRules = function() { // areRequirementsMet < ... < areRequirementsMet
		return {
			"rules": {
		        "more_res_mechanism": {
		            "required": true
		        }
		    },
	        "messages": {
	          more_res_mechanism: browser.i18n.getMessage("this_field_is_required")
	        }
	    };
    };
    $scope.loadNextStep = function() {
      if($scope.areRequirementsMet()){
      	var nextFormState = (new window[$scope.service.moreResults.className]()).getConfigurationFormState();
	    if(nextFormState == undefined) nextFormState = "ServiceFilters";
	    $state.go(nextFormState);
      } 
    };
    $scope.loadSubformBehaviour = function() { 
    	document.querySelectorAll(".list-group-item").forEach(function(elem){
    		elem.onclick = function(){
    			$scope.loadStrategyConfig(this);
    		};
    	});
    };
	$scope.showMissingRequirementMessage = function(){
		$scope.service.moreResults.showMissingRequirementMessage();
	};
	$scope.addParamsConfigurationControls = function(controls){
		document.querySelector("#trigger_mechanism_params_area").appendChild(controls);
	};
	$scope.isElementSelected = function(elemType) {
		return ($scope.userDefInputXpath)? true : false;
	};
	$scope.loadStrategyConfig = function(container){

		if(!container.classList.contains("active-item")){

			$scope.unselectAllRadios();
			container.classList.add("active-item");
			$scope.service.moreResults.className = container.querySelector("input[type=radio]").getAttribute("value");
			container.querySelector("input[type=radio]").click();
		}
	};
	$scope.unselectAllRadios = function() {
		document.querySelectorAll(".list-group-item").forEach(function(option){
			if(option.classList != undefined && option.classList.contains("active-item"))
				option.classList.remove("active-item");
		});
	};
    $scope.initialize();
});