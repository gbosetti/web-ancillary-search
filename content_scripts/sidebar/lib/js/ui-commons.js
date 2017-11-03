function UI(){

	var me = this; //we need this
	this.fileDescription = "default file, please override in subclass";
	this.triggablesSelector = "input, button, a, img:not(#andes-close-button):not(#andes-reposition-button)";

	this.initialize = function(data) { //Do not call this methid from the constructor --> Loading error.

		this.loadValidationBehaviour();
		this.loadNavigationTriggers();
		this.loadSubformBehaviour();

		if(data) {
			this.enableRuntimeListeners = data.enableRuntimeListeners;
			this.disableRuntimeListeners = data.disableRuntimeListeners;
		}
		this.enableRuntimeListeners();

		return this;
	};
	this.enableDomElementSelection = function(controlsSelector, callbackMessage) {

		//console.log("processing selection", controlsSelector, callbackMessage);
		browser.runtime.sendMessage({ 
    		"call": "enableElementSelection",
    		"args": {
    			targetElementSelector: controlsSelector,
    			onElementSelection: callbackMessage
    		}
    	});
	};
	this.disableDomElementSelection = function(selector) {

		browser.runtime.sendMessage({ 
    		"call": "disableElementSelection",
    		"args": { "selector": selector }
    	});
	};
	this.isElementSelected = function(elem) {
		return (elem)? true : false;
	};
	this.loadPreview = function(selector, src){
		document.querySelector(selector).src = src;
	};
	this.hasErrorMessage = function(id){
		return (document.querySelector("#" + id))? true: false;
	};
	this.showErrorMessage = function(id, afterPositionSelector, localizationString) {

	    var formGroup = document.createElement("div");
	    	formGroup.setAttribute("class", "form-group");
	    	formGroup.setAttribute("id", id);

	    var label = document.createElement("label");
	    	label.setAttribute("class", "error");
	    	label.innerHTML = browser.i18n.getMessage(localizationString);

	    formGroup.appendChild(label);

	    var referenceNode = document.querySelector(afterPositionSelector);
	    referenceNode.parentElement.insertBefore(formGroup, referenceNode.nextSibling);
	};
	this.removeErrorMessage = function(id) {

	    this.removeFormElement("#" + id);
	};
	this.createPreviewControl = function(previewElemId, localizedDescriptionId){

		var formGroup = document.createElement("div");
			formGroup.setAttribute("id", previewElemId);
			formGroup.setAttribute("class", "form-group hidden");

		var label = document.createElement("label");
			label.innerHTML = browser.i18n.getMessage(localizedDescriptionId);
			formGroup.appendChild(label);

		var imgContainer = document.createElement("div");
		var previewImage = document.createElement("img");
			previewImage.setAttribute("id", previewElemId + "-img");
			previewImage.setAttribute("class", "image-preview");
			previewImage.setAttribute("src", "lib/img/no-preview.png");
		imgContainer.appendChild(previewImage);
		formGroup.appendChild(imgContainer);
		
		return formGroup;
	};
	this.loadValidationBehaviour = function() {

		var rules = this.getValidationRules();
		if(rules) $('form').validate({  "rules": rules });
	};
	this.focusElement = function(selector) {
		document.querySelector(selector).focus();
	};
	this.showFormElement = function(selector){
		var elem = document.querySelector(selector);
		elem.display = "";
		if(elem.classList.contains("hidden")) elem.classList.remove("hidden");
	};
	this.hideFormElement = function(selector){
		document.querySelector(selector).display = "none";
	};
	this.removeFormElement = function(selector) {

	   if(document.querySelector(selector)) 
	   	document.querySelector(selector).remove();
	};
	this.getValidationRules = function() {};
	this.loadNavigationTriggers = function() {
		this.loadPrevNavigationButton(); 
		this.loadNextNavigationButton();
	};
	this.loadPrevNavigationButton = function() {};
	this.loadNextNavigationButton = function() {};
	this.loadSubformBehaviour = function() {};
	this.enableRuntimeListeners = function() {};
	this.disableRuntimeListeners = function() {};
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
	this.callServiceInputUIActions = function(request, sender, sendResponse) {

		if(me[request.call]) {
			console.log("calling " + request.call + " " + this.fileDescription);
			me[request.call](request.args);
		}
	};

	//FORMS LOADING
	this.loadResultsSelectionForm = function(){
		me.disableRuntimeListeners();
		me.disableDomElementSelection("input, button, a, img");
	
    	me.loadUrlAtSidebar({ 
    		url: "/content_scripts/sidebar/service-results-selection.html",
    		filePaths: [
    			"/content_scripts/sidebar/lib/js/ui-commons.js",
    			"/content_scripts/XPathInterpreter.js",
				"/content_scripts/sidebar/lib/js/service-results-selection.js"
			] 
    	});
    };
    this.loadResultsNamingForm = function(){
    	me.loadUrlAtSidebar({ 
    		url: "/content_scripts/sidebar/service-results-naming.html",
    		filePaths: [
    			"/content_scripts/sidebar/lib/js/ui-commons.js",
				"/content_scripts/sidebar/lib/js/service-results-naming.js"
			] 
    	});
    };
    this.loadServiceNavigationForm = function(){
    	me.loadUrlAtSidebar({ 
    		url: "/content_scripts/sidebar/service-more-results-strategies.html",
    		filePaths: [
    			"/content_scripts/sidebar/lib/js/ui-commons.js",
    			"/content_scripts/XPathInterpreter.js",
				"/content_scripts/sidebar/lib/js/service-more-results-strategies.js"
			] 
    	});
    }
};