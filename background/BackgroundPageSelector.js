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

function PageSelectorStatus(context){
	this.enableElementSelection = function(tab, targetElementSelector, onElementSelection){};
	this.preventDomElementsBehaviour = function(tab){};
	this.sendEnableSelectionMessage = function(tab, targetElementSelector, onElementSelection){
		browser.tabs.sendMessage(tab.id, {
	    	"call": "enableElementSelection",
	    	"args":{
	    		"targetElementSelector": targetElementSelector,
	    		"onElementSelection": onElementSelection
	    	}
	    });
	};
}
function UnloadedPageSelector(context){
	PageSelectorStatus.call(this, context);
	var me = this;
	this.preventDomElementsBehaviour = function(tab){
		context.loadDomHighlightingExtras(tab, function(){
			browser.tabs.sendMessage(tab.id, {
		    	"call": "preventDomElementsBehaviour"
		    });
		});
		context.status = new LoadedPageSelector(context);
	};
	this.enableElementSelection = function(tab, targetElementSelector, onElementSelection){
		context.loadDomHighlightingExtras(tab, function(){
			me.sendEnableSelectionMessage(tab, targetElementSelector, onElementSelection);
		});
		context.status = new LoadedPageSelector(context);
	};
}
function LoadedPageSelector(context){
	PageSelectorStatus.call(this, context);
	var me = this;
	this.preventDomElementsBehaviour = function(tab){
		browser.tabs.sendMessage(tab.id, {
	    	"call": "preventDomElementsBehaviour"
	    });
		context.status = new LoadedPageSelector(context);
	};
	this.enableElementSelection = function(tab, targetElementSelector, onElementSelection){
		me.sendEnableSelectionMessage(tab, targetElementSelector, onElementSelection);
	};
}