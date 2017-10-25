function TemplatesCreator(){
  this.targetElement = undefined;
  this.sidebarManager = new SidebarManager(
    "/content_scripts/sidebar/service-name.html", 
    [
      "/content_scripts/sidebar/lib/js/ui-commons.js",
      "/content_scripts/sidebar/lib/js/service-name.js"
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

	var me = this;
	this.sidebarManager.toggleSidebar();
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
TemplatesCreator.prototype.onElementSelection = function(selectors, previewSource) { 

  this.sidebarManager.onElementSelection(selectors, previewSource);
}
TemplatesCreator.prototype.onTriggerSelection = function(selectors, previewSource) { 

  this.sidebarManager.onTriggerSelection(selectors, previewSource);
};
TemplatesCreator.prototype.onResultsContainerSelection = function(selectors, previewSource) { 

  this.sidebarManager.onResultsContainerSelection(selectors, previewSource);
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
TemplatesCreator.prototype.adaptPlaceholder = function() {

  this.sidebarManager.adaptPlaceholder();
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
TemplatesCreator.prototype.enableElementSelection = function(tab, targetElementSelector, onElementSelection) {

	this.backPageSelector.enableElementSelection(tab, targetElementSelector, onElementSelection);
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