function Searcher(){
	this.searchStrategy = new UrlQueryBasedSearch(new StoppedSearch());
}
Searcher.prototype.notifyVisitedPageUrl = function() {
	var me = this;
	browser.runtime.sendMessage({ 
		"call": "newDocumentWasLoaded",
		"args": {
			"url": window.location.href
		}
	}).then(response =>{

		console.log("Setting status: " + response.status);
		me.searchStrategy = new UrlQueryBasedSearch(new window[response.status]()); //TODO: extend UrlQueryBasedSearch
		me.searchStrategy.analyseDom(response.data);
	})
};


//********************STRATEGIES



function SearchStrategy(status){
	this.status = status;
	this.analyseDom = function(data) {}
}


function NoSearchStrategy(status){
	SearchStrategy.call(this, status);
}


function UrlQueryBasedSearch(status){
	SearchStrategy.call(this, status);
	//this.status = status;
	this.analyseDom = function(data) {

		this.status.analyseDom(data);
	};
};


//********************STATUS

function SearchStatus(){

	this.analyseDom = function(data){}
}

function StoppedSearch(){
  SearchStatus.call(this);
  this.analyseDom = function(data){}
}

function ReadyToTrigger(){
  SearchStatus.call(this);
  this.analyseDom = function(data){

	  var xpi = new XPathInterpreter();

		var input = xpi.getSingleElementByXpath(data.service.input.selector, document);
			input.value = data.keywords;

		var trigger = xpi.getSingleElementByXpath(data.service.trigger.strategy.selector, document);

		var me = this;
		browser.runtime.sendMessage({ 
			"call": "setSearchListeningStatus",
			"args": {"status": "ReadyToExtractResults"}
		}).then(response =>{
			trigger.click();
		})
	}
}

function ReadyToExtractResults(){
	SearchStatus.call(this);
	this.analyseDom = function(data){

	  	console.log("READY TO EXTRACT!!!!");
	}
}

var searher = new Searcher();
	searher.notifyVisitedPageUrl();

browser.runtime.onMessage.addListener(function callAndesAutomaticSearchers(request, sender) {

	if(searher[request.call]){
		searher[request.call](request.args);
	}
});