function SearchTool() {

  //PROPS
  this.selectedText;
  this.loadedScriptsByTabs = {};
  this.searchStrategy = new UrlQueryBasedSearch();
  this.storage = new StorageManager();

  //Init
  this.createContextMenus();
}
SearchTool.prototype.createContextMenus = function() {

  //por ahora una sola entarda
  //this.fakeApiDefinitions(); //to be removed on production
  var me = this;
  browser.contextMenus.removeAll().then(function() {
    me.createApisMenu();
    me.populateApisMenu();
  });
}
SearchTool.prototype.createApisMenu = function() {

  //The menu is created
  browser.contextMenus.create({
    id: "search-with-search-api",
    title: "Search «%s» at", //TODO: create a message with params like in the old tool (see video) browser.i18n.getMessage("search at"),
    contexts: ["selection"]
  });
}
SearchTool.prototype.populateApisMenu = function() { //Add items to the browser's context menu
  var me = this;

  this.storage.get("services").then((storage) => {

    var apiSpecs = storage.services;

    for (spec in apiSpecs) {
      var menu = browser.contextMenus.create({
        id: spec,
        parentId: "search-with-search-api",
        title: apiSpecs[spec].name,
        contexts: ["selection"],
        onclick: function(info, tab) {

          me.storage.get("services").then((updatedStorage) => {
            apiSpecs = updatedStorage.services;
            //Acá adentro solo es loggueable si se anula el cierre de popups
            me.sendExtenralResults(tab, info, apiSpecs[info.menuItemId]);
          });
        }
      });
      menu.apiSpec = apiSpecs[spec];
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
SearchTool.prototype.onVisualizationLoaded = function(tab) {

  var me = this;
  return new Promise((resolve, reject) => {
    resolve(me.currentExecutionData.service);
  });
}
SearchTool.prototype.newDocumentWasLoaded = function(data) {

  var me = this;
  return new Promise((resolve, reject) => {

    console.log("resolving", {
      "status": me.searchStrategy.statusName(), //this.listenForUrls, 
      "data": me.currentExecutionData 
    });
    
    resolve({
      "status": me.searchStrategy.statusName(), //this.listenForUrls,
      "data": me.currentExecutionData
    });
  });
};
SearchTool.prototype.startListeningForUrls = function() {

  var me = this;
  return new Promise((resolve, reject) => {
    me.searchStrategy.status = new ReadyToTrigger();
    resolve();
  });
}
SearchTool.prototype.setSearchListeningStatus = function(status) {

  var me = this;
  return new Promise((resolve, reject) => {
    me.searchStrategy.status = new window[status](); //e.g. ReadyToAnalyse
    resolve();
  });
}

//SearchStrategy ----status---> searchStatus
function SearchStrategy(status) {
  this.status = status;
}

function UrlQueryBasedSearch(status) {
  SearchStrategy.call(this, status || new StoppedSearch());
}
UrlQueryBasedSearch.prototype.statusName = function() {
  return this.status.constructor.name
};






function SearchStatus() {}
SearchStatus.prototype.analyseDom = function(status) {}

function StoppedSearch() {
  SearchStatus.call(this);
}

function ReadyToTrigger() {
  SearchStatus.call(this);
}
ReadyToTrigger.prototype.analyseDom = function(status) {

  var me = this;
  return new Promise((resolve, reject) => {
    me.searchStatus = new window[status]();
    resolve();
  });
}

function ReadyToExtractResults() {
  SearchStatus.call(this);
}
ReadyToExtractResults.prototype.analyseDom = function(status) {

  var me = this;
  return new Promise((resolve, reject) => {
    me.searchStatus = new window[status]();
    resolve();
  });
}
