//GLOBALS for making it compatible btw firefoc and chrome
var browser = browser || chrome;

function BrowserUiManager(){
  /* PROPERTIES

    this.browserActionsClicks;
    this.templatesCreator;
    this.searchTool;
  */

  this.initialize();
}
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
  
  if(this.getBrowserActionClicksInTab(tab.id) == 1) {
    //loading files just once on each tab
    this.templatesCreator.loadDomHighlightingExtras(tab); // This can be done every time a tab is opened and you avoid using this if
  }
  else this.templatesCreator.enableHarvesting(tab);
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
  console.log(apis);

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



function TemplatesCreator(){}
TemplatesCreator.prototype.createTemplatesEditorMenu = function(){

  //The menu is created
  var mainMenuId = "templates-editor";
  browser.contextMenus.create({
      id: mainMenuId,
      title: browser.i18n.getMessage("defineAs"),
      contexts: ["all"]
  });
  this.populateTemplatesEditorMenu(mainMenuId); //if you pass thee menu is not always well rendered
}
TemplatesCreator.prototype.populateTemplatesEditorMenu = function(mainMenuId) {

  this.createContextMenuForAnnotatingConcept(mainMenuId);
  this.createContextMenuForAnnotatingProperties(mainMenuId);
}
TemplatesCreator.prototype.disableHarvesting = function(tab) {

  this.removeContextMenus();
  this.disableDomHighlighting(tab);
}
TemplatesCreator.prototype.disableDomHighlighting = function(tab) {

  browser.tabs.sendMessage(tab.id, {call: "disableHighlight"});
}
TemplatesCreator.prototype.enableHarvesting = function(tab) {

  this.createTemplatesEditorMenu();
  this.enableDomHighlighting(tab);
}
TemplatesCreator.prototype.loadDomHighlightingExtras = function(tab) {

  var me = this;
  browser.tabs.insertCSS(tab.id, { file: "/content_scripts/highlighting-dom-elements.css"});
  browser.tabs.executeScript(tab.id, { file: "/content_scripts/DomUiManager.js"}).then(function () {
      browser.tabs.executeScript(tab.id, { file: "/content_scripts/enable_harvesting.js"}).then(function () {
        me.enableHarvesting(tab);
      });
  });
  
}
TemplatesCreator.prototype.enableDomHighlighting = function(tab) {

  browser.tabs.sendMessage(tab.id, {call: "enableHighlight"});
}
TemplatesCreator.prototype.removeContextMenus = function(){

  browser.contextMenus.remove("define-template");
  browser.contextMenus.remove("define-template-property");
}
TemplatesCreator.prototype.createContextMenuForAnnotatingConcept = function(mainMenuId){

  //The menu is created
  browser.contextMenus.create({
      id: "define-template",
      parentId: mainMenuId,
      title: browser.i18n.getMessage("annotateAsConcept"),
      contexts: ["all"],
      onclick: function(info,tab){ 
        console.log(info, tab);
        browser.sidebarAction.setPanel({
          panel: browser.extension.getURL("/sidebar/concept-definition.html")
        }); 
      },
      command: "_execute_sidebar_action" //This is not something you can change
  });
}
TemplatesCreator.prototype.createSidebar = function(){

  browser.windows.getCurrent({populate: true}).then((windowInfo) => {
    myWindowId = windowInfo.id;
  });
}
TemplatesCreator.prototype.createContextMenuForAnnotatingProperties = function(mainMenuId){

  browser.contextMenus.create({
      id: "define-template-property",
      parentId: mainMenuId,
      title: browser.i18n.getMessage("annotateAsProperty"),
      contexts: ["all"],
      onclick: function(info,tab){ //en compatibilidad con chrome
        console.log(info);
      }
  });
  
  /* alternative way,, not sure if compatible with other browsers. But it is possible to retrieve a selection through the "info" object
  browser.contextMenus.onClicked.addListener(function(info, tab) {
    document.body.style.background = "green";
    if (info.menuItemId == "define-template-property") { //Unfortunately, this is the only way right now
      console.log(info.selectionText);
    }
  });*/
}




var browserUI = new BrowserUiManager();

browser.browserAction.onClicked.addListener(function updateIcon() {

  browserUI.updateBrowserActionIconByClicks();
});