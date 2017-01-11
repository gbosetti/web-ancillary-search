//COMMUNICATION WITH THE EXTENSION
function LoadingResultStrategy(){}
LoadingResultStrategy.prototype.communicateAction = function() {
	console.log("loading", window.location.href);
	self.port.emit("resultsAreAvailable");
};
LoadingResultStrategy.prototype.getSingleDomElement = function(xpath) {
	try{
		return document.evaluate(xpath, document, null, 9, null).singleNodeValue;
	}catch(err){
		return;
	}
};
LoadingResultStrategy.prototype.emulateKeyPress = function(evnt, code, target) {
	try{
		var ev = document.createEvent('KeyboardEvent');
		ev.initKeyEvent(evnt,       // typeArg,                                                           
	                   true,             // canBubbleArg,                                                        
	                   true,             // cancelableArg,                                                       
	                   null,             // viewArg,  Specifies UIEvent.view. This value may be null.     
	                   false,            // ctrlKeyArg,                                                               
	                   false,            // altKeyArg,                                                        
	                   false,            // shiftKeyArg,                                                      
	                   false,            // metaKeyArg,                                                       
	                    code,               // keyCodeArg,                                                      
	                    0);
		target.dispatchEvent(ev);
	}catch(err){console.log(err)}
}
LoadingResultStrategy.prototype.notifyActionIfRequired = function(data) {}


//////////////////////////////////
//////////////////////////////////
//////////////////////////////////


window.WriteAndClickForAjaxCall = function(){}
window.WriteAndClickForAjaxCall.prototype = new LoadingResultStrategy();
window.WriteAndClickForAjaxCall.prototype.executeAndNotifySearch = function(data) {

	var inp = this.getSingleDomElement(data.entry); 
		inp.value = data.keywords;
	//this.emulateKeyPress("keydown", 13, inp);
	this.emulateKeyPress("keyup", 13, inp); //***
	
	//You can't use window.onload here. So we should detect the next reloading after click
	var rlc = new ReLoadingsCounter();
		rlc.setStoredValue(rlc.getStoreVariable("reloads"), 5);
		rlc.setStoredValue(rlc.getStoreVariable("strategy"), "WriteAndClickForAjaxCall");
	
	//triggering the search
	var trg = this.getSingleDomElement(data.trigger); 
	var me = this, i=0, res2;
	var loadingTrigger = setInterval(function() {
		console.log("trg", trg);
		if(trg || i>40){

			//Clearing
			clearInterval(loadingTrigger);
			if(i>40) {
				console.log("timeout: trigger wasn't found");
				return;
			}
			var oldHref = window.location.href;
			console.log("oldHref", oldHref);
			//Clicking
			trg.click();

			//Waiting for changes in the URL //window.onhashchange can't be used here 
			i=0;
			var loadingNewUrl = setInterval(function() {
				console.log("newHref: ", window.location.href);
				if((oldHref != window.location.href) || i>40){
					
					clearInterval(loadingNewUrl);
					window.location.reload(false); 
				}
				i++;
			}, 500);
		}
		i++;
		trg = me.getSingleDomElement(data.trigger); 
	}, 500);
};
window.WriteAndClickForAjaxCall.prototype.notifyActionIfRequired = function(data) {
	
	this.communicateAction();
	//En el futuro, no va a ser neceario implementar este método
}

window.WriteForAjaxCall = function(){}
window.WriteForAjaxCall.prototype= new LoadingResultStrategy();
window.WriteForAjaxCall.prototype.emulateOnChange = function(elem) {

	var evt = document.createEvent("HTMLEvents");
		evt.initEvent("change", true, true );
	elem.dispatchEvent(evt);
}
window.WriteForAjaxCall.prototype.executeAndNotifySearch = function(data) {

	var me=this, newRes, oldRes = this.getSingleDomElement(data.results.xpath);

	//Wait until results are loaded
	var i=0, loadingPrevResult = setInterval(function() {
		if(oldRes || i>40){
			
			clearInterval(loadingPrevResult);
			if(!oldRes) return;

			oldRes = oldRes.innerHTML;

			var inp = me.getSingleDomElement(data.entry); 
				inp.value = data.keywords;

			me.emulateKeyPress("keydown", 13, inp);
			me.emulateKeyPress("keyup", 13, inp);
			if(inp.onchange) me.emulateOnChange(inp);

			i=0;
			var resultsChanged = setInterval(function myTimer() {

				if(newRes== oldRes || i>40){
					clearInterval(resultsChanged);
					me.communicateAction();
				}
				i++;
				newRes = me.getSingleDomElement(data.results.xpath);
				if(newRes) newRes = newRes.innerHTML; 

			}, 500);
		}
		i++;
	}, 500);
};

window.WriteAndClickToReload = function(){}
window.WriteAndClickToReload.prototype= new LoadingResultStrategy();
window.WriteAndClickToReload.prototype.executeAndNotifySearch = function(data) {

	var inp = document.evaluate(data.entry, document, null, 9, null).singleNodeValue;
		inp.value = data.keywords;
	//You can't use window.onload here. So we should detect the next reloading after click
	var rlc = new ReLoadingsCounter();
		rlc.setStoredValue(rlc.getStoreVariable("reloads"), 5);
		rlc.setStoredValue(rlc.getStoreVariable("strategy"), "WriteAndClickToReload");

	var trg = document.evaluate(data.trigger, document, null, 9, null).singleNodeValue;
	if(trg) trg.click();
	else console.log("no trigger was found");
};
window.WriteAndClickToReload.prototype.notifyActionIfRequired = function(data) {
	this.communicateAction();
}


self.port.on("searchNewInstances", function(data){
	try{		
		var strategy = new window[data.loadingResStrategy]();
		strategy.executeAndNotifySearch(data);

	}catch(err){console.log(err)}
});
self.port.on("getDomForResultsExtraction", function(){

	//console.log("DOM: from " + window.location.href);
	//There is no sensein extracting the instances from this side, because 
	//sometimes you need extra privileges and it is really hard to doit for each async message you need
	//var results = new IOExtractor().extractDataForDatatable(resultsCog);
	//console.log(window.location.href );
	var serialized = (new XMLSerializer()).serializeToString(document);
	self.port.emit("notifyDomForResultsExtraction", 
		{textContent: serialized});
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
console.log("externalPageIsLoaded");
var rlc = new ReLoadingsCounter();

if(rlc.getPrevStoredValue(rlc.getStoreVariable("reloads"))>0){

	rlc.setStoredValue(rlc.getStoreVariable("reloads"), 0);
	var strategyClass = sessionStorage.getItem(rlc.getStoreVariable("strategy"));
	var strategy = new window[strategyClass]();
		strategy.notifyActionIfRequired();
}

