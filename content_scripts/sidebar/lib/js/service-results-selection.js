function ServiceInputUI(){

	UI.call(this);
	this.userDefInputXpath;

	this.loadSubformBehaviour = function() {
		this.enableDomElementSelection("div", "onResultsContainerSelection");
	};
	this.onResultsContainerSelection = function(data){

		this.loadPreview("#result-preview-image", data.previewSource);
		//this.showFormElement("#result-preview-image");
		this.fillOccurrencesSelector(data.selectors);
	};
	this.fillOccurrencesSelector = function(selectors){
		var selector = document.querySelector("#result-selector");
			selector.innerHTML = "";

		selectors = this.sortSelectors(selectors);

		for (var i = selectors.length - 1; i >= 0; i--) {

			var elemsBySelectorLabel = selectors[i].occurrences > 1? browser.i18n.getMessage("occurrences") : browser.i18n.getMessage("occurrence");
			var opt = document.createElement("option");
				opt.value = selectors[i].expression;
				opt.text = selectors[i].occurrences + " " + elemsBySelectorLabel;
			selector.add(opt); 
		}

	};
	this.sortSelectors = function(selectors){
		return selectors.sort(function(a,b) {return (a.occurrences > b.occurrences) ? 1 : ((b.occurrences > a.occurrences) ? -1 : 0);} ); 
	};
	this.clearTriggeringStrategyParamsArea = function(){
		document.querySelector("#trigger_mechanism_params_area").innerHTML = "";
	};
	this.addParamsConfigurationControls = function(controls){
		document.querySelector("#trigger_mechanism_params_area").appendChild(controls);
	};
	this.isElementSelected = function(elemType) {
		return (this.userDefInputXpath)? true : false;
	};
	this.loadPrevNavigationButton = function() {

		var me = this;
		document.querySelector(".prev > button").onclick = function(){   

	    	me.disableRuntimeListeners();
    		me.disableDomElementSelection("input");

	    	me.loadUrlAtSidebar({ 
        		url: "/content_scripts/sidebar/service-trigger.html",
        		filePaths: [
        			"/content_scripts/sidebar/lib/js/ui-commons.js",
					"/content_scripts/sidebar/lib/js/service-trigger.js"
				] 
        	});
		};
	};
	this.areRequirementsMet = function(){
		return true;
	};
	this.loadNextNavigationButton = function() {

		var me = this;
		document.querySelector(".next > button").onclick = function(){   

	    	if(me.areRequirementsMet()){
	    	
		    	me.loadUrlAtSidebar({ 
	        		url: "/content_scripts/sidebar/service-results-naming.html",
	        		filePaths: [
	        			"/content_scripts/sidebar/lib/js/ui-commons.js",
						"/content_scripts/sidebar/lib/js/service-results-naming.js"
					] 
	        	});
		    }//else me.showMissingRequirementMessage("triggering-error", "");
		};
	};
};



var serviceResults = new ServiceInputUI();
	serviceResults.initialize({ //otherwise, if the browser is a collaborator, the class can not be clonned
		"enableRuntimeListeners": function () {
			 browser.runtime.onMessage.addListener(serviceResults.callServiceInputUIActions) 
		},
		"disableRuntimeListeners": function() {
			browser.runtime.onMessage.removeListener(serviceResults.callServiceInputUIActions);
		}
	});