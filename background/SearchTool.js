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

  	//STYLE
  	/*for (var i = dependencies.css.length - 1; i >= 0; i--) {
		dependencies.css[i] = new BackgroundResource(dependencies.css[i]);
	}
  	BackgroundResourcesLoader.syncLoadStyles(dependencies.css, tab);*/
}
SearchTool.prototype.areScriptsLoadedInTab = function(tabId) {
  return this.loadedScriptsByTabs[tabId]? this.loadedScriptsByTabs[tabId] : false;
};
SearchTool.prototype.toggleLoadedScriptsInTab = function(tabId) {

  this.loadedScriptsByTabs[tabId] = !this.areScriptsLoadedInTab(tabId);
};
SearchTool.prototype.createContextMenus = function() {

  //por ahora una sola entarda
  this.fakeApiDefinitions(); //to be removed on production
  this.createApisMenu();
  this.populateApisMenu();
}
//This will be generated in the definition of each search service. It may also be retrieved from a server
SearchTool.prototype.fakeApiDefinitions = function(){
  browser.storage.local.set({
    ebay: {
      name:'ebay',
      url:'http://www.ebay.com/sch/i.html?_odkw=xm&LH_PrefLoc=3&_sop=15&_osacat=0&_from=R40&_trksid=p2045573.m570.l1313.TR11.TRC2.A0.H0.Xxx.TRS1&_nkw=xx&_sacat=0',
      keywords:'',
      loadingResStrategy: "WriteAndClickToReload", 
      contentScriptWhen: "ready",
      entry:'//form//table//input',
      trigger:'//form//table/tbody/tr/td[3]/input',
      results: {
        name: 'Generics',
        xpath:'//div[@id="ResultSetItems"]/ul/li',
        properties:[
          {
            name:'Name',
            xpath:'//h3/a', 
            extractor: "SingleNodeExtractor"// new SingleNodeExtractor()
          },
          {
            name: 'Price',
            xpath: '//ul/li/span',
            extractor: "SingleNodeExtractor"// new SingleNodeExtractor()
          }
        ]
      },
      visualization:{
        colsDef: [{
            title: "Name",
            responsivePriority: 1
          },{
            title: "Price",
            responsivePriority: 1
          }]
      }
    },
    ebay: {
      name:'ebay',
      url:'http://www.ebay.com/sch/i.html?_odkw=xm&LH_PrefLoc=3&_sop=15&_osacat=0&_from=R40&_trksid=p2045573.m570.l1313.TR11.TRC2.A0.H0.Xxx.TRS1&_nkw=xx&_sacat=0',
      keywords:'',
      loadingResStrategy: "WriteAndClickToReload", 
      contentScriptWhen: "ready",
      entry:'//form//table//input',
      trigger:'//form//table/tbody/tr/td[3]/input',
      results: {
        name: 'Generics',
        xpath:'//div[@id="ResultSetItems"]/ul/li',
        properties:[
          {
            name:'Name',
            xpath:'//h3/a', 
            extractor: "SingleNodeExtractor"// new SingleNodeExtractor()
          },
          {
            name: 'Price',
            xpath: '//ul/li/span',
            extractor: "SingleNodeExtractor"// new SingleNodeExtractor()
          }
        ]
      },
      visualization:{
        colsDef: [{
            title: "Name",
            responsivePriority: 1
          },{
            title: "Price",
            responsivePriority: 1
          }]
      }
    }
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
  
	var me = this, getApiSpecifications = browser.storage.local.get(null); //TODO: use the class: filereader

	getApiSpecifications.then((apiSpecs) => {

		for (spec in apiSpecs) {
			var menu = browser.contextMenus.create({
				id: spec,
				parentId: "search-with-search-api", 
				title: apiSpecs[spec].name,
				contexts: ["selection"],
				onclick: function(info,tab){ 
          
            		//Acá adentro solo es loggueable si se anula el cierre de popups
				    if(me.areScriptsLoadedInTab(tab.id)){
					   	me.sendExtenralResults(tab, info, apiSpecs);
				    }
				    else me.loadVisalizers(tab, function(){ 
  						me.sendExtenralResults(tab, info, apiSpecs);
  						me.toggleLoadedScriptsInTab(tab.id);
					}); 
				}
			});
			menu.apiSpec= apiSpecs[spec];
	  	}
	}, function onError(error) {
		console.log(`Error: ${error}`);
	});
}
SearchTool.prototype.sendExtenralResults = function(tab, info, apiSpecs) {

	this.presentationParams = {
		"resultsName": apiSpecs[info.menuItemId].results.name,
		"selectedText": info.selectionText,
		"seearchEngineName": info.menuItemId,
		"results": [],
		"visualizer": "Datatables",
		"tabId": tab.id
	};

	browser.tabs.sendMessage(tab.id, {
		call: "retrieveExtenralResults", 
		args: {
			"url": apiSpecs[info.menuItemId].url, 
			"resultSpec": apiSpecs[info.menuItemId].results, 
			"callbackMethod": "presentResults"
		}
	});

}
SearchTool.prototype.presentResults = function(results) {

	//console.log(results);
	this.presentationParams.results = results;

	browser.tabs.sendMessage(this.presentationParams.tabId, {
		call: "showResults", 
		args: this.presentationParams
	});
};
