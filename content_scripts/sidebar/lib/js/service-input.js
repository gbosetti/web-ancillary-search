function ServiceInputUI(){

	UI.call(this);
	this.userDefInputXpath;
	
	this.isElementSelected = function(elemType) {
		return (this.userDefInputXpath)? true : false;
	};
	this.loadPrevNavigationButton = function() {

		var me = this;
		document.querySelector(".prev > button").onclick = function(){   

	    	if(me.isElementSelected("input")){
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