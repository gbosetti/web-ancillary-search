function SearchTool(){
  this.createContextMenus();
}
SearchTool.prototype.createContextMenus = function() {

  //por ahora una sola entarda
  this.createApisMenu();
  this.populateApisMenu();
}
SearchTool.prototype.createApisMenu = function(){

  //The menu is created
  browser.contextMenus.create({
      id: "search-with-search-api",
      title: "Search at", //TODO: create a message with params like in the old tool (see video) browser.i18n.getMessage("search at"),
      contexts: ["all"]
  });
}
SearchTool.prototype.populateApisMenu = function(){

  var apis = this.getApiSpecifications();

  browser.contextMenus.create({
        id: "search-menu-item-001",
        parentId: "search-with-search-api", 
        title: "Youtube",
        contexts: ["all"],
        onclick: function(){
          console.log("CLICK");
        }
    });

  /*for (var i = apis.length - 1; i >= 0; i--) {
    
  }*/
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