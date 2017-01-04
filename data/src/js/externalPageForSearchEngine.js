//COMMUNICATION WITH THE EXTENSION
self.port.on("searchNewInstances", function(data){
	try{

		//console.log('searchNewInstances for: ' + data.keywords + " at " + window.location.href);
		//console.log(new XMLSerializer().serializeToString(document));

		var inp = document.evaluate(data.entry, document, null, 9, null).singleNodeValue;
			inp.value = data.keywords;

		//console.log("input", inp.value);

		//TODO: replace with strategies
		if(data.trigger) {
			//console.log('Triggering button');
			var trg = document.evaluate(data.trigger, document, null, 9, null).singleNodeValue;
			if(trg) {
				trg.click();
				setTimeout(function(){ window.location.reload(false); }, 1500);
			}
		}else{
			//console.log('Loading the new URL');
			var trg = document.evaluate(data.tr);
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

console.log("Loading " + window.location.href);
self.port.emit("externalPageIsLoaded");










