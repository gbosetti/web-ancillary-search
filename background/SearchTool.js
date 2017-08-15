function SearchTool(){

	//PROPS
	this.selectedText;

	//Init
  	this.createContextMenus();
}
SearchTool.prototype.loadVisalizers = function(tab, callback) {

  	this.syncLoadScripts([
  		"/content_scripts/vendor/jquery/dist/jquery.min.js",
  		"/content_scripts/vendor/jquery-ui/jquery-ui.min.js",
  		"/content_scripts/visualizations.js"
  	], tab, callback);
}
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
/*
me.loadCssLIntoFrame(iframe, SDK.data.url("./src/css/visualization.css")); 
			me.loadCssLIntoFrame(iframe, SDK.data.url("./lib/css/jquery.dataTables.min.css")); 
			me.loadCssLIntoFrame(iframe, SDK.data.url("./lib/css/responsive.dataTables.min.css"));
			me.loadCssLIntoFrame(iframe, SDK.data.url("./lib/css/bootstrap.min.css"));
*/
SearchTool.prototype.loadDocumentIntoResultsFrame = function(args){

	/*console.log("*********************");
	console.log(browser.windows);
	console.log(window.Windows);*/

	

	

	/*var querying = browser.tabs.query({currentWindow: true});
	querying.then(
		function logTabs(tabs) {
		  for (let tab of tabs) {
		    // tab.url requires the `tabs` permission
		    console.log(this);
		    console.log(tabs);
		  }
		}, 
		function onError(error) {
	  		console.log(`Error: ${error}`);
		});*/


	var iframe = window.document.createElement("iframe");
		iframe.src = 'www.stackoverflow.com';

	window.document.appendChild(iframe);
	console.log(iframe);

	//iframe.setAttribute("src", "browser.extension.getURL("content_scripts/visualizers/datatables/datatables-visualization.html"));


	/*browser.windows.getCurrent().then(function logTabs(windowInfo) {
		console.log(this);
		console.log(windowInfo);
	});*/

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

					//this = the current window, but you can not manipulate a lot because this is a background script.
					me.loadVisalizers(tab, function(){ //TODO: loadVisalizers should be called on tabs change, and just once

						browser.tabs.sendMessage(tab.id, {
							call: "showResults", 
							args: {
								"resultsName": apiSpecs[info.menuItemId].results.name,
								"selectedText": info.selectionText,
								"seearchEngineName": info.menuItemId,
								"results": [],
								"visualizer": "Datatables"
							}
						});

					}); 
					
					
					/*me.currentApiCog = this.specification;
					//IFRAME
		    		me.loadSpecializedVisualization(iframe);*/
				},
			});
			menu.apiSpec= apiSpecs[spec];

			console.log("apiSpecs[spec]", apiSpecs[spec]);
	  	}
	}, function onError(error) {
		console.log(`Error: ${error}`);
	});
}
SearchTool.prototype.getDataForVisualization = function(iframe, callback){

	//01 Loading the page
	var me = this;
	/*this.pageWorker = SDK.pworker.Page({
		contentScriptFile: SDK.data.url("./src/js/externalPageForSearchEngine.js"),
		contentURL: this.currentApiCog.url,
		contentScriptWhen: this.currentApiCog.contentScriptWhen 
	});

	//LASTTTTT
	me.pageWorker.port.on("notifyDomForResultsExtraction", function(res){
		
		me.logAction("[08][end] Retrieving the DOM with results");
		me.logAction("[09][start] Parsing the DOM");

		me.showLoadingMessage("Extracting results...", iframe);
		var domForResults = SDK.NsIDomParser.parseFromString(res.textContent, "text/html"); //.wrappedJSObject;
		//me.saveIntoFile("dom.html", res.textContent);
		me.logAction("[10][end] Parsing the DOM");
		me.logAction("[11][start] Extracting results");
		var data = {
			results: new IOExtractor(domForResults).extractDataForDatatable(me.currentApiCog.results),
			colsDef: me.currentApiCog.visualization.colsDef
		}
		me.logAction("[12][end] Extracting results");
		me.logAction("[13][start] Visualizing results");
		callback(data);
		me.hideLoadingMessage(iframe);
		me.logAction("[14][end] Visualizing results");
		//me.logAction(me.currentApiCog.loadingResStrategy);
		//console.log(me.currentApiCog.name); 
		//console.log(JSON.stringify(me.logs, null, 2));
		me.saveIntoFile(me.currentApiCog.name + "_log.json", 
			me.currentApiCog.name + "\n\n" + 
			JSON.stringify(me.logs, null, 2));
	});
	me.pageWorker.port.on("resultsAreAvailable", function(data){
		
		me.logAction("[06][end] Detecting UI cmponents & executing the query");
		me.logAction("[07][start] Retrieving the DOM with results");
		//me.logAction("Retrieving the new DOM");
		me.showLoadingMessage("Retrieving the new DOM...", iframe);
		//Se extraen los resultados
		me.pageWorker.port.emit("getDomForResultsExtraction");
	});

	//02 executing search (first time an url is loaded)
	var executingSearch = function(){

		me.pageWorker.port.removeListener("externalPageIsLoaded", executingSearch);

		me.logAction("[04][end] loading the search form");
		me.logAction("[05][start] Detecting UI cmponents & executing the query");

		me.showLoadingMessage("Detecting UI cmponents...", iframe);
		//Se tiene acceso a los controles y se hace la búsqueda

		//Se suscbrine a otro
		//HERE we can have probles if thre is somefunction, it will be prevented. So you need to clone it or remove functions in the json
		me.pageWorker.port.emit("searchNewInstances", me.currentApiCog);

		me.showLoadingMessage("Executing the query...", iframe);
		//Se desvincula el listener
	};

	me.showLoadingMessage("Loading search engine...", iframe);
	this.pageWorker.port.on("externalPageIsLoaded", executingSearch);
	*/
}
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