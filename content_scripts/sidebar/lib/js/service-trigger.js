function TriggerMechanism(client){
	this.loadParamsConfigControls = function(){}
}
function ClickBasedTrigger(client){
	TriggerMechanism.call(this, client);

	this.loadParamsConfigControls = function(){
		var preview = client.createPreviewControl("user-selected-trigger-element", "selected_trigger_control");
		client.addParamsConfigurationControls(preview);
		client.enableDomElementSelection("button, a, img", "onElementSelection");
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

	this.loadSubformBehaviour = function() {
		this.associateTriggeringStrategiesBehaviour();
	};
	this.onElementSelection = function(data){

		/*this.showPreview();
		this.loadPreview(data.previewSource);
		this.userDefInputXpath = data.xpaths;*/
	}
	this.associateTriggeringStrategiesBehaviour = function(){

		var me = this;
		document.querySelector('#trigger_mechanism').onclick = function(){

			me.clearTriggeringStrategyParamsArea();
			me.currentTriggerStrategy = new window[this.value](me);
			me.currentTriggerStrategy.loadParamsConfigControls();
		};
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
	this.loadNextNavigationButton = function() {

		var me = this;
		document.querySelector(".next > button").onclick = function(){   

	    	if(this.triggerXpath){
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
		    }else this.showFormElement(".warning-message");
		};
	};
};



var serviceInput = new ServiceInputUI().initialize();
browser.runtime.onMessage.addListener(function callSidebarActions(request, sender, sendResponse) {

	if(serviceInput[request.call]) {
		console.log("calling " + request.call + " (.../service-input.js)");
		serviceInput[request.call](request.args);
	}
});