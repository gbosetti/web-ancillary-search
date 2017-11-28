function SearchTool(){

	//PROPS
	this.selectedText;
	this.loadedScriptsByTabs = {};

	//Init
  	this.createContextMenus();
}
SearchTool.prototype.loadVisalizers = function(tab, callback) {
	//Esto es para crear el iframe draggable, no las visualizaciones de adentro del iframe

  	BackgroundResourcesLoader.syncLoadScripts([
  		new BackgroundResource("/content_scripts/vendor/jquery/dist/jquery.min.js"),
  		new BackgroundResource("/content_scripts/vendor/jquery-ui/jquery-ui.min.js"),
  		new BackgroundResource("/content_scripts/XPathInterpreter.js"),
  		new BackgroundResource("/content_scripts/ContentResourcesLoader.js"),
  		new BackgroundResource("/content_scripts/visualizations/lib/js/visualizations.js")
  	], tab, callback);
}
SearchTool.prototype.loadVisalizerDependencies = function(tab, dependencies, callbackMessage) {

	//BEHAVIOUR
	for (var i = dependencies.js.length - 1; i >= 0; i--) {
		dependencies.js[i] = new BackgroundResource(dependencies.js[i]);
	}
  	BackgroundResourcesLoader.syncLoadScripts(dependencies.js, tab, function(){
  		browser.tabs.sendMessage(tab.id, {
			call: callbackMessage
		});
  });
}
SearchTool.prototype.executeSearchWith = function(data, tab, sendResponse){

  browser.tabs.sendMessage(tab.id, {
    call: "executeSearchWith", 
    args: data
  }).then(function(){
    console.log("DONE 6");
    sendResponse("done");
  }); 
};
SearchTool.prototype.areScriptsLoadedInTab = function(tabId) {
  return this.loadedScriptsByTabs[tabId]? this.loadedScriptsByTabs[tabId] : false;
};
SearchTool.prototype.toggleLoadedScriptsInTab = function(tabId) {

  this.loadedScriptsByTabs[tabId] = !this.areScriptsLoadedInTab(tabId);    
};
SearchTool.prototype.createContextMenus = function() {     

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
              //console.log("apiSpecs", apiSpecs);

              var propId = info.menuItemId;

              //Acá adentro solo es loggueable si se anula el cierre de popups
              if(me.areScriptsLoadedInTab(tab.id)){
                me.sendExtenralResults(tab, info, apiSpecs[info.menuItemId]);
              }
              else me.loadVisalizers(tab, function(){ 
                me.sendExtenralResults(tab, info, apiSpecs[info.menuItemId]);
                me.toggleLoadedScriptsInTab(tab.id);
              }); 
            });
				}
			});
			menu.apiSpec= apiSpecs[spec];
	  	}
	}, function onError(error) {
		console.log(`Error: ${error}`);
	});
}
SearchTool.prototype.sendExtenralResults = function(tab, info, spec) {

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
	}); 
}
