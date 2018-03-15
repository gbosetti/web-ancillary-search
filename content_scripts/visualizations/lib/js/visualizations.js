function VisualizationsManager(){
	this.data;
}

VisualizationsManager.prototype.showWidget = function(data) {
	this.panel = this.createResultsBox(document.defaultView, 
		"«"+data.resultsName+"» from «" + data.seearchEngineName + "» matching «" + data.selectedText + "»");

	document.body.appendChild(this.panel);
	this.makePanelDraggable(this.panel);
};
VisualizationsManager.prototype.onVisualizationLoaded = function(){

	var me = this;
	browser.runtime.sendMessage({ "call": "getExternalContent", "args": me.data }).then(function(extractedData){
		
	    /*const req = new window.XMLHttpRequest();
        req.open('GET', url, false);
        req.send(null);

	    var parsedDoc = me.getParsedDocument(req.responseText); //with def results. we need to trigger
	    var conceptDomElems = me.evaluateSelector(me.data.service.results.selector.value, parsedDoc);	

	    console.log("conceptDomElems!!!!", conceptDomElems);
		var results = me.extractConcepts(conceptDomElems, me.data.service.results.properties);
	    me.data.results = results;*/
	    console.log("extractedData");
	    console.log(extractedData);
	    browser.runtime.sendMessage({ "call": "presentDataInVisualization", "args": extractedData });
	});
}

VisualizationsManager.prototype.createVisualizationFrame = function(unwrappedWindow){

	var iframe = unwrappedWindow.document.createElement('iframe');
		iframe.id = "andes-results-frame-" + Date.now();
		iframe.style.width = "99%";
		iframe.style.height = "340px";
		iframe.style.background = "white";
		iframe.src = browser.extension.getURL("/content_scripts/visualizations/index.html");
	
	return iframe;
}

VisualizationsManager.prototype.retrieveExtenralResults = function(data) { //url resultSpec callback

	this.data = data;
	this.showWidget(data);
};

