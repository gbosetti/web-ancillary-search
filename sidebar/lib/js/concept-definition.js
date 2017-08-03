window.addEventListener("load", (e) => {

	//For loading the data of the user-selected element to the form
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
	var templatesCreator = new TemplatesCreator(new StorageFilesManager());


	//FORM-EVENT LISTENERS
	document.querySelector("#edit-result-template-name").addEventListener("change", function(evt){
		//console.log(this); ok
		var userInput = this.value;
		templatesCreator.getCurrentSpec(function(spec){

			spec.saveName(userInput);
		});	
	});
	
	//EXTENSION-EVENT LISTENERS
    browser.runtime.onMessage.addListener(function callSidebarSideActions(request, sender, sendResponse) {

		console.log("calling " + request.call);
		dataLoader[request.call](request.args);
	});

	//Notifying the extension that the form has been loaded
    browser.runtime.sendMessage({
        call: "loadDataForConceptDefinition" 
    });
});