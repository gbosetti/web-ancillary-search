function UI(){
	this.initialize();
}
UI.prototype.initialize = function() {
	this.loadValidationBehaviour();
	this.loadNavigationTriggers();
	this.callPlaceholderNameAdaptation();
};
UI.prototype.loadValidationBehaviour = function() {
	$('form').validate({    
	    rules: {
	        search_service_name: {
	            minlength: 2,
	            required: true
	        }
	    }
	});
};
UI.prototype.loadNavigationTriggers = function() {
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
	        	args: { url: "/content_scripts/sidebar/service-input.js" }
	        });
	    }
	}
};
UI.prototype.callPlaceholderNameAdaptation = function() {
	//The only way I ound to communicate the iframe content to the outside
	browser.runtime.sendMessage({
		call: "adaptPlaceholder"
	});
};
UI.prototype.adaptPlaceholderExample = function(data) {
	document.querySelector("#search_service_name").setAttribute(
		"placeholder", 
		document.querySelector("#search_service_name").getAttribute("placeholder") + " " + data.domainName
	);
};

var ui = new UI();

browser.runtime.onMessage.addListener(function callServiceNameActions(request, sender, sendResponse) {

	if(ui[request.call]){
		console.log("calling " + request.call + " (.../service-name.js)");
		ui[request.call](request.args);
	}
});