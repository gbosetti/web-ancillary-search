//COMMUNICATION WITH THE EXTENSION
self.port.on("searchNewInstances", function(data){

	//console.log('Searching for: ' + data.keywords);

	var inp = document.evaluate(data.entry, document, null, 9, null).singleNodeValue;
		inp.value = data.keywords;

	//TODO: replace with strategies
	if(data.trigger) {
		var trg = document.evaluate(data.trigger, document, null, 9, null).singleNodeValue;
		if(trg) trg.click();
	}else{
		window.location.href = window.location.href + data.keywords;
	}
});
self.port.on("getDomForResultsExtraction", function(){

	//There is no sensein extracting the instances from this side, because 
	//sometimes you need extra privileges and it is really hard to doit for each async message you need
	//var results = new IOExtractor().extractDataForDatatable(resultsCog);
	console.log(window.location.href );
	self.port.emit("notifyDomForResultsExtraction", 
		{textContent: (new XMLSerializer()).serializeToString(document)});
});


self.port.emit("externalPageIsLoaded");










