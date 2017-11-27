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
  //this.fakeApiDefinitions(); //to be removed on production
  var me = this;    
  browser.contextMenus.removeAll().then(function(){ 
    me.createApisMenu();
    me.populateApisMenu();    
  }); 
}
/*//This will be generated in the definition of each search service. It may also be retrieved from a server
SearchTool.prototype.fakeApiDefinitions = function(){
  browser.storage.local.set({
    ebay: {
      name:'ebay', 
      url:'https://www.ebay.com/sch/i.html?_odkw=ibei+compras&_osacat=0&_from=R40&_trksid=p2045573.m570.l1313.TR0.TRC0.H0.Xlas+venas+abiertas+de+america+latina.TRS0&_nkw=las+venas+abiertas+de+america+latina&_sacat=0',
      keywords:'',
      loadingResStrategy: "WriteAndClickToReload", 
      contentScriptWhen: "ready",
      entry:'//form//table//input', 
      trigger:'//form//table/tbody/tr/td[3]/input',
      results: {
        name: 'Productos',
       //div[@id="ResultSetItems"]/ul',
      
        xpath:'//div[@id="ResultSetItems"]/ul/li', //li[@class="sresult lvresult clearfix li shic"],//div[@id="ResultSetItems"]/ul/li',
        properties:[
          {
            name:'Name',
            xpath:'//h3/a', 
          //  extractor: "SingleNodeExtractor"// new SingleNodeExtractor()
          },
          {
            name: 'Price',
            xpath: '//ul/li[contains(@class, "prc")]/span',
            //extractor: "SingleNodeExtractor"// new SingleNodeExtractor()
          },
          {
            name:'Image',
            xpath:'//div/div/a/img', 
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
          },{
            title: "Image",
            responsivePriority: 1
          }]
      }
    },
    bibliotecaUNLP: {
      name:'bibliotecaUNLP',
      url:'http://www.biblio.unlp.edu.ar/catalogo/opac/cgi-bin/pgopac.cgi?a=ISRCH&Profile=Default&cArea1=MATSTOCK%3A%3ACodBiblioteca&cTermino1=&cTodas1=N&cOperacion2=AND&cArea2=En+todas&cOperacion2=FIN&cTermino2=eduardo+galeano&bBuscar=Comenzar&cTodas2=S',
      keywords:'',
      loadingResStrategy: "WriteAndClickToReload", 
      contentScriptWhen: "ready",
      entry:'//table[@id="tb-resultados"]/tbody/tr',
      trigger:'',
      results: {
        name: 'Libros',
       //div[@id="ResultSetItems"]/ul',
      
        xpath:'//table[@id="tb-resultados"]/tbody/tr',//tr/td[3]', //li[@class="sresult lvresult clearfix li shic"],//div[@id="ResultSetItems"]/ul/li',
        properties:[
          {
            name:'Name',
            xpath:'//table[@id="tb-resultados"]/tbody/tr/td[3]', 
          //  extractor: "SingleNodeExtractor"// new SingleNodeExtractor()
          },
          {
            name:'Year',
            xpath:'//table[@id="tb-resultados"]/tbody/tr/td[6]', 
          //  extractor: "SingleNodeExtractor"// new SingleNodeExtractor()
          },
          {
            name:'Editorial',
            xpath:'//table[@id="tb-resultados"]/tbody/tr/td[5]', 
          //  extractor: "SingleNodeExtractor"// new SingleNodeExtractor()
          }

        ]
      },
      visualization:{
        colsDef: [{
            title: "Name",
            responsivePriority: 1
          },
          {
            title: "Year",
            responsivePriority: 1
          },
          {
            title: "Editorial",
            responsivePriority: 1
          }


        ]
      }
    }
   
  });
}*/
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

	this.presentationParams = {
		"resultsName": spec.results.name,
		"selectedText": info.selectionText,
		"seearchEngineName": info.menuItemId,
		"results": [],
		"visualizer": "Datatables",
		"tabId": tab.id
	};

  var me = this;
	browser.tabs.sendMessage(tab.id, {
		call: "retrieveExtenralResults", 
		args: {
			"service": spec,
      "keywords": info.selectionText
		}
	}).then(response => {
    console.log("response:", response);
    //me.presentResults(response.results); //TODO: remove this
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
