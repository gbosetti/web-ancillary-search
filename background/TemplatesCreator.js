function TemplatesCreator(){
  this.targetElement = undefined;
  this.sidebar = new Sidebar()
}
TemplatesCreator.prototype.toggleSidebar = function() {

position: fixed; top: 20px; right: 35px; bottom: 20px; margin: 0px; padding: 0px; z-index: 99999999; box-shadow: 3px 3px 20px rgba(0, 0, 0, 0.3); background: rgb(246, 246, 246) none repeat scroll 0% 0%;
}
TemplatesCreator.prototype.setContextualizedElement = function(extractedData) {

    this.targetElement = extractedData; 
};
TemplatesCreator.prototype.highlightMatchingElements = function(tab, data) {

  console.log("from templates-creator: ", data);
  browser.tabs.sendMessage(tab.id, {call: "highlightMatchingElements", args: data});
}
TemplatesCreator.prototype.disableHarvesting = function(tab) {

  this.disableDomSelection(tab);
}
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