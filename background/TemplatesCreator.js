function TemplatesCreator(){
  this.targetElement = undefined;
  this.sidebar = new SidebarManager();
  this.storage = new StorageFilesManager();
  this.pageSelector = new BackgroundPageSelector();
}
TemplatesCreator.prototype.toggleSidebar = function() {

	var me = this;
	this.sidebar.toggle(function(tab){
		//so the user can't change the page while the sidebar is open
		me.pageSelector.preventDomElementsBehaviour(tab);
	});
}
TemplatesCreator.prototype.onElementSelection = function(xpaths, prevSrc) { 

  this.sidebar.onElementSelection(xpaths, prevSrc);
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
TemplatesCreator.prototype.enableElementSelection = function(tab, targetElementSelector, onElementSelection) {

	this.pageSelector.enableElementSelection(tab, targetElementSelector, onElementSelection);
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