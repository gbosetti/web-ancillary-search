function BackgroundPageSelector(){
	this.status = {};
}
BackgroundPageSelector.prototype.getStatusByTab = function(tab) {
	if (this.status[tab.id] == undefined)
		this.status[tab.id] = new UnloadedPageSelector(this);
	
	return this.status[tab.id];
};
BackgroundPageSelector.prototype.preventDomElementsBehaviour = function(tab) {
	this.getStatusByTab(tab).preventDomElementsBehaviour(tab);
};
BackgroundPageSelector.prototype.enableElementSelection = function(tab, targetElementSelector, onElementSelection) {
	this.getStatusByTab(tab).enableElementSelection(tab, targetElementSelector, onElementSelection);
};
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
BackgroundPageSelector.prototype.sendPreventDomElementsBehaviour = function(tab){
	browser.tabs.sendMessage(tab.id, {
    	"call": "preventDomElementsBehaviour"
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
}
function UnloadedPageSelector(context){
	PageSelectorStatus.call(this, context);
	this.preventDomElementsBehaviour = function(tab){
		
		context.status[tab.id] = new LoadedPageSelector(context);
		context.loadDomHighlightingExtras(tab, function(){
			context.sendPreventDomElementsBehaviour(tab);
		});
	};
	this.enableElementSelection = function(tab, targetElementSelector, onElementSelection){

		context.status[tab.id] = new LoadedPageSelector(context);
		context.loadDomHighlightingExtras(tab, function(){
			context.sendEnableSelectionMessage(tab, targetElementSelector, onElementSelection);
		});
	};
}
function LoadedPageSelector(context){
	PageSelectorStatus.call(this, context);
	this.preventDomElementsBehaviour = function(tab){
		context.sendPreventDomElementsBehaviour(tab);
	};
	this.enableElementSelection = function(tab, targetElementSelector, onElementSelection){
		context.sendEnableSelectionMessage(tab, targetElementSelector, onElementSelection);
	};
}