function ServiceInputUI(){

	UI.call(this);
	this.userDefInputXpath;

	this.loadSubformBehaviour = function() {
		this.enableDomElementSelection("input", "onElementSelection");
	};
	this.onElementSelection = function(data){

		this.showPreview();
		this.loadPreview(data.previewSource);
		this.userDefInputXpath = data.xpaths;
	}
	this.showPreview = function(data){
		document.querySelectorAll(".hidden").forEach(function(elem){
			elem.classList.remove("hidden");
		});
	}
	this.loadPreview = function(src){
		document.querySelector("#property-preview-image").src = src;
	}
	this.isElementSelected = function(elemType) {
		return (this.userDefInputXpath)? true : false;
	};
	this.loadPrevNavigationButton = function() {

		var me = this;
		document.querySelector(".prev > button").onclick = function(){   

	    	/*if(me.isElementSelected("input:not([style*='display:none'])")){
	    		me.saveDataForCurrentService({
    				inputXpath: me.userDefInputXpath
    			});
	    	}*/
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

			//if(this.userDefInputXpath){
	    		/*me.saveDataForCurrentService({
    				inputXpath: me.userDefInputXpath
    			});*/
		    	me.loadUrlAtSidebar({ 
	        		url: "/content_scripts/sidebar/service-trigger.html",
	        		filePaths: [
	        			"/content_scripts/sidebar/lib/js/ui-commons.js",
						"/content_scripts/sidebar/lib/js/service-trigger.js"
					] 
	        	});
		    //};
		};
	};
};



var serviceInput = new ServiceInputUI().initialize();
browser.runtime.onMessage.addListener(function callSidebarActions(request, sender, sendResponse) {

	if(serviceInput[request.call]) {
		console.log("calling " + request.call + " (.../service-input.js)");
		serviceInput[request.call](request.args);
	}
});