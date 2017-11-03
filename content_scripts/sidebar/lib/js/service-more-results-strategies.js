function MoreResultsRetrieval(client){ 
	this.getConfigurationFormUrl = function(data){};
}
function ClickBasedRetrieval(client){
	MoreResultsRetrieval.call(this, client);

	this.getConfigurationFormUrl = function(data){ 
		return "service-more-results-on-click.html";
	};
}
function ScrollDownBasedRetrieval(client){
	MoreResultsRetrieval.call(this, client);
}


function MoreElementsConfig(){
	UI.call(this);
	
	this.loadSubformBehaviour = function() {
		this.loadStrategySelectionBehaviour();
	};
	this.loadStrategySelectionBehaviour = function() {

		var me = this;
		document.querySelectorAll(".list-group-item").forEach(function(option){
			option.addEventListener("click", function(){
				if(!this.classList.contains("active")){

					me.unselectAllRadios();
					this.classList.add("active");
					this.querySelector("input[type=radio]").click();
					me.retrievalStrategy = this.querySelector("input[type=radio]").getAttribute("value");
				}
			});
		});
	};
	this.unselectAllRadios = function() {
		document.querySelectorAll(".list-group-item").forEach(function(option){
			option.classList.contains("active")
				option.classList.remove("active");
		});
	};
	this.areFormRequirementsMet = function(){
		return true;
	};
	this.loadPrevNavigationButton = function() {

		var me = this;
		document.querySelector(".prev > button").onclick = function(){   

	    	if(me.areFormRequirementsMet()){

	    		//me.removeFullSelectionStyle();
	    		me.disableRuntimeListeners();
				me.disableDomElementSelection(me.triggablesSelector); // calls disableElementSelection
		    	me.loadResultsNamingForm();
		    }
		    else me.showMissingRequirementMessage("triggering-error", "");
		};
	};
	this.loadNextNavigationButton = function() {
		var me = this;
		document.querySelector(".next > button").onclick = function(){   
		    
		    var nextFormUrl = new window[me.retrievalStrategy]().getConfigurationFormUrl();
		    if(nextFormUrl == undefined) nextFormUrl = "service-filters-selection.html";
		    console.log(nextFormUrl);
		}
	};
	this.adaptPlaceholderExample = function(data) {
		document.querySelector("#search_service_name").setAttribute(
			"placeholder", 
			document.querySelector("#search_service_name").getAttribute("placeholder") + " " + data.domainName
		);
	};
};

var moreElements = new MoreElementsConfig().initialize();
browser.runtime.onMessage.addListener(function callServiceNameActions(request, sender, sendResponse) {

	if(moreElements[request.call]){
		console.log("calling " + request.call + " (.../service-name.js)");
		moreElements[request.call](request.args);
	}
});