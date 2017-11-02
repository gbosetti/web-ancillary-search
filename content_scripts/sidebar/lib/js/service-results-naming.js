function ServiceResultsNaming(){

	UI.call(this);
	this.userDefInputXpath;

	this.loadSubformBehaviour = function() {
		
	};
	this.areFormRequirementsMet = function(){
		return true;
	};
	this.loadPrevNavigationButton = function() {

		var me = this;
		document.querySelector(".prev > button").onclick = function(){   

	    	if(me.areFormRequirementsMet()){
	    		me.loadResultsSelectionForm();
		    }else me.showMissingRequirementMessage("triggering-error", "");
		};
	};
	this.areRequirementsMet = function(){
		return true;
	};
	this.loadNextNavigationButton = function() {

		var me = this;
		document.querySelector(".next > button").onclick = function(){   

	    	if(me.areRequirementsMet()){
	    	
		    	me.loadServiceNavigationForm();
		    }//else me.showMissingRequirementMessage("triggering-error", "");
		};
	};
};



var serviceResultsNaming = new ServiceResultsNaming();
	serviceResultsNaming.initialize({ //otherwise, if the browser is a collaborator, the class can not be clonned
		"enableRuntimeListeners": function () {
			 browser.runtime.onMessage.addListener(serviceResultsNaming.callServiceInputUIActions) 
		},
		"disableRuntimeListeners": function() {
			browser.runtime.onMessage.removeListener(serviceResultsNaming.callServiceInputUIActions);
		}
	});