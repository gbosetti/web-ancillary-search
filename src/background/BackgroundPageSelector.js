function BackgroundPageSelector(){
	this.pageBehaviourStatus = {};
}
BackgroundPageSelector.prototype.getPageBehaviourStatusByTab = function(tab) {
	if (this.pageBehaviourStatus[tab.id] == undefined)
		this.pageBehaviourStatus[tab.id] = new RegularBehaviourEnabled(this); 
	
	return this.pageBehaviourStatus[tab.id];
};
BackgroundPageSelector.prototype.preventDomElementsBehaviour = function(tab) {
	browser.tabs.sendMessage(tab.id, {
    	"call": "preventDomElementsBehaviour"
    });
};
BackgroundPageSelector.prototype.restoreDomElementsBehaviour = function(tab) {
	browser.tabs.sendMessage(tab.id, {
    	"call": "restoreDomElementsBehaviour"
    });
};
BackgroundPageSelector.prototype.toggleDomElementsBehaviour = function(tab) {

	this.getPageBehaviourStatusByTab(tab).toggleDomElementsBehaviour(tab);
};
BackgroundPageSelector.prototype.enableElementSelection = function(tab, data) {

	return new Promise((resolve, reject) => {

    	browser.tabs.sendMessage(tab.id, {
	    	"call": "enableElementSelection",
	    	"args":data
	    });
      	resolve(); 
  	});
};
BackgroundPageSelector.prototype.disableElementSelection = function(tab, selector) {
	browser.tabs.sendMessage(tab.id, {
    	"call": "disableElementSelection",
    	"args": {
    		"selector": selector
    	}
    });
};
BackgroundPageSelector.prototype.removeFullSelectionStyle = function(tab) {

	return new Promise((resolve, reject) => {
    	browser.tabs.sendMessage(tab.id, { "call": "removeFullSelectionStyle" }).then(function(){
			resolve(); 
		});	
  	});	
}



function PageBehaviourStatus(context){
	this.toggleDomElementsBehaviour = function(tab){};
}
function RegularBehaviourEnabled(context){
	PageBehaviourStatus.call(this);

	this.toggleDomElementsBehaviour = function(tab){
		//console.log("REGULAR > prevent");
		context.preventDomElementsBehaviour(tab);
		context.pageBehaviourStatus[tab.id] = new RegularBehaviourDisabled(context);
	};
}
function RegularBehaviourDisabled(context){
	PageBehaviourStatus.call(this);

	this.toggleDomElementsBehaviour = function(tab){
		//console.log("REGULAR DISABLED > restore");
		context.restoreDomElementsBehaviour(tab);
		context.pageBehaviourStatus[tab.id] = new RegularBehaviourEnabled(context);
	};
}