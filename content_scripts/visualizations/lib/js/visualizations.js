/*TODO: hay que buscar mejores nombres para los mensajes de esta clase. showResults no est'a cargando los results; lo termina haciendo onExtraDependenciesLoaded. */

function ResultsVisualizer(){
	this.visualizer; //= visualizer || new Datatables(); //strategy
	this.presentationState = new WaitingForRequest(this);
}

ResultsVisualizer.prototype.showResults = function(data) {
	this.panel = this.buildPanel(data);
	this.results = data.results;
	//this.setVisualizer(new ViewImage(this)); //window[data.visualizer]());  //ver como definir un patron para que el usuario elija el tipo de visualización
	this.setVisualizer(new Datatables(this));	
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
	console.log(data.resultSpec.xpath);
	var conceptDomElems = this.getExternalContent(data.url, data.resultSpec.xpath, data.callbackMethod);
	
	browser.runtime.sendMessage({
		call: data.callbackMethod,
		args: {
			"results": this.extractConcepts(conceptDomElems,data.resultSpec.properties)
		}
	});
};

ResultsVisualizer.prototype.extractConcepts = function(domElements, propSpecs){
	//TODO: Modularizar codigo
	var concepts = [], me= this;
	propSpecs.forEach(function(prop){
		var propValues = me.getMultipleElements(prop.xpath, domElements[0]);
		var nameProp = prop.name;
		for (i = 0; i < propValues.length; i++) { 
			if (concepts[i]){
				if(propValue && propValue.textContent){
					concepts[i][nameProp] = propValues[i].textContent;
				}else {
					concepts[i][nameProp] = propValues[i].src;
				}
			}
			else{
				concept = {};
				concepts[i] = concept;
				if(propValue && propValue.textContent){
					concepts[i][nameProp] = propValues[i].textContent;
				}else {
					concepts[i][nameProp] = propValues[i].src;
				}
			}
			
		}
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
ResultsVisualizer.prototype.getMultipleElements = function(selector, node){
	//TODO: acá se debería tener un strategy para laburar con diferentes tipos de selectores
	return (new XPathInterpreter()).getElementsByXpath(selector, node);
}
ResultsVisualizer.prototype.getSingleElement = function(selector, node){
	//TODO: acá se debería tener un strategy para laburar con diferentes tipos de selectores
	return (new XPathInterpreter()).getElementByXPath(selector, node); 

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

ResultsVisualizer.prototype.hideLoadingMessage = function(iframe){
	iframe.contentWindow.document.getElementById("loading").remove();
}


ResultsVisualizer.prototype.showLoadingMessage = function(msg, iframe){
	iframe.contentWindow.document.getElementById("loading-message").innerHTML = msg;
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



function Multimedia(visualizer){
	
	Visualization.call(this);
	this.visualizer = visualizer;

}

/*Multimedia.prototype.getDependencies = function(visualizer){
	return {
		"js": [
	  		"/content_scripts/vendor/jquery-ui/jquery-ui.min.js"
	  	]
	};
};*/

function ViewImage(visualizer){

	Multimedia.call(this);
	this.visualizer = visualizer
	console.log("instanciaViewImage");
}

ViewImage.prototype.presentData = function(concepts, iframe){
	var me = this;
	var checkForIframe = setInterval(function(){ 
		var divImage = iframe.contentWindow.document.querySelector("#images");
		if(divImage){
			clearInterval(checkForIframe);
			//TODO: cambiar esto para que recupere resultados posta
			me.initialize(document, divImage, concepts);
		}
	}, 3000);

}

ViewImage.prototype.getDependencies = function(visualizer){

	return {
		
		"js": [
	  		"/content_scripts/vendor/jquery-ui/jquery-ui.min.js",
	  		"/content_scripts/visualizations/lib/js/functions.js"
	  	]

	};
}

ViewImage.prototype.initialize = function(doc, div, concepts){

	concepts.forEach(function(image){
<<<<<<< HEAD
		console.log(image);
		var img = doc.defaultView["$"](div).append("<div class='col-md-3'><a href='#' class='thumbnail'><img src="+image.Image+" alt='Image' style='max-width:100%;'></a></div>");
		/*console.log("entro2"+ img);
		img.setAttribute("src", image[i]);
		div.appendChild(img);
		console.log("entro4");*/
=======
		var img = doc.defaultView["$"](div).append($("img"));
>>>>>>> 43dd40ad4908d7e7660a0f256fdd7fb527102a27
	
	});

}

function Datatables(visualizer){

	Visualization.call(this);
	this.visualizer = visualizer;
}



Datatables.prototype.getDependencies = function(visualizer) {
	
	return {
		
		"js": [
			"/content_scripts/vendor/datatables/media/js/jquery.dataTables.min.js", 
			"/content_scripts/vendor/datatables-responsive/js/dataTables.responsive.js",
	  		"/content_scripts/vendor/jquery-ui/jquery-ui.min.js"
	  	]

	};
};
Datatables.prototype.presentData = function(concepts, iframe) {

	//TODO: APPLY STATE PATTERN

	var me = this;
	var v = this.visualizer;
	var checkForIframe = setInterval(function(){ 

		var table = iframe.contentWindow.document.querySelector("#results");
		if(table){
			clearInterval(checkForIframe);
			//TODO: cambiar esto para que recupere resultados posta
			me.visualizer.showLoadingMessage("Extracting Results...",iframe);
			me.initializeDatatable(document, table, iframe, concepts);
			me.visualizer.hideLoadingMessage(iframe);

		}
	}, 3000);
};

Datatables.prototype.initializeDatatable = function(doc, table, iframe, concepts) {
	
	function format (d) {
    // `d` is the original data object for the row
    	return '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">'+
	        '<tr>'+
	            '<td>Name:</td>'+
	            '<td>'+d.Name+'</td>'+
	        '</tr>'+
	        '<tr>'+
	            '<td>Price:</td>'+
	            '<td>'+d.Price+'</td>'+
	        '</tr>'+
	    '</table>';
	}

	doc.defaultView["$"](doc).ready(function(){

	var tableC =doc.defaultView["$"](table).DataTable({
        "data": concepts,
        "columns": [
            {
                "className":      'details-control',
                "orderable":      false,
                "data":           null,
                "defaultContent": ''
            },

            //Add this from concept
            { "title":"Name", "data": "Name"},
            { "title":"Price","data": "Price" }
        ],
        "order": [[1, 'asc']]
	});

	var tbody = iframe.contentWindow.document.querySelector("#results > tbody");
	doc.defaultView["$"](tbody).on('click', 'td.details-control', function () {
		var tr = doc.defaultView["$"](this).closest('tr');
      	var row = tableC.row( tr );
        if (row.child.isShown()) {
            // This row is already open - close it
            row.child.hide();
            tr.removeClass('shown');
        }
        else {
            // Open this row
            row.child( format(row.data()) ).show();
            tr.addClass('shown');
        }

	 });
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