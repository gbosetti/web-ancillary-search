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
BrowserUiManager.prototype.onVisualizationLoaded = function() {

  var me = this;
  return new Promise((resolve, reject) => {
    me.executeOnCurrentTab(function(tab){
      me.searchTool.onVisualizationLoaded(tab).then(data => {
        resolve(data);
      });
    });
  });
};
BrowserUiManager.prototype.listenForTabChanges = function() { 

  var me = this;
  this.listenForExternalRetrieval = false;

  browser.tabs.onUpdated.addListener(function handleUpdated(tabId, changeInfo, tabInfo) {
    
    if(tabInfo.status == "complete"){

      if(me.currentQuerySpec && me.currentQuerySpec.tabId && me.listenForExternalRetrieval){
        //console.log("************ UPDATING", tabInfo.url);
        me.currentQuerySpec = undefined;
        me.listenForExternalRetrieval = undefined;
        me.presentResultsFromQueriedUrl(tabInfo.url, tabInfo.id);
      }
    } 
  });
}
BrowserUiManager.prototype.onElementSelection = function(data) { 

  this.templatesCreator.onElementSelection(data);
};
BrowserUiManager.prototype.onTriggerSelection = function(data) { 

  this.templatesCreator.onTriggerSelection(data);
};
/*BrowserUiManager.prototype.onPropsSelection = function(data) { 

  this.templatesCreator.onPropsSelection(data);
};*/
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
BrowserUiManager.prototype.removeFullSelectionStyle = function(data) { 

  var me = this;
  this.executeOnCurrentTab(function(tab){
    me.templatesCreator.removeFullSelectionStyle(tab);
  });
}
BrowserUiManager.prototype.onFrameReadyForLoadingUrl = function() { 

  this.templatesCreator.onFrameReadyForLoadingUrl();
}
BrowserUiManager.prototype.onSidebarClosed = function(data) { 

  var me = this;
  this.executeOnCurrentTab(function(tab){
    me.templatesCreator.onSidebarClosed(tab);
  });
}
BrowserUiManager.prototype.toggleSidebar = function() {

  this.templatesCreator.toggleSidebar();
};
BrowserUiManager.prototype.closeSidebar = function() {

  this.templatesCreator.closeSidebar();
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
BrowserUiManager.prototype.getCurrentUrl = function(data) {

  //sendResponse({"url": tab.url});
  var me = this;
  return new Promise((resolve, reject) => {
    me.executeOnCurrentTab(function(tab){
      resolve(tab.url); 
    });
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

  browser.tabs.remove(tabId);
  return new Promise((resolve, reject) => {
    me.executeOnCurrentTab(function(tab){
      resolve(data); 
    });
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
BrowserUiManager.prototype.enableElementSelection = function(data) {
  
  var me = this;
  this.executeOnCurrentTab(function(tab){
    me.templatesCreator.enableElementSelection(tab, data);
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