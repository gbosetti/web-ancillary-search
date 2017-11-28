function TriggerMechanism(client, props){

	this.loadProperties = function(data){

		if(data){
			var me = this;
			Object.keys(data).forEach(function(key) {
			    me[key] = data[key];
			});
		}
	}
	this.loadParamsConfigControls = function(){};
	this.loadSubformBehaviour = function(){};
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

	this.loadProperties(props);
}
function UnsetTrigger(client, props){
	TriggerMechanism.call(this, client, props);
}
function ClickBasedTrigger(client, props){

	this.selector = undefined;
	this.preview = undefined;

	TriggerMechanism.call(this, client, props);

	this.getProperties = function(){

		return {
			"className": this.constructor.name,
			"selector": this.selector,
			"preview": this.preview 
		};
	};
	this.loadParamsConfigControls = function(){
		client.enableDomElementSelection(client.triggablesSelector, "onTriggerSelection", ".container");
		var preview = client.createPreviewControl("user-selected-trigger-element", "selected_trigger_control", this.preview);
		client.addParamsConfigurationControls(preview);
	};
	this.loadSubformBehaviour = function(){

		if(this.preview){
			client.showAllHiddenElements();
		}
		else {
			client.hideFormElement("#trigger_mechanism_params_area");
			client.hideFormElement(".next");
		}
	};
	this.undoActionsOnDom = function(){
		client.disableDomElementSelection(client.triggablesSelector);

		return browser.runtime.sendMessage({ 
	        "call": "executeSearchWith",
	        "args": {
	          "strategy": "ClickBasedTrigger",
	          "props": {
	          	"inputSelector": client.service.input.selector,
		        "triggerSelector": client.service.trigger.strategy.selector,
		        "nextAuthoringState": "ResultsSelection"
	          }
	        }
	      });
	};
	this.getMissingRequirementLocalizedId = function(){
		return "click_on_trigger_error"
	};
	this.areRequirementsMet = function(){
		return (this.selector)? true : false;
	};
	this.onTriggerSelection = function(data){
		
  		client.showAllHiddenElements();
		client.loadPreview("#user-selected-trigger-element-img", data.previewSource);
		this.selector = data.selectors["1"][0];
		this.preview = data.previewSource;
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

    AbstractController.call(this, $scope, $state, ServiceService);

    $scope.service = { 
      	trigger: {
	        strategy: new UnsetTrigger($scope)  
	    }
    };

    $scope.loadDataModel = function() {
      ServiceService.getService().then(function(service) {
      	
      	$scope.service.input = service.input;
      	$scope.associateTriggeringStrategiesBehaviour(service.trigger.strategy);
      }); 
    };
    $scope.loadNextStep = function(nextState) {

      if($scope.areRequirementsMet()){
        $scope.saveDataModel();
        ServiceService.updateServices();

        $scope.undoActionsOnDom().then(function(){
        	$state.go(nextState);
        });
      }
    };
    $scope.saveDataModel = function() {
    	ServiceService.setTrigger({
    		"strategy": $scope.service.trigger.strategy.getProperties()
		});	
    };
    $scope.loadValidationRules = function() { }
    $scope.undoActionsOnDom = function() {
    	return $scope.service.trigger.strategy.undoActionsOnDom();
    };
    $scope.loadSubformBehaviour = function() { 
      //mowing this to loadDataModel because some of the UI depend on the strategy
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
	$scope.associateTriggeringStrategiesBehaviour = function(strategy){

		document.querySelector('#trigger_mechanism').value = strategy.className;

		document.querySelector('#trigger_mechanism').onchange = function(){

			$scope.clearTriggeringStrategyParamsArea();
			$scope.service.trigger.strategy.undoActionsOnDom();			
			$scope.service.trigger.strategy = new window[this.value]($scope, strategy || {});
			$scope.service.trigger.strategy.loadParamsConfigControls();
			$scope.service.trigger.strategy.loadSubformBehaviour();
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