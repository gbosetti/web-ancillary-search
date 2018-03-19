function TableVisualizer(domId){
	this.initialize(domId);
}
TableVisualizer.prototype.initialize = function(domId) {
	
	this.showLoadingMessage("Extracting Results...");
	this.domId = domId;
	document.body.appendChild(this.createTable(domId));

	var me = this;
	browser.runtime.sendMessage({ 
		"call": "onVisualizationLoaded", 
		"args": { "domId": domId }})
	.then(data => { //en esa data vuelve el domId (x multiples async)

		me.loadDemoPage(data);
	});
};
TableVisualizer.prototype.loadDemoPage = function(searchData){

	var frame = document.createElement("iframe");
		frame.style.display = "none";
	document.body.appendChild(frame);
	frame.src = searchData.url; //Acá se cargan 2. Primero una equivalente al about blank, después la que le llega.
	
	browser.runtime.sendMessage({ 
		"call": "startListeningForUrls", 
		"args": searchData
	});
}
TableVisualizer.prototype.showLoadingMessage = function(msg){
	document.getElementById("loading-message").innerHTML = msg;
}
TableVisualizer.prototype.presentData = function(data){
	
	var table = document.querySelector("#" + data.domId);
	this.initializeDatatable(table, data.results);
	this.hideLoadingMessage();
}
TableVisualizer.prototype.createTable = function(id){

	var table = document.createElement("table");
		table.id=id;
		table.className = "display";
		table.setAttribute("width", "100%");
		table.setAttribute("cellspacing", "0");

	return table;
}
TableVisualizer.prototype.hideLoadingMessage = function(){
	var loading = document.querySelector("#loading");
	if(loading)
		loading.remove();
}
TableVisualizer.prototype.initializeDatatable = function(table, concepts) {

		if (concepts[0] == undefined){
			//no concepts found
			var errorArea = table.parentElement.querySelector("#andes-error-area");
				errorArea.innerHTML = "<span>" + browser.i18n.getMessage("no_results_found") + "</span>";
			return;
		}

		var properties = Object.keys(concepts[0]);
		var tableC =table.ownerDocument.defaultView["$"](table).DataTable({
        "paging": false,
        "bFilter": false,
        "ordering": true,
        "searching": false,
        "data": concepts,
        "columns": [
            {
                "className":      'details-control',
                "orderable":      false,
                "data":           null,
                "defaultContent": ' '
            },
            { "title":properties[0], "data": properties[0]},
            { "title":properties[1], "data": properties[1],  "defaultContent": "<i>Not set</i>"}
        ],
        "order": [[1, 'asc']]
	});
}
 
window.addEventListener('DOMContentLoaded', function(){
	var tableVis = new TableVisualizer("andes-results-" + Date.now());
	browser.runtime.onMessage.addListener(function callTableVisActions(request, sender) {

		if(tableVis[request.call]){
			//console.log(request.call + " at TableVisualizer", request.args);
			//Se lo llama con: browser.tabs.sendMessage
			tableVis[request.call](request.args);
		}
	});
});