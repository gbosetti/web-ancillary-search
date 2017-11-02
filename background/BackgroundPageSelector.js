function BackgroundPageSelector(){
	this.status = {};
}
BackgroundPageSelector.prototype.getStatusByTab = function(tab) {
	if (this.status[tab.id] == undefined)
		this.initializeStateForTab(tab.id);
	
	return this.status[tab.id];
};
BackgroundPageSelector.prototype.initializeStateForTab = function(tabId) { 

	this.status[tabId] = new UnloadedPageSelector(this); 
}
BackgroundPageSelector.prototype.preventDomElementsBehaviour = function(tab) {
	this.getStatusByTab(tab).preventDomElementsBehaviour(tab);
};
BackgroundPageSelector.prototype.restoreDomElementsBehaviour = function(tab) {
	this.getStatusByTab(tab).restoreDomElementsBehaviour(tab);
};
BackgroundPageSelector.prototype.enableElementSelection = function(tab, targetElementSelector, onElementSelection) {
	this.getStatusByTab(tab).enableElementSelection(tab, targetElementSelector, onElementSelection);
};
BackgroundPageSelector.prototype.disableElementSelection = function(tab, selector) {
	this.getStatusByTab(tab).disableElementSelection(tab, selector);
};
BackgroundPageSelector.prototype.removeFullSelectionStyle = function(tab) {

	browser.tabs.sendMessage(tab.id, { "call": "removeFullSelectionStyle" });
}
BackgroundPageSelector.prototype.loadDomHighlightingExtras = function(tab, callback) {

	BackgroundResourcesLoader.syncLoadStyles([
  		new BackgroundResource("/content_scripts/page-actions/andes-highlighting.css")
  	], tab);

	BackgroundResourcesLoader.syncLoadScripts([
  		new BackgroundResource("/content_scripts/XPathInterpreter.js"),
  		new BackgroundResource("/content_scripts/vendor/popper/index.js"),
  		new BackgroundResource("/content_scripts/page-actions/PageSelector.js")
  	], tab, callback);
};
BackgroundPageSelector.prototype.enablePageRegularBehaviour = function(tab) { 

	browser.tabs.sendMessage(tab.id, { "call": "removeFullSelectionStyle" });
	browser.tabs.sendMessage(tab.id, { "call": "removeEventBlockers" });
}
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
BackgroundPageSelector.prototype.sendEnableSelectionMessage = function(tab, targetElementSelector, onElementSelection){
	browser.tabs.sendMessage(tab.id, {
    	"call": "enableElementSelection",
    	"args":{
    		"targetElementSelector": targetElementSelector,
    		"onElementSelection": onElementSelection
    	}
    });
};

function PageSelectorStatus(context){
	this.enableElementSelection = function(tab, targetElementSelector, onElementSelection){};
	this.preventDomElementsBehaviour = function(tab){};
	this.restoreDomElementsBehaviour = function(tab){};
}
function UnloadedPageSelector(context){
	PageSelectorStatus.call(this, context);
	this.preventDomElementsBehaviour = function(tab){
		
		context.status[tab.id] = new LoadedPageSelector(context);
		context.loadDomHighlightingExtras(tab, function(){
			context.sendPreventDomElementsBehaviour(tab);
		});
	};
	this.restoreDomElementsBehaviour = function(tab){
		
		context.status[tab.id] = new LoadedPageSelector(context);
		context.loadDomHighlightingExtras(tab, function(){
			context.sendRestoreDomElementsBehaviour(tab);
		});
	};
	this.enableElementSelection = function(tab, targetElementSelector, onElementSelection){

		context.status[tab.id] = new LoadedPageSelector(context);
		context.loadDomHighlightingExtras(tab, function(){
			context.sendEnableSelectionMessage(tab, targetElementSelector, onElementSelection);
		});
	};
	this.disableElementSelection = function(tab, selector){

		context.status[tab.id] = new LoadedPageSelector(context);
		context.loadDomHighlightingExtras(tab, function(){
			context.sendDisableSelectionMessage(tab, selector);
		});
	};
}
function LoadedPageSelector(context){
	PageSelectorStatus.call(this, context);
	this.preventDomElementsBehaviour = function(tab){
		context.sendPreventDomElementsBehaviour(tab);
	};
	this.restoreDomElementsBehaviour = function(tab){
		context.sendRestoreDomElementsBehaviour(tab);
	};
	this.enableElementSelection = function(tab, targetElementSelector, onElementSelection){
		context.sendEnableSelectionMessage(tab, targetElementSelector, onElementSelection);
	};
	this.disableElementSelection = function(tab, selector){
		context.sendDisableSelectionMessage(tab, selector);
	};
}