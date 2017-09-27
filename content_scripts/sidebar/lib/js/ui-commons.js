function UI(){

	this.initialize = function() { //Do not call this methid from the constructor --> Loading error.

		this.loadValidationBehaviour();
		this.loadNavigationTriggers();
		this.loadSubformBehaviour();
		return this;
	};
	this.enableDomElementSelection = function(control, callbackMessage) {

		browser.runtime.sendMessage({ 
    		"call": "enableElementSelection",
    		"args": {
    			targetElementSelector: control,
    			onElementSelection: callbackMessage
    		}
    	});
	};
	this.loadValidationBehaviour = function() {

		var rules = this.getValidationRules();
		if(rules) $('form').validate({  "rules": rules });
	};
	this.focusElement = function(selector) {
		document.querySelector(selector).focus();
	};
	this.showFormElement = function(selector){
		document.querySelector(selector).display = "";
	};
	this.hideFormElement = function(selector){
		document.querySelector(selector).display = "none";
	};
	this.getValidationRules = function() {};
	this.loadNavigationTriggers = function() {
		this.loadPrevNavigationButton(); 
		this.loadNextNavigationButton();
	};
	this.loadPrevNavigationButton = function() {};
	this.loadNextNavigationButton = function() {};
	this.loadSubformBehaviour = function() {};
	this.createNewServiceFromData = function(serviceName){
    	browser.runtime.sendMessage({ 
    		"call": "createNewServiceFromData",
    		"args": {
    			"service": {
    				"name": serviceName
    			}
    		}
    	});
    };
	this.saveDataForCurrentService = function(serviceData){
		browser.runtime.sendMessage({ 
    		"call": "saveDataForCurrentService",
    		"args": {
    			"service": serviceData
    		}
    	});
	};
	this.loadUrlAtSidebar = function(loadingData){

        browser.runtime.sendMessage({ 
        	"call": "loadUrlAtSidebar",
        	"args": loadingData
        });
	};
};