/*TODO: hay que buscar mejores nombres para los mensajes de esta clase. showResults no est'a cargando los results; lo termina haciendo onExtraDependenciesLoaded. */

function ResultsVisualizer(){
	this.visualizer; //= visualizer || new Datatables(); //strategy
	this.presentationState = new WaitingForRequest(this);
}
ResultsVisualizer.prototype.showResults = function(data) {

	this.panel = this.buildPanel(data);
	this.results = data.results;

	this.setVisualizer(new Datatables(this)); //window[data.visualizer]());
	this.loadExtraDependencies();
};
ResultsVisualizer.prototype.onExtraDependenciesLoaded = function(){

	this.presentData(this.results, this.panel.childNodes[1].children[0]);
}
ResultsVisualizer.prototype.loadExtraDependencies = function(){

  	browser.runtime.sendMessage({
		call: "loadVisalizerDependencies",
		args: {
			"dependencies": this.getDependencies(),
			"callbackMessage": "onExtraDependenciesLoaded"
		}
	});
}
ResultsVisualizer.prototype.presentData = function(results, targetPanel){

	this.visualizer.presentData(results, targetPanel);
}
ResultsVisualizer.prototype.createVisualizationFrame = function(unwrappedWindow){

	var iframe = unwrappedWindow.document.createElement('iframe');
		iframe.id = "andes-results-frame-" + Date.now();
		iframe.style.width = "99%";
		iframe.style.height = "340px";
		iframe.style.background = "white";
		//iframe.onload = function(){ /* TODO: change PresentationState */ }
		iframe.src = browser.extension.getURL("/content_scripts/visualizations/index.html");
	
	return iframe;
}
ResultsVisualizer.prototype.retrieveExtenralResults = function(data) { //url resultSpec callback
	
	var conceptDomElems = this.getExternalContent(data.url, data.resultSpec.xpath, data.callbackMethod);
	
	browser.runtime.sendMessage({
		call: data.callbackMethod,
		args: {
			"results": this.extractConcepts(conceptDomElems,data.resultSpec.properties)
		}
	});
};
ResultsVisualizer.prototype.extractConcepts = function(domElements, propSpecs){

	var concepts = [], me= this;

	domElements.forEach(function(domElem){

		propSpecs.forEach(function(prop){

			var propValue = me.getSingleElement(prop.xpath, domElem);
			if(propValue && propValue.textContent){
			
				var concept = {};
					concept[prop.name] = propValue.textContent;
				concepts.push(concept);
			}
		});
	});

	return concepts;
}
ResultsVisualizer.prototype.getExternalContent = function(url, selector){

   const req = new window.XMLHttpRequest();
        req.open('GET', url, false);
        req.send(null);

    return this.evaluateSelector(selector, this.getParsedDocument(req.responseText));
};
ResultsVisualizer.prototype.getParsedDocument = function(responseText){

    return new window.DOMParser().parseFromString(responseText, "text/html");
};
ResultsVisualizer.prototype.evaluateSelector = function(selector, doc){
	//TODO: acá se debería tener un strategy para laburar con diferentes tipos de selectores
	return (new XPathInterpreter()).getElementsByXpath(selector, doc);
    //return doc.querySelector(selector).textContent;
};
ResultsVisualizer.prototype.getSingleElement = function(selector, node){
	//TODO: acá se debería tener un strategy para laburar con diferentes tipos de selectores
	return (new XPathInterpreter()).getElementByXPath(selector, node);
    //return doc.querySelector(selector).textContent;
};
ResultsVisualizer.prototype.getDependencies = function(visualizer) {
	return this.visualizer.getDependencies();
};
ResultsVisualizer.prototype.setVisualizer = function(visualizer) {
	this.visualizer = visualizer;
};
ResultsVisualizer.prototype.makePanelDraggable = function(panel) {
	document.defaultView["$"](panel).draggable();
};
ResultsVisualizer.prototype.buildPanel = function(data) {
	var resultsPanel = this.createResultsBox(document.defaultView, 
		"«"+data.resultsName+"» from «" + data.seearchEngineName + "» matching «" + data.selectedText + "»");

	document.body.appendChild(resultsPanel);
	this.makePanelDraggable(resultsPanel);

	return resultsPanel;
};
ResultsVisualizer.prototype.createResultsBox = function(unwrappedWindow, title){

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
ResultsVisualizer.prototype.createResultsBoxHeader = function(unwrappedWindow, title){

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
ResultsVisualizer.prototype.createResultsBoxBody = function(unwrappedWindow){
	var resultsBody = unwrappedWindow.document.createElement("div");
		resultsBody.style["background-color"] = "#337ab7";
		resultsBody.style["width"] = "100%"; 
    	resultsBody.style["text-align"] = "center"; 

    	resultsBody.appendChild(this.createVisualizationFrame(unwrappedWindow));
    	return resultsBody;
}


// STATE PATTERN!!!
//TODO: implementar con estados, cada cual chequea lo que corresponde 
function PresentationStatus(context){
	this.context = context;
	//...
}

function WaitingForRequest(context){
	PresentationStatus.call(this, context);
	//...
}

function WaitingForIframe(){
	PresentationStatus.call(this);
	//...
}

function WaitingForResults(){
	PresentationStatus.call(this);
	var me = this;
	//...
}






////////////// Visualization strategies

function Visualization(){}


function Datatables(visualizer){

	Visualization.call(this);
	this.visualizer = visualizer;
}
Datatables.prototype.getDependencies = function(visualizer) {
	return {
		"js": [
			"/content_scripts/vendor/datatables/media/js/jquery.dataTables.min.js", 
			"/content_scripts/vendor/datatables-responsive/js/dataTables.responsive.js"
	  	]
	};
};
Datatables.prototype.presentData = function(concepts, iframe) {

	//TODO: APPLY STATE PATTERN
	var me = this;
	var checkForIframe = setInterval(function(){ 
		var panel = iframe.contentWindow.document.querySelector("#results");

		if(panel){
			clearInterval(checkForIframe);

			//TODO: cambiar esto para que recupere resultados posta
			concepts = [{name: "Pepe", surname: "Argento"}, {name: "María Elena", surname: "Fusenecco"}];

			var table = me.createTable(concepts, iframe.contentWindow.document);
			panel.appendChild(table);
			me.initializeDatatable(document, table);	
		}
	}, 3000);
};
Datatables.prototype.initializeDatatable = function(doc, table) {
	
	doc.defaultView["$"](table).DataTable();
};

Datatables.prototype.createTable = function(concepts, doc){
	var table = doc.createElement("table");
		table.appendChild(this.createTableHeader(concepts, doc));
		table.appendChild(this.createTableBody(concepts, doc));
		return table;
}


Datatables.prototype.createTableHeader = function(concepts, doc){
	var tHead = doc.createElement("thead");
	var tr= doc.createElement("tr");
	//Create titles for Table
	for (prop in concepts[0]){
		var td = doc.createElement("td");
		td.innerHTML = prop;
		tr.appendChild(td);
	}
	tHead.appendChild(tr);
	return tHead;
}

Datatables.prototype.createTableBody = function(concepts, doc){
	var tBody = doc.createElement("tbody");
	this.populateTableBody(concepts, tBody, doc);
	return tBody;
}

Datatables.prototype.populateTableBody = function(concepts, tableBody, doc){
	concepts.forEach(function(concept){
	var conceptDomElement = doc.createElement("tr");
		for(prop in concept){
			var propDomElement = doc.createElement("td");
			propDomElement.innerHTML =  concept[prop];
			conceptDomElement.appendChild(propDomElement);
		};
		tableBody.appendChild(conceptDomElement);
	});
}

/////////////////////////////////////////////
var presenter = new ResultsVisualizer();
browser.runtime.onMessage.addListener(function callPageSideActions(request, sender, sendResponse) {

	if(presenter[request.call]) {
		console.log("calling " + request.call + " (.../visualizations.js)");
		presenter[request.call](request.args);
	}
});