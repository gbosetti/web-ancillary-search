window.addEventListener("load", (e) => {

	//For loading the data of the user-selected element to the form
	function DataLoader(templatesCreator){
		this.templatesCreator = templatesCreator;
		this.loadDataSavingListeners();
	}
	DataLoader.prototype.loadDataSavingListeners = function(imageData) {
		var me = this;
		document.querySelector("#edit-result-name").addEventListener("change", function(evt){
			//console.log(this); ok
			var userInput = this.value;
			me.templatesCreator.getCurrentSpec(function(spec){

				spec.saveName(userInput);
			});	
		});
	};
	DataLoader.prototype.loadPreview = function(imageData) {

		document.querySelector("#result-preview-image").src = imageData;
	};
	DataLoader.prototype.highlightInDom = function(xpath) {

		console.log("from sidebar: ", xpath);
		browser.runtime.sendMessage({ 
    		call: "highlightInDom",
    		args: {"xpath": xpath}
    	});
	};
	DataLoader.prototype.loadResult = function(file) {

		//TODO: debug and make it work
		this.templatesCreator.getCurrentSpec(function(spec){
			 document.querySelector("#edit-result-name").value = spec.getName();
			 document.querySelector("#edit-result-xpath").value = spec.getXpath();
		});	
	};
	DataLoader.prototype.loadXpaths = function(labeledXpaths) {

		var sel = document.querySelector('#edit-result-xpath');
			sel.innerHTML = '';

	    for (var i = 0; i < labeledXpaths.length; i++) {
			var opt = document.createElement('option');
				opt.text = labeledXpaths[i].label; 
				opt.value = labeledXpaths[i].value;
			sel.appendChild(opt);
		};

		var me = this;
	    sel.onchange = function(){ 

	    	var xpath = this.value;

	    	me.highlightInDom(xpath);
	    	
			me.templatesCreator.getCurrentSpec(function(spec){
				spec.saveXpath(xpath);
			});	
	    }
	    /*sel.onkeyup = function(){ ui.currentWorker.port.emit('highlightInDom', this.value); }*/
	};


	var dataLoader = new DataLoader(new TemplatesCreator(new StorageFilesManager()));
		dataLoader.loadResult({"key": ""});


	//EXTENSION-EVENT LISTENERS
    browser.runtime.onMessage.addListener(function callSidebarSideActions(request, sender, sendResponse) {

		console.log("calling " + request.call + " (sidebar/lib/js/concept-definition.js)");
		dataLoader[request.call](request.args);
	});

	//Notifying the extension that the form has been loaded
    browser.runtime.sendMessage({ call: "loadDataForConceptDefinition" });
});