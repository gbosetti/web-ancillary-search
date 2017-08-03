function TemplatesCreator(){
  this.targetElement = undefined;
}
TemplatesCreator.prototype.setContextualizedElement = function(extractedData) {

    this.targetElement = extractedData; 
};
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

  this.createContextMenuForDefiningInput(mainMenuId);
  this.createContextMenuForDefiningTrigger(mainMenuId);
  this.createContextMenuForDefiningResult(mainMenuId);
  this.createContextMenuForAnnotatingProperties(mainMenuId);
}
TemplatesCreator.prototype.disableHarvesting = function(tab) {

  this.removeContextMenus();
  this.disableDomSelection(tab);
}
TemplatesCreator.prototype.disableDomSelection = function(tab) {

  browser.tabs.sendMessage(tab.id, {call: "disableHighlight"});
  browser.tabs.sendMessage(tab.id, {call: "disableContextElementSelection"});
}
TemplatesCreator.prototype.enableHarvesting = function(tab) {

  this.createTemplatesEditorMenu();
  this.enableDomSelection(tab);
}
TemplatesCreator.prototype.loadDataForConceptDefinition = function() {

  //console.log("selection", this.targetElement);
  //console.log(this.targetElement.xpaths);

  browser.runtime.sendMessage({
      call: "loadXpaths",
      args: this.targetElement.xpaths
  });

  browser.runtime.sendMessage({
      call: "loadPreview",
      args: this.targetElement.preview
  });
}
TemplatesCreator.prototype.loadDomHighlightingExtras = function(tab) {

  var me = this;
  browser.tabs.insertCSS(tab.id, { file: "/content_scripts/highlighting-dom-elements.css"});
  browser.tabs.executeScript(tab.id, { file: "/content_scripts/XPathInterpreter.js"}).then(function () {

      browser.tabs.executeScript(tab.id, { file: "/content_scripts/enable_harvesting.js"}).then(function () {
        me.enableHarvesting(tab);
      });
  });
}
TemplatesCreator.prototype.enableDomSelection = function(tab) {

  browser.tabs.sendMessage(tab.id, {call: "enableHighlight"});
  browser.tabs.sendMessage(tab.id, {call: "enableContextElementSelection"});
}
TemplatesCreator.prototype.removeContextMenus = function(){

  browser.contextMenus.remove("define-template");
  browser.contextMenus.remove("define-template-property");
  browser.contextMenus.remove("define-input");
  browser.contextMenus.remove("define-trigger");
  //browser.contextMenus.remove("define-template-property");
}
TemplatesCreator.prototype.createContextMenuForDefiningResult = function(mainMenuId){

  browser.contextMenus.create({
      id: "define-template",
      parentId: mainMenuId,
      title: browser.i18n.getMessage("annotateAsConcept"),
      contexts: ["all"],
      onclick: function(info,tab){ 

        browser.sidebarAction.setPanel({ 
          panel: browser.extension.getURL("/sidebar/concept-definition.html")   
        }); //Do not use a "then". After the panel is opened, the browser.runtime is notified (main.js) 
      },
      command: "_execute_sidebar_action" //This is not something you can change
  });
}
TemplatesCreator.prototype.createContextMenuForDefiningInput = function(mainMenuId){

  browser.contextMenus.create({
      id: "define-input",
      parentId: mainMenuId,
      title: browser.i18n.getMessage("searchInput"),
      contexts: ["all"],
      onclick: function(info,tab){ 

        browser.sidebarAction.setPanel({ 
          panel: browser.extension.getURL("/sidebar/input-definition.html")   
        }); //Do not use a "then". After the panel is opened, the browser.runtime is notified (main.js) 
      },
      command: "_execute_sidebar_action" //This is not something you can change
  });
}
TemplatesCreator.prototype.createContextMenuForDefiningTrigger = function(mainMenuId){

  browser.contextMenus.create({
      id: "define-trigger",
      parentId: mainMenuId,
      title: browser.i18n.getMessage("searchTrigger"),
      contexts: ["all"],
      onclick: function(info,tab){ 

        browser.sidebarAction.setPanel({ 
          panel: browser.extension.getURL("/sidebar/trigger-definition.html")   
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

          browser.sidebarAction.setPanel({ 
            panel: browser.extension.getURL("/sidebar/property-definition.html")   
          });
      },
      command: "_execute_sidebar_action" //This is not something you can change
  });
}
