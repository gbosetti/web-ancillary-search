function SearchTool(){

	//PROPS
	this.selectedText;
	this.loadedScriptsByTabs = {};

	//Init
  	this.createContextMenus();
}
SearchTool.prototype.loadVisalizers = function(tab, callback) {

  	this.syncLoadScripts([
  		"/content_scripts/vendor/jquery/dist/jquery.min.js",
  		"/content_scripts/vendor/jquery-ui/jquery-ui.min.js",
  		"/content_scripts/XPathInterpreter.js",
  		"/content_scripts/visualizations.js"
  	], tab, callback);
}
SearchTool.prototype.areScriptsLoadedInTab = function(tabId) {
  return this.loadedScriptsByTabs[tabId]? this.loadedScriptsByTabs[tabId] : false;
};
SearchTool.prototype.toggleLoadedScriptsInTab = function(tabId) {

  this.loadedScriptsByTabs[tabId] = !this.areScriptsLoadedInTab(tabId);
};
SearchTool.prototype.syncLoadScripts = function(filePaths, tab, callback) {

	var me = this, path = filePaths.splice(0, 1)[0];
	if(path){
		browser.tabs.executeScript({ file: path , allFrames: true }).then(function(){
			me.syncLoadScripts(filePaths, tab, callback);
		});
	}else{
		if(callback) callback();
	}	
}
SearchTool.prototype.createContextMenus = function() {

  //por ahora una sola entarda
  this.fakeApiDefinitions(); //to be removed on production
  this.createApisMenu();
  this.populateApisMenu();
}
//This will be generated in the definition of each search service. It may also be retrieved from a server
SearchTool.prototype.fakeApiDefinitions = function(){
  browser.storage.local.set({
    youtube:  {    name:'Youtube',
      url:'https://www.youtube.com/results?search_query=X',
      keywords:'',
      loadingResStrategy: "WriteAndClickForAjaxCall", 
      contentScriptWhen: "ready",
      entry:'//input[@id="masthead-search-term"]',
      trigger:'//button[@id="search-btn"]',
      results: {
        name: 'Videos',
        xpath:'//div[@id="results"]/ol/li[2]/ol/li',
        properties:[
          {
            name:'Title',
            xpath:'//h3',
            extractor: "SingleNodeExtractor" //new SingleNodeExtractor()
          },
          {
            name:'Authors', 
            xpath:'//div[contains(@class, "yt-lockup-description")]',
            extractor: "SingleNodeExtractor" 
          }
        ]
      },
      visualization:{
        colsDef: [{
            title: "Title",
            responsivePriority: 1
          }, {
            title: "Authors",
            responsivePriority: 2
          }]
      }},
    google: {
    	name:'Google Scholar',
		url:'https://www.youtube.com/results?search_query=X',
		keywords:'',
		loadingResStrategy: "WriteAndClickForAjaxCall", 
		contentScriptWhen: "ready",
		entry:'//input[@id="masthead-search-term"]',
		trigger:'//button[@id="search-btn"]',
		results: {
		name: 'Papers',
		xpath:'//div[@id="results"]/ol/li[2]/ol/li',
		properties:[
		  {
		    name:'Title',
		    xpath:'//h3',
		    extractor: "SingleNodeExtractor" //new SingleNodeExtractor()
		  },
		  {
		    name:'Authors', 
		    xpath:'//div[contains(@class, "yt-lockup-description")]',
		    extractor: "SingleNodeExtractor" 
		  }
		]
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

				    if(me.areScriptsLoadedInTab(tab.id))
						me.retrieveExtenralResults(tab, info, apiSpecs);
				    else me.loadVisalizers(tab, function(){ 
						me.retrieveExtenralResults(tab, info, apiSpecs);
						me.toggleLoadedScriptsInTab(tab.id);
					}); 
				}
			});
			menu.apiSpec= apiSpecs[spec];

			console.log("apiSpecs[spec]", apiSpecs[spec]);
	  	}
	}, function onError(error) {
		console.log(`Error: ${error}`);
	});
}
SearchTool.prototype.retrieveExtenralResults = function(tab, info, apiSpecs) {

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
	
	console.log(results);
	this.presentationParams.results = results;

	browser.tabs.sendMessage(this.presentationParams.tabId, {
		call: "showResults", 
		args: this.presentationParams
	});
};
SearchTool.prototype.getApiSpecifications = function(){

  //this.getServiceSpecsFromFiles();
  //TODO: load fromfiles ^
    var apiDefinitions = [];
    apiDefinitions.push(this.getYoutubeService());
    
  return apiDefinitions;
}
SearchTool.prototype.getYoutubeService = function() {

  return {
    name:'Youtube',
    url:'https://www.youtube.com/results?search_query=X',
    keywords:'',
    loadingResStrategy: "WriteAndClickForAjaxCall", 
    contentScriptWhen: "ready",
    entry:'//input[@id="masthead-search-term"]',
    trigger:'//button[@id="search-btn"]',
    results: {
      name: 'Videos',
      xpath:'//div[@id="results"]/ol/li[2]/ol/li',
      properties:[
        {
          name:'Title',
          xpath:'//h3' //,
          //extractor: new SingleNodeExtractor()
        },
        {
          name:'Authors', 
          xpath:'//div[contains(@class, "yt-lockup-description")]' //,
          //extractor: new SingleNodeExtractor()
        }
      ]
    },
    visualization:{
      colsDef: [{
          title: "Title",
          responsivePriority: 1
        }, {
          title: "Authors",
          responsivePriority: 2
        }]
    }
  };
};