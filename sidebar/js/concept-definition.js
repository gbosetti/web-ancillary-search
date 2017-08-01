window.addEventListener("load", (e) => {

	//console.log(e.target); //is the sidebar doc!!

	function DataLoader(){}
	DataLoader.prototype.loadPreview = function(imageData) {

		document.querySelector("#concept-preview-image").src = imageData;
	};
	DataLoader.prototype.loadXpaths = function(labeledXpaths) {

		var sel = document.querySelector('#edit-concept-template-xpath');
			sel.innerHTML = '';

	    for (var i = 0; i < labeledXpaths.length; i++) {
			var opt = document.createElement('option');
				opt.text = labeledXpaths[i].label; 
				opt.value = labeledXpaths[i].value;
			sel.appendChild(opt);
		};
	    /*sel.onchange = function(){ ui.currentWorker.port.emit('highlightInDom', this.value); }
	    sel.onkeyup = function(){ ui.currentWorker.port.emit('highlightInDom', this.value); }*/
	};
	

	var dataLoader = new DataLoader();

    browser.runtime.onMessage.addListener(function callSidebarSideActions(request, sender, sendResponse) {

		console.log("calling " + request.call);
		dataLoader[request.call](request.args);
	});

	//NOtify the document has been loaded
    var sendingMessage = browser.runtime.sendMessage({
        call: "loadDataForConceptDefinition" 
    });
});