







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
