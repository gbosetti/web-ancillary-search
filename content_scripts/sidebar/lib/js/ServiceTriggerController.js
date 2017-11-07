function TriggerMechanism(client, data){

	this.loadProperties = function(data){

		if(data)
			Object.keys(data).forEach(function(key) {
			    this[key] = data[key];
			});
	}
	this.loadParamsConfigControls = function(){}
	this.getProperties = function(){ return {} };
	this.undoActionsOnDom = function(){};
	this.areRequirementsMet = function(){ return false };
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
	this.onTriggerSelection = function(data){ console.log("default onTriggerSelection"); };

	this.loadProperties(data);
}
function UnsetTrigger(client, data){
	TriggerMechanism.call(this, client, data);
}
function ClickBasedTrigger(client, data){
	TriggerMechanism.call(this, client, data);

	this.selector = '';

	this.getProperties = function(){
		return {
			"className": this.constructor.name,
			"selector": this.selector
		};
	};
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
	this.areRequirementsMet = function(){
		return (this.triggerSelector)? true : false;
	};
	this.onTriggerSelection = function(data){

		client.showFormElement("#user-selected-trigger-element");
		client.loadPreview("#user-selected-trigger-element-img", data.previewSource);
		this.triggerSelector = data.selectors;
		this.removeErrorMessage();
	};
}
function EnterBasedTrigger(client, data){
	TriggerMechanism.call(this, client, data);

	this.loadParamsConfigControls = function(){
		client.addParamsConfigurationControls(document.createTextNode("EnterBasedTrigger"));
	}
}
function TypeAndWaitBasedTrigger(client, data){
	TriggerMechanism.call(this, client, data);

	this.loadParamsConfigControls = function(){
		client.addParamsConfigurationControls(document.createTextNode("TypeAndWaitBasedTrigger"));
	}
}






serviceCreator.controller('ServiceTriggerController', function($scope, $state, ServiceService) {

    AbstractController.call(this, $scope, $state);

    $scope.service = { 
      	trigger: {
	        strategy: new UnsetTrigger($scope)      
	    }
    };
    ServiceService.logService();

    $scope.loadDataModel = function() {
    	$scope.loadDataModel = function() {
	      ServiceService.getService().then(function(service) {
	      	$scope.service.trigger.strategy = new window[service.trigger.strategy.className]($scope, service.trigger.strategy);
	      }); 
	    };
    };
    $scope.saveDataModel = function() {
    	ServiceService.setTrigger({
    		"strategy": $scope.trigger.strategy.getProperties()
		});	
    };
    $scope.loadValidationRules = function() { }
    $scope.undoActionsOnDom = function() {
    	$scope.service.trigger.strategy.undoActionsOnDom();
    };
    $scope.loadSubformBehaviour = function() { 
      $scope.associateTriggeringStrategiesBehaviour();
    };

    $scope.onTriggerSelection = function(data){
		$scope.service.trigger.strategy.onTriggerSelection(data);
	}
	$scope.showMissingRequirementMessage = function(){
		$scope.service.trigger.strategy.showMissingRequirementMessage();
	};
	$scope.areRequirementsMet = function(){
		return $scope.service.trigger.strategy.areRequirementsMet();
	};
	$scope.associateTriggeringStrategiesBehaviour = function(){
		document.querySelector('#trigger_mechanism').onchange = function(){

			$scope.clearTriggeringStrategyParamsArea();
			$scope.service.trigger.strategy.undoActionsOnDom();
			$scope.service.trigger.strategy = new window[this.value]($scope, {});
			$scope.service.trigger.strategy.loadParamsConfigControls();
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
		return ($scope.service.userDefInputXpath)? true : false;
	};
    $scope.initialize();
});