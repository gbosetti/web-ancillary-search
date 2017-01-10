//COMMUNICATION WITH THE EXTENSION
function LoadingResultStrategy(){}
LoadingResultStrategy.prototype.communicateAction = function() {
	
	self.port.emit("resultsAreAvailable");
};
LoadingResultStrategy.prototype.getSingleDomElement = function(xpath) {
	try{
		return document.evaluate(xpath, document, null, 9, null).singleNodeValue;
	}catch(err){
		return;
	}
};
LoadingResultStrategy.prototype.emulateKeyPress = function(evnt, code) {
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
	document.body.dispatchEvent(ev);
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
	//You can't use window.onload here. So we should detect the next reloading after click
	var rlc = new ReLoadingsCounter();
		rlc.setStoredValue(rlc.getStoreVariable("reloads"), 5);
		rlc.setStoredValue(rlc.getStoreVariable("strategy"), "WriteAndClickForAjaxCall");
	//window.onhashchange can't be used here 
	var trg = document.evaluate(data.trigger, document, null, 9, null).singleNodeValue;
	if(trg) {
		trg.click(); 
		//We reload to snotify changes when results are there
	} else console.log("We could' not find the trigger element");

	setTimeout(function(){ window.location.reload(false); }, 500);
	
	/*var inp = this.getSingleDomElement(data.entry); 
		inp.value = data.keywords;
	//You can't use window.onload here. So we should detect the next reloading after click
	var rlc = new ReLoadingsCounter();
		rlc.setStoredValue(rlc.getStoreVariable("reloads"), 5);
		rlc.setStoredValue(rlc.getStoreVariable("strategy"), "WriteAndClickForAjaxCall");
	
	var res1 = this.getSingleDomElement(data.results.xpath);

	var me = this, i=0, res2;
	var resHasLoaded = setInterval(function myTimer2() {
		if(res1 || i>40){
			
			clearInterval(resHasLoaded);
			//window.onhashchange can't be used here 
			if(data.trigger){
				var trg = document.evaluate(data.trigger, document, null, 9, null).singleNodeValue;
				if(trg) {
					trg.click(); 
					//We reload to snotify changes when results are there
				} else console.log("We could' not find the trigger element");
			}
			

			var j=0, res2;
			var resultsChanged = setInterval(function myTimer() {
				console.log("... " + j);
				if((res2 && res2.innerHTML == res1.innerHTML) || j>40){
					clearInterval(resultsChanged);
					//window.location.reload(false);
					//me.communicateAction();

					var doc = (new XMLSerializer()).serializeToString(document);
					console.log(document);

					self.port.emit("notifyDomForResultsExtraction", 
					{textContent: doc});

				}
				j++;
				res2 = me.getSingleDomElement(data.results.xpath); 
			}, 1000);

		}
		i++;
		res1 = me.getSingleDomElement(data.results.xpath).innerHTML; 
	}, 500);*/

	
	

	//setTimeout(function(){ window.location.reload(false); }, 500);
};
window.WriteAndClickForAjaxCall.prototype.notifyActionIfRequired = function(data) {
	//this.communicateAction();
	//En el futuro, no va a ser neceario implementar este método
}

window.WriteForAjaxCall = function(){}
window.WriteForAjaxCall.prototype= new LoadingResultStrategy();
window.WriteForAjaxCall.prototype.executeAndNotifySearch = function(data) {

	var res1 = this.getSingleDomElement(data.results.xpath).innerHTML; 

	var inp = this.getSingleDomElement(data.entry); 
		inp.value = data.keywords;
		inp.focus();

	this.emulateKeyPress("keydown", 13);
	this.emulateKeyPress("keypress", 13);
	this.emulateKeyPress("keyup", 13);

	var me = this, i=0;
	var resultsChanged = setInterval(function myTimer() {
		if(res2== res1 || i>40){
			clearInterval(resultsChanged);
			me.communicateAction();
		}
		i++;
		var res2 = me.getSingleDomElement(data.results.xpath).innerHTML; 
	}, 500);
};


window.WriteAndReload = function(){}
window.WriteAndReload.prototype= new LoadingResultStrategy();
window.WriteAndReload.prototype.executeAndNotifySearch = function(data) {

	//this.emulateKeyPress("keypress", 27);
	
	//The user writes and the URL is changed, so it is enogh to reload to see the results
	var rlc = new ReLoadingsCounter();
		rlc.setStoredValue(rlc.getStoreVariable("reloads"), 5);
		rlc.setStoredValue(rlc.getStoreVariable("strategy"), "WriteAndReload");

	var res1 = this.getSingleDomElement(data.results.xpath).innerHTML; 

	var inp = document.evaluate(data.entry, document, null, 9, null).singleNodeValue;
		inp.value = data.keywords;
		inp.focus();

	this.emulateKeyPress("keydown", 13);
	this.emulateKeyPress("keypress", 13);
	this.emulateKeyPress("keyup", 13);

	inp.blur();
	
	//console.log("ORIG", res1);
	//var me = this; //, i=0;
	//var resultsChanged = setInterval(function myTimer() {
		/*if(res2== res1 || i>40){
			clearInterval(resultsChanged);
			me.notifyActionIfRequired();
		}
		i++;
		var res2 = me.getSingleDomElement(data.results.xpath).innerHTML; 
		console.log(res2);*/
		//me.notifyActionIfRequired();
	//}, 500);
	setTimeout(function(){ console.log("reloading"); window.location.reload(false); }, 2500);
};
window.WriteAndReload.prototype.notifyActionIfRequired = function(data) {
	this.communicateAction();
	//En el futuro, no va a ser neceario implementar este método
}

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

	rlc.setStoredValue(rlc.getStoreVariable("reloads"), 0);
	var strategyClass = sessionStorage.getItem(rlc.getStoreVariable("strategy"));
	var strategy = new window[strategyClass]();
		strategy.notifyActionIfRequired();
}

