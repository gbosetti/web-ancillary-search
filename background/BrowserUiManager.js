function BrowserUiManager(){
  this.initialize();
}
BrowserUiManager.prototype.initialize = function() {

  this.browserActionsClicks = {};
  //this.mainMenu = this.createExtensionMainMenu(); No tiene sentido porque después te lo mueve como quiere
  this.templatesCreator = new TemplatesCreator();
  this.searchTool = new SearchTool();
  this.listenForTabChanges();
};
BrowserUiManager.prototype.listenForTabChanges = function() { 

  var me = this;
  this.listenForExternalRetrieval = false;

  browser.tabs.onUpdated.addListener(function handleUpdated(tabId, changeInfo, tabInfo) {
    
    if(tabInfo.status == "complete"){

      console.log("UPDATING");
      //Listening for simulating the search in a background tab
      if(me.currentQuerySpec && me.currentQuerySpec.tabId && me.listenForExternalRetrieval){
        //console.log("************ UPDATING", tabInfo.url);
        me.currentQuerySpec = undefined;
        me.listenForExternalRetrieval = undefined;
        me.presentResultsFromQueriedUrl(tabInfo.url, tabInfo.id);
      }

      //Updating the status for loading the templatesCreator files
      me.templatesCreator.sidebarManager.initializeStateForTab(tabId);
      me.templatesCreator.backPageSelector.initializeStateForTab(tabId);
      console.log("tabId1", tabId);
      me.tabId = tabId;

      //To know if we need to resume the process
      browser.storage.local.get("nextAuthoringState", function(storage){

        if(storage.nextAuthoringState != undefined && storage.nextAuthoringState != null){

          console.log("tabId2", tabId);
          console.log("tabId3", me.tabId);
          me.goToStep(storage.nextAuthoringState, tabId);
          browser.storage.local.set({"nextAuthoringState": undefined });
          me.toggleSidebar();          
        }
      });
    } 
  });
}
BrowserUiManager.prototype.goToStep = function(data) { 

  this.templatesCreator.goToStep(data);
};
BrowserUiManager.prototype.onElementSelection = function(data) { 

  this.templatesCreator.onElementSelection(data);
};
BrowserUiManager.prototype.onTriggerSelection = function(data) { 

  this.templatesCreator.onTriggerSelection(data);
};
BrowserUiManager.prototype.onResultsContainerSelection = function(data) { 

  this.templatesCreator.onResultsContainerSelection(data);
};
BrowserUiManager.prototype.populateApisMenu = function(data) { 

  this.searchTool.createContextMenus();
};
BrowserUiManager.prototype.selectMatchingElements = function(data) { 

  var me = this;
  this.executeOnCurrentTab(function(tab){
    me.templatesCreator.selectMatchingElements(tab, data);
  });
};
BrowserUiManager.prototype.loadVisalizerDependencies = function(data) { 

  var me = this;
  this.executeOnCurrentTab(function(tab){
    me.searchTool.loadVisalizerDependencies(tab, data.dependencies, data.callbackMessage);
  });
}
BrowserUiManager.prototype.executeSearchWith = function(data, sendResponse){

  var me = this;
  this.executeOnCurrentTab(function(tab){
    me.searchTool.executeSearchWith(data, tab, sendResponse);
  });
};
BrowserUiManager.prototype.removeFullSelectionStyle = function(data, sendResponse) { 

  var me = this;
  this.executeOnCurrentTab(function(tab){
    me.templatesCreator.removeFullSelectionStyle(tab, sendResponse);
  });
}
BrowserUiManager.prototype.onFrameReadyForLoadingUrl = function() { 

  this.templatesCreator.onFrameReadyForLoadingUrl();
}
BrowserUiManager.prototype.onSidebarClosed = function(data, sendResponse) { 

  var me = this;
  this.executeOnCurrentTab(function(tab){
    me.templatesCreator.onSidebarClosed(tab, sendResponse);
  });
}
BrowserUiManager.prototype.toggleSidebar = function() {

  this.templatesCreator.toggleSidebar();
};
BrowserUiManager.prototype.loadInputControlSelection = function(data) {

  this.templatesCreator.loadInputControlSelection(data);
};
BrowserUiManager.prototype.adaptPlaceholder = function(data) {

  var me = this;
  this.executeOnCurrentTab(function(tab){
    me.templatesCreator.adaptPlaceholder(tab, data);
  });
};
BrowserUiManager.prototype.getCurrentUrl = function(data, sendResponse) {

  var me = this;
  this.executeOnCurrentTab(function(tab){
    me.templatesCreator.getCurrentUrl(tab, data, sendResponse);
  });
};
BrowserUiManager.prototype.externalResourcesIframeIsLoaded = function(){
  //TODO: move this behaviour to the searchTool class

  this.listenForExternalRetrieval = true;
  browser.tabs.sendMessage(this.currentQuerySpec.tabId, {
    call: "extractFromUrl",
    args: this.currentQuerySpec
  });
};
BrowserUiManager.prototype.presentResultsFromQueriedUrl = function(data, tabId){
  //TODO: move this behaviour to the searchTool class

  this.sendResponse(data);
  browser.tabs.remove(tabId)
};
BrowserUiManager.prototype.getExternalContent = function(data, sendResponse) {
  //TODO: move this behaviour to the searchTool class

  var me = this;
  this.currentQuerySpec = data;
  this.sendResponse = sendResponse;

  var creating = browser.tabs.create({
    url: data.service.url,
    active: false
  })
  .then(function(tab) {

    me.currentQuerySpec.tabId = tab.id;
    BackgroundResourcesLoader.syncLoadScripts([
      new BackgroundResource("/content_scripts/XPathInterpreter.js"),
      new BackgroundResource("/content_scripts/visualizations/lib/js/form-manipulation.js")
    ], tab, function(){}, "document_start");
  });
};
BrowserUiManager.prototype.getBrowserActionClicksInTab = function(tabId) {
  return this.browserActionsClicks[tabId]? this.browserActionsClicks[tabId] : 0;
};
BrowserUiManager.prototype.increaseBrowserActionClicksInTab = function(tabId) {

  this.browserActionsClicks[tabId] = this.getBrowserActionClicksInTab(tabId) + 1;
};
BrowserUiManager.prototype.presentResults = function(args) {
  return this.searchTool.presentResults(args.results);
};
BrowserUiManager.prototype.loadDocumentIntoResultsFrame = function(data) {

  this.searchTool.loadDocumentIntoResultsFrame(data);
};
BrowserUiManager.prototype.disableBrowserAction = function(tab) {
  this.changeBrowserActionIcon({
      16: "icons/logo-disabled-16.png",
      64: "icons/logo-disabled-64.png"
    },
    tab.id, "✗", "gray");

  this.templatesCreator.disableHarvesting(tab);
};
BrowserUiManager.prototype.enableElementSelection = function(data, sendResponse) {
  
  var me = this;
  this.executeOnCurrentTab(function(tab){
    me.templatesCreator.enableElementSelection(tab, data, sendResponse);
  });
};
BrowserUiManager.prototype.disableElementSelection = function(data) {
  
  var me = this;
  this.executeOnCurrentTab(function(tab){
    me.templatesCreator.disableElementSelection(tab, data.selector);
  });
};
BrowserUiManager.prototype.enableBrowserAction = function(tab) {
  this.changeBrowserActionIcon({
      16: "icons/logo-disabled-16.png",
      64: "icons/logo-disabled-64.png"
    },
    tab.id, "✓", "#60DA11");
};
BrowserUiManager.prototype.openSidebar = function() {


}
BrowserUiManager.prototype.changeBrowserActionIcon = function(icons, tabId, badgeText, badgeColor) {

  browser.browserAction.setIcon({
    path: icons,
    tabId: tabId
  });
  browser.browserAction.setBadgeText({text: badgeText});
  browser.browserAction.setBadgeBackgroundColor({color: badgeColor});

  this.increaseBrowserActionClicksInTab(tabId);
};
BrowserUiManager.prototype.updateBrowserActionIconByClicks = function() {

  var me = this;
  this.executeOnCurrentTab(function(currentTab){

    if(me.getBrowserActionClicksInTab(currentTab.id) % 2 == 0)
      me.enableBrowserAction(currentTab);
    else me.disableBrowserAction(currentTab);
  });
};
BrowserUiManager.prototype.highlightInDom = function(data) {

  var me = this;
  this.executeOnCurrentTab(function(tab){

    me.templatesCreator.highlightMatchingElements(tab, data);
  });
}
BrowserUiManager.prototype.loadDataForConceptDefinition = function() {

  //var me = this;
  //this.executeOnCurrentTab(function(currentTab){

  this.templatesCreator.loadDataForConceptDefinition();
  //});
};
BrowserUiManager.prototype.setContextualizedElement = function(extractedData) {

    this.templatesCreator.setContextualizedElement(extractedData); 
};
BrowserUiManager.prototype.executeOnCurrentTab = function(callback) {

  try{
      browser.tabs.query({active: true, currentWindow: true}).then((tabs) => {

          callback(tabs[0]);
      });
  }catch(err){
    console.log(err);
  }
}