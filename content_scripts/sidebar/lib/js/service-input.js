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
    			onElementSelection: "onInputSelection"
    		}
    	});
	};
	this.onInputSelection = function(data){
		console.log("doing stuff with the selected input", data);
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

new ServiceInputUI().initialize();