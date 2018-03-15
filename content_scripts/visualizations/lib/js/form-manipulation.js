function ExternalContentManipulator(){

	this.initialize();
}
ExternalContentManipulator.prototype.initialize = function() {
	this.notifyFrameLoaded();
};
ExternalContentManipulator.prototype.notifyFrameLoaded = function() {
	browser.runtime.sendMessage({ call: "externalResourcesIframeIsLoaded" });
};
ExternalContentManipulator.prototype.extractFromUrl = function(data) {
	// body...

	var xpi = new XPathInterpreter();

	var input = xpi.getSingleElementByXpath(data.service.input.selector, document);
		input.value = data.keywords;

	var trigger = xpi.getSingleElementByXpath(data.service.trigger.strategy.selector, document);
		trigger.click();
};

var extContentMan = new ExternalContentManipulator();
browser.runtime.onMessage.addListener(function callPageSideActions(request, sender) {

	if(extContentMan[request.call]){
		//console.log("calling " + request.call + " (content_scripts/page-actions/PageSelector.js)");
		//Se lo llama con: browser.tabs.sendMessage
		extContentMan[request.call](request.args);
	}
});