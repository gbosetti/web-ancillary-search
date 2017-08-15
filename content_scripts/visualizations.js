function ResultsVisualizer(){
	this.visualizer; //= visualizer || new Datatables(); //strategy
}
ResultsVisualizer.prototype.showResults = function(data) {

	var panel = this.buildPanel(data);

	this.setVisualizer(new Datatables()); //window[data.visualizer]());
	//this.loadDependencies();
	console.log("retrievable", document.querySelector("#andes-results-frame"));
	browser.runtime.sendMessage({
		call: "loadDocumentIntoResultsFrame",
		args: {
			"selector": "#andes-results-frame",
			"file": "content_scripts/visualizers/datatables/datatables-visualization.html",
			"dependencies": this.getDependencies(),
			"callback": "onDocumentLoaded"
		}
	});
};
ResultsVisualizer.prototype.createVisualizationFrame = function(unwrappedWindow){

	//console.log(browser);
	var iframe = unwrappedWindow.document.createElement('iframe');
		iframe.id = "andes-results-frame";
		iframe.style.width = "99%";
		iframe.style.height = "340px";
		//the source will not loadbecause the ./ in the path will be resolved to the current web page
		iframe.src = browser.extension.getURL("/content_scripts/visualizations/datatables/index.html");
	
	return iframe;
}
ResultsVisualizer.prototype.loadDependencies = function(visualizer) {
	browser.runtime.sendMessage({
		call: "loadDependenciesIntoResultsFrame",
		args: {
			"selector": "andes-results-frame",
			"dependencies": this.getDependencies(),
			"callback": "onDependenciesLoaded"
		}
	});
	this.visualizer.getDependencies();
};
ResultsVisualizer.prototype.onDocumentLoaded = function() {
	console.log("dependencies have been loaded!");
	//this.visualizer.presentData(data.results, panel.childNodes[1]);
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





////////////// Visualization strategies

function Visualization(){}


function Datatables(visualizer){

	Visualization.call(this);
}
Datatables.prototype.getDependencies = function(visualizer) {
	return {
		"js": [
			"/content_scripts/vendor/jquery/dist/jquery.min.js",
			"/content_scripts/vendor/bootstrap/dist/js/bootstrap.min.js", 
			"/content_scripts/vendor/datatables/media/js/jquery.dataTables.min.js", 
			"/content_scripts/vendor/datatables-responsive/js/dataTables.responsive.js"
		],
		"css": [
			"/content_scripts/visualizers/datatables/visualization.css",
			"/content_scripts/vendor/datatables/media/css/jquery.dataTables.min.css", 
			"/content_scripts/vendor/datatables-responsive/css/responsive.dataTables.min.css",
			"/content_scripts/vendor/bootstrap/dist/css/bootstrap.min.css"
		]
	};
};
Datatables.prototype.presentData = function(results, panel) {

	console.log(results);
	panel.appendChild(this.createSpecializedVisualizationBox(document.defaultView));
};
Datatables.prototype.getDocumentPath = function(unwrappedWindow){

	return "./visualizers/datatables/datatables-visualization.html";
}





/////////////////////////////////////////////
var presenter = new ResultsVisualizer();
browser.runtime.onMessage.addListener(function callPageSideActions(request, sender, sendResponse) {

	console.log("calling " + request.call + " (content_scripts/visualizations.js)");
	presenter[request.call](request.args);
});