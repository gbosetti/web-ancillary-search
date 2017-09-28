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
	/*this.showErrorMessage = function(id, afterPositionSelector, localizationString) {

	    var formGroup = document.createElement("div");
	    	formGroup.setAttribute("class", "form-group");
	    	formGroup.setAttribute("id", id);

	    var label = document.createElement("label");
	    	label.setAttribute("class", "error");
	    	label.innerHTML = browser.i18n.getMessage(localizationString);

	    formGroup.appendChild(label);

	    var referenceNode = document.querySelector(afterPositionSelector);
	    referenceNode.parentElement.insertBefore(formGroup, referenceNode.nextSibling);
	};*/
	this.createPreviewControl = function(previewElemId, description){

		var formGroup = document.createElement("div");
			formGroup.setAttribute("class", "form-group hidden");

		var label = document.createElement("label");
			label.innerHTML = description;
			formGroup.appendChild(label);

		var imgContainer = document.createElement("div");
		var previewImage = document.createElement("img");
			previewImage.setAttribute("id", previewElemId);
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