function UI(){

	var me = this; //we need this
	

	
	
	this.isElementSelected = function(elem) {
		return (elem)? true : false;
	};
	
	
	
	this.loadValidationBehaviour = function() {

		var rules = this.getValidationRules();
		if(rules) $('form').validate({  "rules": rules });
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