function BrowserUiManager(){
  /* PROPERTIES

    this.browserActionsClicks;
    this.templatesCreator;
    this.searchTool;
  */
  this.initialize();
}
BrowserUiManager.prototype.toggleSidebar = function() {

  this.templatesCreator.toggleSidebar();
};
BrowserUiManager.prototype.initialize = function() {

  this.browserActionsClicks = {};
  //this.mainMenu = this.createExtensionMainMenu(); No tiene sentido porque después te lo mueve como quiere
  this.templatesCreator = new TemplatesCreator();
  this.searchTool = new SearchTool();
};
BrowserUiManager.prototype.getBrowserActionClicksInTab = function(tabId) {
  return this.browserActionsClicks[tabId]? this.browserActionsClicks[tabId] : 0;
};
BrowserUiManager.prototype.increaseBrowserActionClicksInTab = function(tabId) {

  this.browserActionsClicks[tabId] = this.getBrowserActionClicksInTab(tabId) + 1;
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
BrowserUiManager.prototype.enableBrowserAction = function(tab) {
  this.changeBrowserActionIcon({
      16: "icons/logo-disabled-16.png",
      64: "icons/logo-disabled-64.png"
    },
    tab.id, "✓", "#60DA11");

  browser.sidebarAction.setPanel({ 
    panel: browser.extension.getURL("/sidebar/manage-services.html")   
  }); 
  
  /*if(this.getBrowserActionClicksInTab(tab.id) == 1) {
    
    this.openSidebar();
    //this.templatesCreator.loadDomHighlightingExtras(tab); // This can be done every time a tab is opened and you avoid using this if
  }*/

  //else this.templatesCreator.enableHarvesting(tab);
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