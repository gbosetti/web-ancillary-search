function BackgroundPageSelector(){
	this.loadingStatus = {}; //a property for each tab
	this.pageBehaviourStatus = {};
}
BackgroundPageSelector.prototype.getLoadingStatusByTab = function(tab) {
	if (this.loadingStatus[tab.id] == undefined)
		this.initializeStateForTab(tab.id);
	
	return this.loadingStatus[tab.id];
};
BackgroundPageSelector.prototype.getPageBehaviourStatusByTab = function(tab) {
	if (this.pageBehaviourStatus[tab.id] == undefined)
		this.pageBehaviourStatus[tab.id] = new RegularBehaviourEnabled(this); 
	
	return this.pageBehaviourStatus[tab.id];
};
BackgroundPageSelector.prototype.initializeStateForTab = function(tabId) { 

	this.loadingStatus[tabId] = new UnloadedPageSelector(this); 
}
BackgroundPageSelector.prototype.preventDomElementsBehaviour = function(tab) {
	this.getLoadingStatusByTab(tab).preventDomElementsBehaviour(tab);
};
BackgroundPageSelector.prototype.restoreDomElementsBehaviour = function(tab) {
	this.getLoadingStatusByTab(tab).restoreDomElementsBehaviour(tab);
};
BackgroundPageSelector.prototype.toggleDomElementsBehaviour = function(tab) {

	this.getPageBehaviourStatusByTab(tab).toggleDomElementsBehaviour(tab);
};
BackgroundPageSelector.prototype.enableElementSelection = function(tab, data, sendResponse) {

	this.getLoadingStatusByTab(tab).enableElementSelection(tab, data);
	sendResponse("almost done!");
};
BackgroundPageSelector.prototype.disableElementSelection = function(tab, selector) {
	this.getLoadingStatusByTab(tab).disableElementSelection(tab, selector);
};
BackgroundPageSelector.prototype.removeFullSelectionStyle = function(tab, sendResponse) {

	browser.tabs.sendMessage(tab.id, { "call": "removeFullSelectionStyle" }).then(function(){
		sendResponse("done!");
	});
}
BackgroundPageSelector.prototype.loadRequiredFiles = function(tab, callback) {

	console.log("loadRequiredFiles");
	BackgroundResourcesLoader.syncLoadStyles([
  		new BackgroundResource("/content_scripts/page-actions/andes-highlighting.css")
  	], tab);

	BackgroundResourcesLoader.syncLoadScripts([
		/*new BackgroundResource("/content_scripts/browsers-standarization.js"), NOT HERE!!!*/
		new BackgroundResource("/content_scripts/vendor/dom-to-image/index.js"),
  		new BackgroundResource("/content_scripts/XPathInterpreter.js"),
  		new BackgroundResource("/content_scripts/vendor/popper/index.js"),
  		new BackgroundResource("/content_scripts/page-actions/PageSelector.js")
  	], tab, callback);
};
BackgroundPageSelector.prototype.sendPreventDomElementsBehaviour = function(tab){
	browser.tabs.sendMessage(tab.id, {
    	"call": "preventDomElementsBehaviour"
    });
};
BackgroundPageSelector.prototype.sendRestoreDomElementsBehaviour = function(tab){
	browser.tabs.sendMessage(tab.id, {
    	"call": "restoreDomElementsBehaviour"
    });
};
BackgroundPageSelector.prototype.sendDisableSelectionMessage = function(tab, selector){
	browser.tabs.sendMessage(tab.id, {
    	"call": "disableElementSelection",
    	"args": {
    		"selector": selector
    	}
    });
};
BackgroundPageSelector.prototype.sendEnableSelectionMessage = function(tab, data){

	browser.tabs.sendMessage(tab.id, {
    	"call": "enableElementSelection",
    	"args":data
    });
};





function PageBehaviourStatus(context){
	this.toggleDomElementsBehaviour = function(tab){};
}
function RegularBehaviourEnabled(context){
	PageBehaviourStatus.call(this);

	this.toggleDomElementsBehaviour = function(tab){
		//console.log("REGULAR > prevent");
		context.getLoadingStatusByTab(tab).preventDomElementsBehaviour(tab);
		context.pageBehaviourStatus[tab.id] = new RegularBehaviourDisabled(context);
	};
}
function RegularBehaviourDisabled(context){
	PageBehaviourStatus.call(this);

	this.toggleDomElementsBehaviour = function(tab){
		//console.log("REGULAR DISABLED > restore");
		context.getLoadingStatusByTab(tab).restoreDomElementsBehaviour(tab);
		context.pageBehaviourStatus[tab.id] = new RegularBehaviourEnabled(context);
	};
}





function PageSelectorStatus(context){
	this.enableElementSelection = function(tab, data){};
	this.preventDomElementsBehaviour = function(tab){};
	this.restoreDomElementsBehaviour = function(tab){};
}
function UnloadedPageSelector(context){
	PageSelectorStatus.call(this, context);
	this.preventDomElementsBehaviour = function(tab){
		
		//console.log("PREVENT FROM UNLOADED [NOSENSE]");
		context.loadingStatus[tab.id] = new LoadedPageSelector(context);
		console.log("4loadRequiredFiles from UnloadedPageSelector");
		context.loadRequiredFiles(tab, function(){
			context.sendPreventDomElementsBehaviour(tab);
		});
	};
	this.restoreDomElementsBehaviour = function(tab){
		
		//console.log("RESTORE FROM UNLOADED");
		//context.sendRestoreDomElementsBehaviour(tab);

		context.loadingStatus[tab.id] = new LoadedPageSelector(context);
		console.log("3loadRequiredFiles from UnloadedPageSelector");
		context.loadRequiredFiles(tab, function(){
			context.sendRestoreDomElementsBehaviour(tab);
		});
	};
	this.enableElementSelection = function(tab, data){

		context.loadingStatus[tab.id] = new LoadedPageSelector(context);
		console.log("2loadRequiredFiles from UnloadedPageSelector");
		context.loadRequiredFiles(tab, function(){
			context.sendEnableSelectionMessage(tab, data);
		});
	};
	this.disableElementSelection = function(tab, selector){

		context.loadingStatus[tab.id] = new LoadedPageSelector(context);
		console.log("1loadRequiredFiles from UnloadedPageSelector");
		context.loadRequiredFiles(tab, function(){
			context.sendDisableSelectionMessage(tab, selector);
		});
	};
}
function LoadedPageSelector(context){
	PageSelectorStatus.call(this, context);
	this.preventDomElementsBehaviour = function(tab){

		//console.log("PREVENT FROM LOADED");
		context.sendPreventDomElementsBehaviour(tab);
	};
	this.restoreDomElementsBehaviour = function(tab){

		//console.log("RESTORE FROM LOADED");
		context.sendRestoreDomElementsBehaviour(tab);
	};
	this.enableElementSelection = function(tab, data){
		context.sendEnableSelectionMessage(tab, data);
	};
	this.disableElementSelection = function(tab, selector){
		context.sendDisableSelectionMessage(tab, selector);
	};
}