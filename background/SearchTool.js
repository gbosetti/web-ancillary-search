function SearchTool(){

	//PROPS
	this.selectedText;
	this.loadedScriptsByTabs = {};

	//Init
  	this.createContextMenus();
}
SearchTool.prototype.createContextMenus = function() {     

  //por ahora una sola entarda
  //this.fakeApiDefinitions(); //to be removed on production
  var me = this;    
  browser.contextMenus.removeAll().then(function(){ 
    me.createApisMenu();
    me.populateApisMenu();    
  }); 
}
SearchTool.prototype.createApisMenu = function(){

  //The menu is created
  browser.contextMenus.create({
      id: "search-with-search-api",
      title: "Search «%s» at", //TODO: create a message with params like in the old tool (see video) browser.i18n.getMessage("search at"),
      contexts: ["selection"]
  });
}
SearchTool.prototype.populateApisMenu = function(){ //Add items to the browser's context menu
	var me = this;
  //TODO: use the class: filereader
  browser.storage.local.get("services").then((storage) => {

    var apiSpecs = storage.services;

		for (spec in apiSpecs) {
			var menu = browser.contextMenus.create({
				id: spec,
				parentId: "search-with-search-api", 
				title: apiSpecs[spec].name,
				contexts: ["selection"],
				onclick: function(info,tab){ 

            browser.storage.local.get("services").then((updatedStorage) => {
              apiSpecs = updatedStorage.services;              
              //Acá adentro solo es loggueable si se anula el cierre de popups
              me.sendExtenralResults(tab, info, apiSpecs[info.menuItemId]);
            });
				}
			});
			menu.apiSpec= apiSpecs[spec];
	  	}
	}, function onError(error) {
		console.log(`Error: ${error}`);
	});
}
SearchTool.prototype.disableLoading = function(tab) {
  browser.tabs.sendMessage(tab.id, {
    call: "disableLoading"
  });
}
SearchTool.prototype.sendExtenralResults = function(tab, info, spec) {

  this.currentExecutionData = {
    "resultsName": spec.results.name,
    "selectedText": info.selectionText,
    "seearchEngineName": info.menuItemId,
    "visualizer": "Datatables",
    "tabId": tab.id,
    "service": spec,
    "keywords": info.selectionText
  };

  var me = this;
	browser.tabs.sendMessage(tab.id, { 
		call: "initializeWidget", 
		args: me.currentExecutionData
	}).then(data => {
    //WAIT FOR THE CONCRETE VISUALIZATION TO LOAD ON THE WIDGET
    //console.log("Waiting visualizaton to be loaded:", data);
    //NEXT STEP IS EXECUTED BY "onVisualizationLoaded"
    //But we need to keep the data (currentExecutionData)
  }); 
}
SearchTool.prototype.onVisualizationLoaded = function(tab){

  var me = this;
  return new Promise((resolve, reject) => {
      me.getExternalContent(me.currentExecutionData).then(function(data){
        resolve(data.service);
      });
  });
}
SearchTool.prototype.getParsedDocument = function(responseText){

    return new window.DOMParser().parseFromString(responseText, "text/html");
};
SearchTool.prototype.getExternalContent = function(data) {
  //TODO: move this behaviour to the searchTool class
  var me = this;
  return new Promise((resolve, reject) => {

    const req = new window.XMLHttpRequest();
        req.open('GET', data.service.url, false);
        req.send(null);

    var parsedDoc = me.getParsedDocument(req.responseText); //with def results. we need to trigger
    var conceptDomElems = me.evaluateSelector(data.service.results.selector.value, parsedDoc);  
    data.service.results = me.extractConcepts(conceptDomElems, data.service.results.properties);

      resolve(data); 
  });
};
SearchTool.prototype.evaluateSelector = function(selector, doc){
  //TODO: acá se debería tener un strategy para laburar con diferentes tipos de selectores
  return (new XPathInterpreter()).getElementsByXpath(selector, doc);
};
SearchTool.prototype.extractConcepts = function(domElements, propSpecs){
  //TODO: Modularizar codigo
  var concepts = [], me= this;
  var keys = Object.keys(propSpecs);
  
  if(keys.length > 0){
    keys.forEach(function(key){

      var propElems = me.getMultiplePropsFromElements(propSpecs[key].relativeSelector, domElements);
      console.log(propElems);

      for (i = 0; i < propElems.length; i++) { 
        if (propElems[i] != null){ //If the object has the property, then

          //console.log(propElems[i]);
          if (concepts[i]){ //si hay concepto, se agrega propiedad
            if(propElems[i] && propElems[i].textContent){
              concepts[i][key] = propElems[i].textContent;
            }else concepts[i][key] = propElems[i].src;
          } //si no hay concepto, se crea
          else{
            concepts[i] = {};
            if(propElems[i] && propElems[i].textContent){
              concepts[i][key] = propElems[i].textContent;
            }else concepts[i][key] = propElems[i].src;
          }
        } 

        if(concepts[i][key] == undefined || concepts[i][key] == null) 
          concepts[i][key] = " ";
      }
    });
  } else alert("There are no properties defined. Results can not be extracted.");
  return concepts;
};
SearchTool.prototype.getMultiplePropsFromElements = function(relativeSelector, relativeDomElems){
  //TODO: acá se debería tener un strategy para laburar con diferentes tipos de selectores
  var props = [], indexesOfInfoItems = Object.keys(relativeDomElems);

  if(indexesOfInfoItems.length > 0){
    indexesOfInfoItems.forEach(function(index){
      var prop = (new XPathInterpreter()).getSingleElementByXpath(relativeSelector, relativeDomElems[index]);
      
      console.log(index, relativeSelector, relativeDomElems[index]);
      if(prop) {
        props.push(prop);
      } else props.push(" ");
    });
  }
  return props; 
};