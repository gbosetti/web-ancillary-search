function UI(){

	var me = this; //we need this
	

	
	
	this.isElementSelected = function(elem) {
		return (elem)? true : false;
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
	
	this.loadValidationBehaviour = function() {

		var rules = this.getValidationRules();
		if(rules) $('form').validate({  "rules": rules });
	};
	
	this.removeFormElement = function(selector) {

	   if(document.querySelector(selector)) 
	   	document.querySelector(selector).remove();
	};
	this.callServiceInputUIActions = function(request, sender, sendResponse) {

		if(me[request.call]) {
			//console.log("calling " + request.call + " " + this.fileDescription);
			me[request.call](request.args);
		}
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