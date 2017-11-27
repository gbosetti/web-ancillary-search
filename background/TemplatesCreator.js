function TemplatesCreator(){
  this.targetElement = undefined;
  this.sidebarManager = new SidebarManager(
    "/content_scripts/sidebar/index.html", 
    [],
    [this] /* listeners that should implement onSidebarStatusChange */
  ); 
  //this.storage = new StorageFilesManager();
  this.backPageSelector = new BackgroundPageSelector();
  this.listenForTabChanges();
}
TemplatesCreator.prototype.onSidebarStatusChange = function(sidebarStatus, tab) {

  /*if(sidebarStatus.isOpen()){ //sidebarStatus es del SidebarManager
    console.log("preventing since sidebar is open");
    this.backPageSelector.preventDomElementsBehaviour(tab);
  }
  else {
    this.backPageSelector.restoreDomElementsBehaviour(tab);
  }*/
  this.backPageSelector.toggleDomElementsBehaviour(tab);
}
TemplatesCreator.prototype.toggleSidebar = function() {

	this.sidebarManager.toggleSidebar();
}
TemplatesCreator.prototype.removeFullSelectionStyle = function(tab, sendResponse) {

  this.backPageSelector.removeFullSelectionStyle(tab, sendResponse);
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
TemplatesCreator.prototype.onFrameReadyForLoadingUrl = function() { 

  this.sidebarManager.onFrameReadyForLoadingUrl();
}
TemplatesCreator.prototype.onSidebarClosed = function(tab, sendResponse) { 

  this.sidebarManager.onSidebarClosed();
  this.backPageSelector.removeFullSelectionStyle(tab, sendResponse);
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
TemplatesCreator.prototype.getCurrentUrl = function(tab, data, sendResponse) {

  this.sidebarManager.getCurrentUrl(tab, data, sendResponse);
};
TemplatesCreator.prototype.extractInput = function(inputSel, doc){

  console.log(doc)
  var input = doc.evaluate( inputSel, doc, null, 9, null).singleNodeValue;
  console.log(input);
};
TemplatesCreator.prototype.getExternalContent = function(tab, data, sendResponse) {

  /*data.service.url, 
    data.keywords, 
    data.service.input.selector, 
    data.service.trigger.strategy, 
    data.service.results.selector.value,*/

    var iframe = window.document.createElement('iframe');
    iframe.id = "andes-results";
    iframe.style.width = "1px";
    iframe.style.height = "1px";

    var me = this;
    iframe.onload = function(){ 

      me.loadContentScripts(data.service.input.selector, this.contentWindow.document);
    }
    iframe.src = data.service.url;

  window.document.body.appendChild(iframe);

  sendResponse("nothing");
};
TemplatesCreator.prototype.loadContentScripts = function(filePaths, doc) {
  
  new ContentResourcesLoader().syncLoadScripts(filePaths, doc);
};
TemplatesCreator.prototype.syncLoadScripts = function(filePaths, doc, callback) {

  var me=this, path = filePaths.splice(0, 1)[0];
  if(path){

    var script = doc.createElement('script');
    script.onload = function() {

      me.syncLoadScripts(filePaths, doc, callback);
    };
    doc.getElementsByTagName('head')[0].appendChild(script);
    console.log("loading ", path);
    script.src = browser.extension.getURL(path);

  }else{
    if(callback) callback();
  }   
};

/*TemplatesCreator.prototype.saveService = function(data) {

  this.storage.getFileAsync(data); //createEmptyFile
};*/
/*TemplatesCreator.prototype.createNewServiceFromData = function(data) {

  this.storage.createFileWithData(data);
};*/
TemplatesCreator.prototype.disableDomSelection = function(tab) {

  browser.tabs.sendMessage(tab.id, {call: "disableHighlight"});
  browser.tabs.sendMessage(tab.id, {call: "disableContextElementSelection"});
}
TemplatesCreator.prototype.enableElementSelection = function(tab, data, sendResponse) {

	this.backPageSelector.enableElementSelection(tab, data, sendResponse);
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