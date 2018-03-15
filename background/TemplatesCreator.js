function TemplatesCreator(){
  this.targetElement = undefined;
  this.sidebarManager = new SidebarManager(
    "/content_scripts/sidebar/index.html", 
    [],
    [this] /* listeners that should implement onSidebarStatusChange */
  ); 
  //this.storage = new StorageFilesManager();
  this.backPageSelector = new BackgroundPageSelector();
  
}
TemplatesCreator.prototype.onSidebarStatusChange = function( tab) {

  this.backPageSelector.toggleDomElementsBehaviour(tab);
}
TemplatesCreator.prototype.toggleSidebar = function() {

	this.sidebarManager.toggleSidebar();
}
TemplatesCreator.prototype.closeSidebar = function() {

  this.sidebarManager.close();
}
TemplatesCreator.prototype.removeFullSelectionStyle = function(tab) {

  this.backPageSelector.removeFullSelectionStyle(tab);
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
TemplatesCreator.prototype.onFrameReadyForLoadingUrl = function() { 

  this.sidebarManager.onFrameReadyForLoadingUrl();
}
TemplatesCreator.prototype.onSidebarClosed = function(tab) { 

  this.sidebarManager.onSidebarClosed();
  //this.backPageSelector.removeFullSelectionStyle(tab);
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
TemplatesCreator.prototype.extractInput = function(inputSel, doc){

  console.log(doc)
  var input = doc.evaluate( inputSel, doc, null, 9, null).singleNodeValue;
  console.log(input);
};
TemplatesCreator.prototype.disableDomSelection = function(tab) {

  browser.tabs.sendMessage(tab.id, {call: "disableHighlight"});
  browser.tabs.sendMessage(tab.id, {call: "disableContextElementSelection"});
}
TemplatesCreator.prototype.enableElementSelection = function(tab, data) {

	this.backPageSelector.enableElementSelection(tab, data);
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