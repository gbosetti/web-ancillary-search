function ServiceInputUI(){

	UI.call(this);
	this.userDefInputXpath;

	this.loadSubformBehaviour = function() {
		this.enableDomElementSelection("div:not(#andes-sidebar)", "onResultsContainerSelection");
	};
	this.onResultsContainerSelection = function(data){

		this.showFormElement("#preview_group");
		this.showFormElement("#selector_group");
		
		this.loadPreview("#result-preview-image", data.previewSource);
		this.fillOccurrencesSelector(data.selectors);
	};
	this.fillOccurrencesSelector = function(selectors){

		var selector = document.querySelector("#result-selector");
			selector.innerHTML = "";

		Object.keys(selectors).forEach(function(key) {

			var elemsBySelectorLabel = key > 1? browser.i18n.getMessage("occurrences") : browser.i18n.getMessage("occurrence");
			var opt = document.createElement("option");
				opt.value = selectors[key][0];
				opt.text = key + " " + elemsBySelectorLabel;
			selector.add(opt); 
		});

		selector.onchange = function(){
			console.log(this.value);
			browser.runtime.sendMessage({ 
	    		"call": "selectMatchingElements",
	    		"args": { "selector": this.value }
	    	});
		}
	};
	/*this.sortSelectors = function(selectors){

		//console.log("\n\n\nSELECTORS!!!!!!", selectors);
		return JSON.stringify(selectors, Object.keys(selectors).sort());
		//return selectors.sort(function(a,b) {return (a.occurrences < b.occurrences) ? 1 : ((b.occurrences < a.occurrences) ? -1 : 0);} ); 
	};*/
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