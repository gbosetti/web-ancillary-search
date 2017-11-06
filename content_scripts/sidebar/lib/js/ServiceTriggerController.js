function TriggerMechanism(client){
	this.loadParamsConfigControls = function(){}
	this.undoActionsOnDom = function(){};
	this.areTriggerRequirementsMet = function(){ return false };
	this.showMissingRequirementMessage = function(){
		if(!client.hasErrorMessage("strategy-error")) //Avoiding extras
			client.showErrorMessage("strategy-error", 
				"#trigger_mechanism_params_area", 
				this.getMissingRequirementLocalizedId());
	};
	this.getMissingRequirementLocalizedId = function(){ return "default_missing_requirement" };
	this.removeErrorMessage = function(){
		if(client.hasErrorMessage("strategy-error"))
			client.removeErrorMessage("strategy-error");
	};
	this.onTriggerSelection = function(data){ console.log("lalala "); };
}
function UnsetTrigger(client){
	TriggerMechanism.call(this, client);
}
function ClickBasedTrigger(client){
	TriggerMechanism.call(this, client);

	this.triggerSelector;

	this.loadParamsConfigControls = function(){
		client.enableDomElementSelection(client.triggablesSelector, "onTriggerSelection", "#trigger_mechanism");
		var preview = client.createPreviewControl("user-selected-trigger-element", "selected_trigger_control");
		client.addParamsConfigurationControls(preview);
	};
	this.undoActionsOnDom = function(){
		client.disableDomElementSelection(client.triggablesSelector);
	};
	this.getMissingRequirementLocalizedId = function(){
		return "click_on_trigger_error"
	};
	this.areTriggerRequirementsMet = function(){
		return (this.triggerSelector)? true : false;
	};
	this.onTriggerSelection = function(data){

		client.showFormElement("#user-selected-trigger-element");
		client.loadPreview("#user-selected-trigger-element-img", data.previewSource);
		this.triggerSelector = data.selectors;
		this.removeErrorMessage();
	};
}
function EnterBasedTrigger(client){
	TriggerMechanism.call(this, client);

	this.loadParamsConfigControls = function(){
		client.addParamsConfigurationControls(document.createTextNode("EnterBasedTrigger"));
	}
}
function TypeAndWaitBasedTrigger(client){
	TriggerMechanism.call(this, client);

	this.loadParamsConfigControls = function(){
		client.addParamsConfigurationControls(document.createTextNode("TypeAndWaitBasedTrigger"));
	}
}






serviceCreator.controller('ServiceTriggerController', function($scope, $state) {

    AbstractController.call(this, $scope, $state);

    $scope.fileDescription = " service-trigger.js";
	$scope.userDefInputXpath;
	$scope.currentTriggerStrategy = new UnsetTrigger($scope);

    $scope.loadValidationRules = function() { }
    $scope.loadPrevStep = function() {
    	$state.go('ServiceInput')
    };
    $scope.loadNextStep = function() {
      if($scope.areTriggerRequirementsMet()){
        $state.go('ServiceResultsSelection')
      }
    };
    $scope.loadSubformBehaviour = function() { 

      $scope.associateTriggeringStrategiesBehaviour();
    };

    $scope.onTriggerSelection = function(data){
		$scope.currentTriggerStrategy.onTriggerSelection(data);
	}
	$scope.showMissingRequirementMessage = function(){
		$scope.currentTriggerStrategy.showMissingRequirementMessage();
	};
	$scope.areTriggerRequirementsMet = function(){

		return $scope.currentTriggerStrategy.areTriggerRequirementsMet();
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
    $scope.initialize();
});