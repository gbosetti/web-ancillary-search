function ServiceNameUI(){
	console.log("calling UI");
	//constructor at the end
	UI.call(this);
	
	this.loadSubformBehaviour = function() {
		console.log("subform spec behav");
		this.callPlaceholderNameAdaptation();
	};
	this.callPlaceholderNameAdaptation = function() {
		//The only way I ound to communicate the iframe content to the outside
		browser.runtime.sendMessage({
			call: "adaptPlaceholder"
		});
	};
	this.getValidationRules = function() {
		console.log("returning validation rules");
		return {
	        "search_service_name": {
	            "minlength": 2,
	            "required": true
	        }
	    };
	};
	this.loadNextNavigationButton = function() {
		console.log("NEXT BUTTON!");
		document.querySelector(".next > button").onclick = function(){   
		    if($("form").valid()){
		    	browser.runtime.sendMessage({ 
		    		call: "createNewServiceFromData",
		    		args: {
		    			service: {
		    				name: document.querySelector("#search_service_name").value
		    			}
		    		}
		    	});
		        browser.runtime.sendMessage({ 
		        	call: "loadUrlAtSidebar",
		        	args: { 
		        		url: "/content_scripts/sidebar/service-input.html",
		        		filePaths: [
		        			"/content_scripts/sidebar/lib/js/ui-commons.js",
							"/content_scripts/sidebar/lib/js/service-input.js"
						] 
			        }
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

	this.initialize();
};

var ui = new ServiceNameUI();

browser.runtime.onMessage.addListener(function callServiceNameActions(request, sender, sendResponse) {

	if(ui[request.call]){
		console.log("calling " + request.call + " (.../service-name.js)");
		ui[request.call](request.args);
	}
});