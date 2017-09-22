function ServiceNameUI(){
	UI.call(this);
	
	this.loadSubformBehaviour = function() {
		this.callPlaceholderNameAdaptation();
		this.focusElement("#search_service_name");
	};
	this.callPlaceholderNameAdaptation = function() {
		//The only way I ound to communicate the iframe content to the outside
		browser.runtime.sendMessage({
			call: "adaptPlaceholder"
		});
	};
	this.getValidationRules = function() {
		return {
	        "search_service_name": {
	            "minlength": 2,
	            "required": true
	        }
	    };
	};
	this.loadNextNavigationButton = function() {
		var me = this;
		document.querySelector(".next > button").onclick = function(){   
		    if($("form").valid()){
		    	me.createNewServiceFromData(document.querySelector("#search_service_name").value);
		        me.loadUrlAtSidebar({ 
	        		url: "/content_scripts/sidebar/service-input.html",
	        		filePaths: [
	        			"/content_scripts/sidebar/lib/js/ui-commons.js",
						"/content_scripts/sidebar/lib/js/service-input.js"
					] 
			    });
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