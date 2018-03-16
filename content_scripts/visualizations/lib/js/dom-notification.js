function SearchStrategy(){}
SearchStrategy.prototype.notifyVisitedPageUrl = function() {
	var me = this;
	browser.runtime.sendMessage({ 
		"call": "newDocumentWasLoaded",
		"args": {
			"url": window.location.href
		}
	}).then(response =>{
		if(response.proceed)
			me.executeAutomaticSearch(response);
		else console.log("Doing nothing with the doc.");
	})
};

function UrlQueryBasedSearch(){
	SearchStrategy.call(this);
}
SearchStrategy.prototype.executeAutomaticSearch = function(data) {
	
	console.log("executeAutomaticSearch");
};


var searher = new SearchStrategy(); //TODO: here you need to add a manager, which will ask the extension which strategy should be set.
	searher.notifyVisitedPageUrl();

browser.runtime.onMessage.addListener(function callAndesAutomaticSearchers(request, sender) {

	if(searher[request.call]){
		searher[request.call](request.args);
	}
});