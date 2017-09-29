function ServiceInputUI(){

	UI.call(this);
	this.inputSelectors;

	this.loadSubformBehaviour = function() {
		this.enableDomElementSelection("input", "onElementSelection");
	};
	this.onElementSelection = function(data){

		this.showPreview();
		this.loadPreview("#property-preview-image", data.previewSource);
		this.inputSelectors = data.selectors;
	}
	this.showPreview = function(data){
		document.querySelectorAll(".hidden").forEach(function(elem){
			elem.classList.remove("hidden");
		});
	}
	this.loadPrevNavigationButton = function() {

		var me = this;
		document.querySelector(".prev > button").onclick = function(){   

    		/*me.saveDataForCurrentService({
				inputXpath: me.inputSelectors
			});*/
	    	me.loadUrlAtSidebar({ 
        		url: "/content_scripts/sidebar/service-name.html",
        		filePaths: [
        			"/content_scripts/sidebar/lib/js/ui-commons.js",
					"/content_scripts/sidebar/lib/js/service-name.js"
				] 
        	});
		};
	};
	this.loadNextNavigationButton = function() {

		var me = this;
		document.querySelector(".next > button").onclick = function(){   

			console.log(me.inputSelectors);
			if(me.inputSelectors){
	    		/*me.saveDataForCurrentService({
    				inputXpath: me.inputSelectors
    			});*/
    			me.disableDomElementSelection("input");
		    	me.loadUrlAtSidebar({ 
	        		url: "/content_scripts/sidebar/service-trigger.html",
	        		filePaths: [
	        			"/content_scripts/sidebar/lib/js/ui-commons.js",
						"/content_scripts/sidebar/lib/js/service-trigger.js"
					] 
	        	});
		    } 
		};
	};
};



var serviceInput = new ServiceInputUI().initialize();
browser.runtime.onMessage.addListener(function callServiceInputUIActions(request, sender, sendResponse) {

	if(serviceInput[request.call]) {
		console.log("calling " + request.call + " (.../service-input.js)");
		serviceInput[request.call](request.args);
	}
});