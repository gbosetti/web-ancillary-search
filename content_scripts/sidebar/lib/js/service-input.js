/*function ServiceInputUI(){
	UI.call(this);
}
ServiceInputUI.prototype.loadSubformBehaviour = function() {
};
ServiceNameUI.prototype.getValidationRules = function() {
	return {
        search_service_name: {
            minlength: 2,
            required: true
        }
    };
};
ServiceInputUI.prototype.loadPrevNavigationButton = function() {
	document.querySelector(".next > button").onclick = function(){   
	    if($("form").valid()){
	        browser.runtime.sendMessage({ 
	        	call: "loadUrlAtSidebar",
	        	args: { 
	        		url: "/content_scripts/sidebar/service-name.js",
	        		filePaths: [
	        			"/content_scripts/sidebar/lib/js/ui-commons.js",
						"/content_scripts/sidebar/lib/js/service-name.js"
					] 
	        	}
	        });
	    }
	}
};
ServiceInputUI.prototype.loadNextNavigationButton = function() {
	/*document.querySelector(".next > button").onclick = function(){   
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
	        		url: "/content_scripts/sidebar/service-input.js",
	        		filePaths: [
	        			"/content_scripts/sidebar/lib/js/ui-commons.js",
						"/content_scripts/sidebar/lib/js/service-input.js"
					] 
	        	}
	        });
	    }
	}
};

var ui = new ServiceInputUI();*/