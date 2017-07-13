function BrowserUiManager(){
  this.browserActionsClicks = {};
  this.templatesCreator = new TemplatesCreator();
}
BrowserUiManager.prototype.getBrowserActionClicksInTab = function(tabId) {
  return this.browserActionsClicks[tabId]? this.browserActionsClicks[tabId] : 0;
};
BrowserUiManager.prototype.increaseBrowserActionClicksInTab = function(tabId) {
  this.browserActionsClicks[tabId] = this.getBrowserActionClicksInTab() + 1;
};
BrowserUiManager.prototype.disableBrowserAction = function(tab) {
  this.changeBrowserActionIcon({
      16: "icons/logo-disabled-16.png",
      64: "icons/logo-disabled-64.png"
    },
    tab.id, "✗", "gray");
  this.disableHarvesting(tab);
};
BrowserUiManager.prototype.disableHarvesting = function(tab) {
  //this.templatesCreator.disableHarvesting(tab);
};
BrowserUiManager.prototype.enableBrowserAction = function(tab) {
  this.changeBrowserActionIcon({
      16: "icons/logo-disabled-16.png",
      64: "icons/logo-disabled-64.png"
    },
    tab.id, "✓", "#60DA11");
  this.enableHarvesting(tab);
};
BrowserUiManager.prototype.enableHarvesting = function(tab) {
  this.templatesCreator.enableHarvesting(tab);
};
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

    console.log("currentTab", currentTab);

    if(me.getBrowserActionClicksInTab(currentTab.id) % 2 == 0)
      me.enableBrowserAction(currentTab);
    else me.disableBrowserAction(currentTab);
  });
};
BrowserUiManager.prototype.executeOnCurrentTab = function(callback) {

  try{
      var activeTabPromise = browser.tabs.query({active: true, currentWindow: true}); //browser.tabs.getCurrent();
      activeTabPromise.then((tabs) => {

          callback(tabs[0]);
      });
  }catch(err){
    console.log(err);
  }
}






function TemplatesCreator(){}
TemplatesCreator.prototype.loadRequiredScripts = function(activeTab) {

  this.loadPageSideActions(activeTab);
};
TemplatesCreator.prototype.loadPageSideActions = function(activeTab) {

  browser.tabs.executeScript(activeTab.id, { file: "/content_scripts/DomUiManager.js"});
  browser.tabs.executeScript(activeTab.id, { file: "/content_scripts/enable_harvesting.js"});
  browser.tabs.sendMessage(activeTab.id, {greeting: "Something to avoid errors..."}); 
};
TemplatesCreator.prototype.enableHarvesting = function(tab) {

  this.createContextMenus();
  this.enableDomHighlighting(tab);
  this.loadRequiredScripts(tab);
}
TemplatesCreator.prototype.enableDomHighlighting = function(tab) {

  browser.tabs.insertCSS(tab.id, { file: "/content_scripts/highlighting-dom-elements.css"});


}
TemplatesCreator.prototype.createContextMenus = function(){

  this.createContextMenuForAnnotatingConcept();
  this.createContextMenuForAnnotatingProperties();
}
TemplatesCreator.prototype.createContextMenuForAnnotatingConcept = function(){

  //The menu is created
  browser.contextMenus.create({
      id: "define-template",
      title: browser.i18n.getMessage("annotateAsConcept"),
      contexts: ["all"],
      command: "_execute_sidebar_action"
  });

  browser.contextMenus.onClicked.addListener(function(info, tab) {
    document.body.style.background = "yellow";
    if (info.menuItemId == "define-template") { //Unfortunately, this is the only way right now
      console.log(info.selectionText);
    }
  });
}
TemplatesCreator.prototype.createSidebar = function(){

  browser.windows.getCurrent({populate: true}).then((windowInfo) => {
    myWindowId = windowInfo.id;
  });
}
TemplatesCreator.prototype.createContextMenuForAnnotatingProperties = function(){

  browser.contextMenus.create({
      id: "define-template-property2",
      title: browser.i18n.getMessage("annotateAsProperty"),
      contexts: ["all"],
      command: "_execute_sidebar_action"
  });

  
  browser.contextMenus.onClicked.addListener(function(info, tab) {
    document.body.style.background = "green";
    if (info.menuItemId == "define-template-property2") { //Unfortunately, this is the only way right now
      console.log(info.selectionText);
    }
  });
}
TemplatesCreator.prototype.highlightInDom = function(xpath) {

  var elems = document.getElementsByClassName('woa-highlighted-element');
  for (i in elems) elems[i].classList.remove('woa-highlighted-element');

  elems = new XPathInterpreter().getElementsByXpath(xpath, document);
  if(elems) for (i in elems) elems[i].classList.add('woa-highlighted-element');
}




var browserUI = new BrowserUiManager();

browser.browserAction.onClicked.addListener(function updateIcon() {

  browserUI.updateBrowserActionIconByClicks();
});