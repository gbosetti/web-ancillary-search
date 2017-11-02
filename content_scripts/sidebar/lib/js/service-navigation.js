function ServiceNameUI(){
	UI.call(this);
	
	this.loadSubformBehaviour = function() {

	};
	this.areFormRequirementsMet = function(){
		return true;
	};
	this.loadPrevNavigationButton = function() {

		var me = this;
		document.querySelector(".prev > button").onclick = function(){   

	    	if(me.areFormRequirementsMet()){

	    		me.removeFullSelectionStyle();
	    		me.disableRuntimeListeners();

				me.disableDomElementSelection(me.triggablesSelector); // calls disableElementSelection
		    	me.loadResultsNamingForm();
		    }
		    else me.showMissingRequirementMessage("triggering-error", "");
		};
	};
	this.loadNextNavigationButton = function() {
		var me = this;
		document.querySelector(".next > button").onclick = function(){   
		    if($("form").valid()){
		    	/*me.createNewServiceFromData(document.querySelector("#search_service_name").value);
		        me.loadUrlAtSidebar({ 
	        		url: "/content_scripts/sidebar/service-input.html",
	        		filePaths: [
	        			"/content_scripts/sidebar/lib/js/ui-commons.js",
						"/content_scripts/sidebar/lib/js/service-input.js"
					] 
			    });*/
		    }
		}
	};
	this.adaptPlaceholderExample = function(data) {
		document.querySelector("#search_service_name").setAttribute(
			"placeholder", 
			document.querySelector("#search_service_name").getAttribute("placeholder") + " " + data.domainName
		);
	};
};

var ui = new ServiceNameUI().initialize();
browser.runtime.onMessage.addListener(function callServiceNameActions(request, sender, sendResponse) {

	if(ui[request.call]){
		console.log("calling " + request.call + " (.../service-name.js)");
		ui[request.call](request.args);
	}
});