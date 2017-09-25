function ServiceInputUI(){

	UI.call(this);
	this.userDefInputXpath;

	this.loadSubformBehaviour = function() {
		this.enableElementSelection();
	};
	this.enableElementSelection = function() {
		browser.runtime.sendMessage({ 
    		"call": "enableElementSelection",
    		"args": {
    			targetElementSelector: "input",
    			onElementSelection: "onElementSelection"
    		}
    	});
	};
	this.onElementSelection = function(data){
		console.log("doing stuff with the selected input", data);
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

	    	if(me.isElementSelected("input:not([style*='display:none'])")){
	    		me.saveDataForCurrentService({
    				inputXpath: me.userDefInputXpath
    			});
	    	}
	    	me.loadUrlAtSidebar({ 
        		url: "/content_scripts/sidebar/service-name.html",
        		filePaths: [
        			"/content_scripts/sidebar/lib/js/ui-commons.js",
					"/content_scripts/sidebar/lib/js/service-name.js"
				] 
        	});
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