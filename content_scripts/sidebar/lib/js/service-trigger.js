function TriggerMechanism(client){
	this.loadParamsConfigControls = function(){}
	this.undoActionsOnDom = function(){};
	this.areTriggerRequirementsMet = function(){ return false };
	this.showMissingRequirementMessage = function(){
		client.showErrorMessage("strategy-error", "#trigger_mechanism_params_area", this.getMissingRequirementLocalizedId());
	};
	this.getMissingRequirementLocalizedId = function(){ return "default_missing_requirement" };
	this.removeErrorMessage = function(){
		client.removeErrorMessage("strategy-error");
	};
	this.onElementSelection = function(data){ console.log("lalala "); };
}
function UnsetTrigger(client){
	TriggerMechanism.call(this, client);
}
function ClickBasedTrigger(client){
	TriggerMechanism.call(this, client);

	this.triggerSelector;

	this.loadParamsConfigControls = function(){
		client.enableDomElementSelection("input, button, a, img", "onTriggerSelection");
		var preview = client.createPreviewControl("user-selected-trigger-element", "selected_trigger_control");
		client.addParamsConfigurationControls(preview);
	};
	this.undoActionsOnDom = function(){
		client.disableDomElementSelection("input, button, a, img", "onTriggerSelection");
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


function ServiceInputUI(){

	UI.call(this);
	this.userDefInputXpath;
	this.currentTriggerStrategy = new UnsetTrigger(this);

	this.loadSubformBehaviour = function() {
		this.associateTriggeringStrategiesBehaviour();
	};
	this.onTriggerSelection = function(data){

		this.currentTriggerStrategy.onTriggerSelection(data);
	}
	this.associateTriggeringStrategiesBehaviour = function(){

		var me = this;
		document.querySelector('#trigger_mechanism').onchange = function(){

			me.clearTriggeringStrategyParamsArea();
			me.currentTriggerStrategy.undoActionsOnDom();

			me.currentTriggerStrategy = new window[this.value](me);
			me.currentTriggerStrategy.loadParamsConfigControls();
		};
		document.querySelector('#trigger_mechanism').onchange();
	};
	this.clearTriggeringStrategyParamsArea = function(){
		document.querySelector("#trigger_mechanism_params_area").innerHTML = "";
	};
	this.addParamsConfigurationControls = function(controls){
		document.querySelector("#trigger_mechanism_params_area").appendChild(controls);
	};
	this.isElementSelected = function(elemType) {
		return (this.userDefInputXpath)? true : false;
	};
	this.loadPrevNavigationButton = function() {

		var me = this;
		document.querySelector(".prev > button").onclick = function(){   

	    	if(me.isElementSelected("input:not([style*='display:none'])")){
	    		me.saveDataForCurrentService({
    				inputXpath: me.userDefInputXpath
    			});
	    	}
	    	me.loadUrlAtSidebar({ 
        		url: "/content_scripts/sidebar/service-input.html",
        		filePaths: [
        			"/content_scripts/sidebar/lib/js/ui-commons.js",
					"/content_scripts/sidebar/lib/js/service-input.js"
				] 
        	});
		};
	};
	this.showMissingRequirementMessage = function(){
		this.currentTriggerStrategy.showMissingRequirementMessage();
	};
	this.areTriggerRequirementsMet = function(){
		return this.currentTriggerStrategy.areTriggerRequirementsMet();
	};
	this.loadNextNavigationButton = function() {

		var me = this;
		document.querySelector(".next > button").onclick = function(){   

	    	if(me.areTriggerRequirementsMet()){
	    		console.log(this.triggerXpath);
	    		/*me.saveDataForCurrentService({
    				inputXpath: me.userDefInputXpath
    			});
	    	
		    	me.loadUrlAtSidebar({ 
	        		url: "/content_scripts/sidebar/service-name.html",
	        		filePaths: [
	        			"/content_scripts/sidebar/lib/js/ui-commons.js",
						"/content_scripts/sidebar/lib/js/service-name.js"
					] 
	        	});*/
		    }else me.showMissingRequirementMessage("triggering-error", "");
		};
	};
};



var serviceInput = new ServiceInputUI().initialize();
browser.runtime.onMessage.addListener(function callServiceInputUIActions(request, sender, sendResponse) {

	console.log("calling " + request.call + " (.../service-input.js)");
	if(serviceInput[request.call]) {
		
		serviceInput[request.call](request.args);
	}
});