//COMMUNICATION WITH THE EXTENSION
function LoadingResultStrategy(){}
LoadingResultStrategy.prototype.communicateAction = function() {
	
	self.port.emit("resultsAreAvailable");
};

function WriteAndClickForAjaxCall(){}
WriteAndClickForAjaxCall.prototype.executeAndNotifySearch = function(first_argument) {
	// body...

	this.communicateAction();
};

function WriteForAjaxCall(){}
WriteForAjaxCall.prototype.executeAndNotifySearch = function(first_argument) {
	// body...

	this.communicateAction();
};

function WriteAndClickToReload(){}
WriteAndClickToReload.prototype.executeAndNotifySearch = function(first_argument) {
	// body...

	this.communicateAction();
};

self.port.on("searchNewInstances", function(data){
	try{

		var inp = document.evaluate(data.entry, document, null, 9, null).singleNodeValue;
			inp.value = data.keywords;

		//TODO: replace with strategies
		if(data.trigger) {
			var trg = document.evaluate(data.trigger, document, null, 9, null).singleNodeValue;
			if(trg) {
				trg.click(); //Estrategia (1)
				//console.log("Estrategia 1");
				setTimeout(function(){ 
					//console.log("Sorry, no es 1 es Estrategia 2");
					window.location.reload(false); 
				}, 1500);  //Estrategia (2)
			}
		}else{
			//console.log('Loading the new URL');
			//Estrategia (3)
			console.log("Estrategia 3");
			window.location.href = window.location.href + data.keywords;
		}
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

//console.log("Loading " + window.location.href);
self.port.emit("externalPageIsLoaded");










