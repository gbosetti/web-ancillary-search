function TemplatesCreator(){
  this.targetElement = undefined;
  this.sidebar = new SidebarManager();
  this.storage = new StorageFilesManager();
}
TemplatesCreator.prototype.toggleSidebar = function() {

  this.sidebar.toggle();
}
TemplatesCreator.prototype.onFrameReadyForLoadingUrl = function() { 

  this.sidebar.onFrameReadyForLoadingUrl();
}
TemplatesCreator.prototype.setContextualizedElement = function(extractedData) {

    this.targetElement = extractedData; 
};
TemplatesCreator.prototype.highlightMatchingElements = function(tab, data) {

  browser.tabs.sendMessage(tab.id, {call: "highlightMatchingElements", args: data});
}
TemplatesCreator.prototype.disableHarvesting = function(tab) {

  this.disableDomSelection(tab);
}
TemplatesCreator.prototype.adaptPlaceholder = function() {

  this.sidebar.adaptPlaceholder();
};
TemplatesCreator.prototype.saveService = function(data) {

  this.storage.getFileAsync(data); //createEmptyFile
};
TemplatesCreator.prototype.loadUrlAtSidebar = function(url, filePaths) {

	this.sidebar.loadChromeUrl(url, filePaths); 
};
TemplatesCreator.prototype.createNewServiceFromData = function(data) {

  this.storage.createFileWithData(data);
};
TemplatesCreator.prototype.disableDomSelection = function(tab) {

  browser.tabs.sendMessage(tab.id, {call: "disableHighlight"});
  browser.tabs.sendMessage(tab.id, {call: "disableContextElementSelection"});
}
TemplatesCreator.prototype.enableHarvesting = function(tab) {

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