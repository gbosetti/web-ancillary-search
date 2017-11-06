function TemplatesCreator(){
  this.targetElement = undefined;
  this.sidebarManager = new SidebarManager(
    "/content_scripts/sidebar/index.html", 
    [
      /*,
      "/content_scripts/vendor/jquery/dist/jquery.min.js",
      "/content_scripts/vendor/angular/index.js",
      "/content_scripts/vendor/angular-route/index.js",
      "/content_scripts/sidebar/script.js"*/
    ],
    [this]
  ); 
  this.storage = new StorageFilesManager();
  this.backPageSelector = new BackgroundPageSelector();
  this.listenForTabChanges();
}
TemplatesCreator.prototype.onSidebarStatusChange = function(sidebarStatus, tab) {

  if(sidebarStatus.isOpen())
    this.backPageSelector.preventDomElementsBehaviour(tab);
  else this.backPageSelector.restoreDomElementsBehaviour(tab);
}
TemplatesCreator.prototype.toggleSidebar = function() {

	this.sidebarManager.toggleSidebar();
}
TemplatesCreator.prototype.removeFullSelectionStyle = function(tab) {

  this.backPageSelector.removeFullSelectionStyle(tab);
}
TemplatesCreator.prototype.listenForTabChanges = function() { 

  var me = this;
  browser.tabs.onUpdated.addListener(function handleUpdated(tabId, changeInfo, tabInfo) {
    if(tabInfo.status == "complete"){
      me.sidebarManager.initializeStateForTab(tabId);
      me.backPageSelector.initializeStateForTab(tabId);
    } 
  });
}
TemplatesCreator.prototype.onElementSelection = function(data) { 

  this.sidebarManager.onElementSelection(data);
}
TemplatesCreator.prototype.onTriggerSelection = function(data) { 

  this.sidebarManager.onTriggerSelection(data);
};
TemplatesCreator.prototype.onResultsContainerSelection = function(data) { 

  this.sidebarManager.onResultsContainerSelection(data);
};
TemplatesCreator.prototype.enablePageRegularBehaviour = function(tab) { 

  this.backPageSelector.enablePageRegularBehaviour(tab);
}
TemplatesCreator.prototype.onFrameReadyForLoadingUrl = function() { 

  this.sidebarManager.onFrameReadyForLoadingUrl();
}
TemplatesCreator.prototype.onSidebarClosed = function() { 

  this.sidebarManager.onSidebarClosed();
}
TemplatesCreator.prototype.setContextualizedElement = function(extractedData) {

    this.targetElement = extractedData; 
};
TemplatesCreator.prototype.highlightMatchingElements = function(tab, data) {

  browser.tabs.sendMessage(tab.id, {call: "highlightMatchingElements", args: data});
}
TemplatesCreator.prototype.selectMatchingElements = function(tab, data) { 

  browser.tabs.sendMessage(tab.id, {"call": "selectMatchingElements", "args": data });
};
TemplatesCreator.prototype.disableHarvesting = function(tab) {

  this.disableDomSelection(tab);
}
TemplatesCreator.prototype.adaptPlaceholder = function(tab, data) {

  this.sidebarManager.adaptPlaceholder(tab, data);
};
TemplatesCreator.prototype.saveService = function(data) {

  this.storage.getFileAsync(data); //createEmptyFile
};
TemplatesCreator.prototype.loadUrlAtSidebar = function(url, filePaths) {

	this.sidebarManager.loadChromeUrl(url, filePaths); 
};
TemplatesCreator.prototype.createNewServiceFromData = function(data) {

  this.storage.createFileWithData(data);
};
TemplatesCreator.prototype.disableDomSelection = function(tab) {

  browser.tabs.sendMessage(tab.id, {call: "disableHighlight"});
  browser.tabs.sendMessage(tab.id, {call: "disableContextElementSelection"});
}
TemplatesCreator.prototype.enableElementSelection = function(tab, targetElementSelector, onElementSelection, scoped) {

	this.backPageSelector.enableElementSelection(tab, targetElementSelector, onElementSelection, scoped);
}
TemplatesCreator.prototype.disableElementSelection = function(tab, selector) {

  this.backPageSelector.disableElementSelection(tab, selector);
}
TemplatesCreator.prototype.loadDataForConceptDefinition = function() {

  //console.log("selection", this.targetElement);
  //console.log(this.targetElement.selectors);

  browser.runtime.sendMessage({
      call: "loadXpaths",
      args: this.targetElement.selectors
  });

  browser.runtime.sendMessage({
      call: "loadPreview",
      args: this.targetElement.preview
  });
}