VisualizationsManager.prototype.extractConcepts = function(domElements, propSpecs){
	//TODO: Modularizar codigo
	var concepts = [], me= this;
	var keys = Object.keys(propSpecs);
	
	if(keys.length > 0){
		keys.forEach(function(key){

			var propElems = me.getMultiplePropsFromElements(
				propSpecs[key].relativeSelector, domElements);

			for (i = 0; i < propElems.length; i++) { 
				if (propElems[i] != null){

					if (concepts[i]){ //si hay concepto, se agrega propiedad
						if(propElems[i] && propElems[i].textContent){
							concepts[i][key] = propElems[i].textContent;
						}else {
							concepts[i][key] = propElems[i].src;
						}
					} //si no hay concepto, se crea
					else{
						concepts[i] = {};
						if(propElems[i] && propElems[i].textContent){
							concepts[i][key] = propElems[i].textContent;
						}else {
							concepts[i][key] = propElems[i].src;
						}
					}
				} 

				if(concepts[i][key] == undefined || concepts[i][key] == null) 
					concepts[i][key] = " ";
			}
		});
	} else alert("There are no properties defined. Results can not be extracted.");
	return concepts;
}
VisualizationsManager.prototype.getParsedDocument = function(responseText){

    return new window.DOMParser().parseFromString(responseText, "text/html");
};
VisualizationsManager.prototype.evaluateSelector = function(selector, doc){
	//TODO: acá se debería tener un strategy para laburar con diferentes tipos de selectores
	return (new XPathInterpreter()).getElementsByXpath(selector, doc);
};
VisualizationsManager.prototype.getMultiplePropsFromElements = function(relativeSelector, relativeDomElems){
	//TODO: acá se debería tener un strategy para laburar con diferentes tipos de selectores
	var props = [], indexesOfInfoItems = Object.keys(relativeDomElems);

	if(indexesOfInfoItems.length > 0){
		indexesOfInfoItems.forEach(function(index){
			var prop = (new XPathInterpreter()).getSingleElementByXpath(relativeSelector, relativeDomElems[index]);
			if(prop) {
				props.push(prop);
			} else props.push(" ");
		});
	}
	return props; 
}
VisualizationsManager.prototype.getSingleElement = function(selector, node){
	//TODO: acá se debería tener un strategy para laburar con diferentes tipos de selectores
	return (new XPathInterpreter()).getElementByXPath(selector, node); 

};
VisualizationsManager.prototype.makePanelDraggable = function(panel) {
	document.defaultView["$"](panel).draggable();
};
VisualizationsManager.prototype.createResultsBox = function(unwrappedWindow, title){

	//CONTAINER
	var resultsBox = unwrappedWindow.document.createElement("div");
		resultsBox.className = "andes-results"; //just for easily retrieving the element
		resultsBox.style.width = "490px";
		resultsBox.style.height = "400px";
		resultsBox.style.zIndex = "2147483647";
		resultsBox.style["box-sizing"] = "border-box";
		resultsBox.style["font-family"] = ",Arial,sans-serif";
		resultsBox.style["font-size"] = "16px";
		resultsBox.style["line-height"] = "24px";
		resultsBox.style["margin-bottom"] = "30px";
		resultsBox.style["margin-left"] = "0px";
		resultsBox.style["margin-right"] = "0px";
		resultsBox.style["margin-top"] = "30px";
		resultsBox.style["position"] = "relative";
		resultsBox.style.border = "1px solid rgba(0, 0, 0, 0.2)";
		resultsBox.style["border-radius"] = "5px 5px 0px 0px";
		resultsBox.style["position"] = "fixed";
		resultsBox.style["background"] = "white";

		var w = Math.max(unwrappedWindow.document.documentElement.clientWidth, unwrappedWindow.innerWidth || 0);
		var h = Math.max(unwrappedWindow.document.documentElement.clientHeight, unwrappedWindow.innerHeight || 0);
		resultsBox.style["top"] = ((h/2) - 200) + "px";
		resultsBox.style["left"] = ((w/2) - 250) + "px";

		resultsBox.appendChild(this.createResultsBoxHeader(unwrappedWindow, title));
		resultsBox.appendChild(this.createResultsBoxBody(unwrappedWindow));
	return resultsBox;
}
VisualizationsManager.prototype.createResultsBoxHeader = function(unwrappedWindow, title){

	//TODO: refactoring > createHeader(title): HtmlDivElement
	var resultsHeader = unwrappedWindow.document.createElement("div");
		resultsHeader.innerHTML = title;
		resultsHeader.style["color"] = "white";
		resultsHeader.style.backgroundColor = "#337AB7";
		resultsHeader.style["border-bottom-color"] = "rgb(229, 229, 229)";
		resultsHeader.style["border-bottom-style"] = "solid";
		resultsHeader.style["border-bottom-width"] = "1px";
		resultsHeader.style["box-sizing"] = "border-box";
		resultsHeader.style["font-family"] = "Arial,sans-serif";
		resultsHeader.style["font-size"] = " 16px";
		resultsHeader.style["font-weight"] = "bold";
		resultsHeader.style["line-height"] = " 24px";
		resultsHeader.style["padding"] = "15px";
		resultsHeader.style["border-radius"] = "5px 5px 0px 0px";

	//TODO: refactoring > createCloseButton(): Span
	var closeButton = unwrappedWindow.document.createElement("span");
		closeButton.innerHTML = "✕";
		closeButton.style["background-color"] = "rgba(0, 0, 0, 0.15)";
		closeButton.style["border-radius"] = "4px";
		closeButton.style["box-sizing"] = "border-box";
		closeButton.style["color"] = "rgb(255, 255, 255)";
		closeButton.style["display"] = "block";
		closeButton.style["floatrightfont-family"] = "Helvetica,Arial,sans-serif";
		closeButton.style["font-size"] = "25px";
		closeButton.style["line-height"] = "21.4333px";
		closeButton.style["margin-right"] = "-12px";
		closeButton.style["margin-top"] = "-5px";
		closeButton.style["padding-bottom"] = "6px";
		closeButton.style["width"] = "22px";
		closeButton.style["float"] = "right";
		closeButton.onclick = function(){
			resultsHeader.parentElement.remove();
		}
		resultsHeader.appendChild(closeButton);
		
	return resultsHeader;
}
VisualizationsManager.prototype.createResultsBoxBody = function(unwrappedWindow){
	var resultsBody = unwrappedWindow.document.createElement("div");
		resultsBody.style["background-color"] = "#337ab7";
		resultsBody.style["width"] = "100%"; 
    	resultsBody.style["text-align"] = "center"; 

    	resultsBody.appendChild(this.createVisualizationFrame(unwrappedWindow));

	return resultsBody;
}


/////////////////////////////////////////////
var presenter = new VisualizationsManager();
browser.runtime.onMessage.addListener(request => {
  
	if(presenter[request.call]) {
		console.log("calling " + request.call + " (.../visualizations.js)");
		return presenter[request.call](request.args);
	}
});