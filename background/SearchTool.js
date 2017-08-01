function SearchTool(){
  this.createContextMenus();
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
      }},
    google: {"name":"Google", "url":"https://www.google.com.ar/#q=x"}
  });
}
SearchTool.prototype.createApisMenu = function(){

  //The menu is created
  browser.contextMenus.create({
      id: "search-with-search-api",
      title: "Search at", //TODO: create a message with params like in the old tool (see video) browser.i18n.getMessage("search at"),
      contexts: ["all"]
  });
}
SearchTool.prototype.populateApisMenu = function(){ //Add items to the browser's context menu
  
  var getApiSpecifications = browser.storage.local.get(null);

  getApiSpecifications.then((results) => {
    var apiSpecifications= Object.keys(results);
    for (let spec of apiSpecifications) {
       browser.contextMenus.create({
        id: results[spec].name,
        parentId: "search-with-search-api", 
        title: results[spec].name,
        contexts: ["all"]
    });
    }
    }, function onError(error) {
    console.log(`Error: ${error}`);
  });
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