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
SearchTool.prototype.onVisualizationLoaded = function(args, tab) {     

  browser.tabs.sendMessage(tab.id, { call: "onVisualizationLoaded" }); 
}
SearchTool.prototype.presentDataInVisualization = function(args, tab) {     

  browser.tabs.sendMessage(tab.id, { call: "presentData" }); 
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

  var me = this;
	browser.tabs.sendMessage(tab.id, {
		call: "retrieveExtenralResults", 
		args: {
      "resultsName": spec.results.name,
      "selectedText": info.selectionText,
      "seearchEngineName": info.menuItemId,
      "visualizer": "Datatables",
      "tabId": tab.id,
      "service": spec,
      "keywords": info.selectionText
    }
	}); /*.then(response => {
    console.log("response:", response);
    me.presentResults(response.results); //TODO: remove this
  });*/
}