//COMMUNICATION WITH THE EXTENSION
function LoadingResultStrategy(){}
LoadingResultStrategy.prototype.communicateAction = function() {
	
	self.port.emit("resultsAreAvailable");
};
LoadingResultStrategy.prototype.notifyActionIfRequired = function(data) {}

window.WriteAndClickForAjaxCall = function(){}
window.WriteAndClickForAjaxCall.prototype= new LoadingResultStrategy();
window.WriteAndClickForAjaxCall.prototype.executeAndNotifySearch = function(data) {
	
	//You can't use window.onload here. So we should detect the next reloading after click
	var rlc = new ReLoadingsCounter();
		rlc.setStoredValue(rlc.getStoreVariable("reloads"), 5);
		rlc.setStoredValue(rlc.getStoreVariable("strategy"), "WriteAndClickForAjaxCall");

	//window.onhashchange can't be used here 
	var trg = document.evaluate(data.trigger, document, null, 9, null).singleNodeValue;
	if(trg) {
		trg.click(); 
		//We reload to snotify changes when results are there
		window.location.reload(false); 
	}
};
window.WriteAndClickForAjaxCall.prototype.notifyActionIfRequired = function(data) {
	this.communicateAction();
	//En el futuro, no va a ser neceario implementar este método
}

window.WriteForAjaxCall = function(){}
window.WriteForAjaxCall.prototype= new LoadingResultStrategy();
window.WriteForAjaxCall.prototype.executeAndNotifySearch = function(data) {
	
	//The user writes and the URL is changed, so it is enogh to reload to see the results
	var rlc = new ReLoadingsCounter();
		rlc.setStoredValue(rlc.getStoreVariable("reloads"), 5);
		rlc.setStoredValue(rlc.getStoreVariable("strategy"), "WriteForAjaxCall");

		window.location.reload(false); 
};
window.WriteForAjaxCall.prototype.notifyActionIfRequired = function(data) {
	this.communicateAction();
	//En el futuro, no va a ser neceario implementar este método
}

window.WriteAndClickToReload = function(){}
window.WriteAndClickToReload.prototype= new LoadingResultStrategy();
window.WriteAndClickToReload.prototype.executeAndNotifySearch = function(data) {

	//You can't use window.onload here. So we should detect the next reloading after click
	var rlc = new ReLoadingsCounter();
		rlc.setStoredValue(rlc.getStoreVariable("reloads"), 5);
		rlc.setStoredValue(rlc.getStoreVariable("strategy"), "WriteAndClickToReload");

	var trg = document.evaluate(data.trigger, document, null, 9, null).singleNodeValue;
	if(trg) trg.click();
};
window.WriteAndClickToReload.prototype.notifyActionIfRequired = function(data) {
	this.communicateAction();
}


self.port.on("searchNewInstances", function(data){
	try{		
		var inp = document.evaluate(data.entry, document, null, 9, null).singleNodeValue;
			inp.value = data.keywords;

		var strategy = new window[data.loadingResStrategy]();
		//console.log(strategy); //GoodReads -> WriteAndClickToReload
		strategy.executeAndNotifySearch(data);

	}catch(err){console.log(err)}
});
self.port.on("getDomForResultsExtraction", function(){

	//console.log("DOM: from " + window.location.href);
	//There is no sensein extracting the instances from this side, because 
	//sometimes you need extra privileges and it is really hard to doit for each async message you need
	//var results = new IOExtractor().extractDataForDatatable(resultsCog);
	//console.log(window.location.href );
	self.port.emit("notifyDomForResultsExtraction", 
		{textContent: (new XMLSerializer()).serializeToString(document)});
});



function ReLoadingsCounter(){}
ReLoadingsCounter.prototype.getPrevStoredValue = function(id) {
	return (this.storedValueIsUndefined(id))? 0: parseInt(sessionStorage.getItem(id));
}
ReLoadingsCounter.prototype.storedValueIsUndefined = function(id) {
	return (
		isNaN(sessionStorage.getItem(id)),
		sessionStorage.getItem(id) == "null" || 
		sessionStorage.getItem(id) == null || 
		sessionStorage.getItem(id) == undefined 
	);
}
ReLoadingsCounter.prototype.setStoredValue = function(id, value) {
	sessionStorage.setItem(id, value);
}
ReLoadingsCounter.prototype.getStoreVariable = function(id) {

	return window.location.hostname + id;
}

self.port.emit("externalPageIsLoaded");
var rlc = new ReLoadingsCounter();

if(rlc.getPrevStoredValue(rlc.getStoreVariable("reloads"))>0){

	console.log("RELOADING " + window.location.href);
	rlc.setStoredValue(rlc.getStoreVariable("reloads"), 0);
	var strategyClass = sessionStorage.getItem(rlc.getStoreVariable("strategy"));
	var strategy = new window[strategyClass]();
		strategy.notifyActionIfRequired();
}

