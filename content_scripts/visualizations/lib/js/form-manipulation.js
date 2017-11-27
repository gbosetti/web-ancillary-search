console.log("IFRAME: ", window.location.href);

function ExternalContentManipulator(){}
ExternalContentManipulator.prototype.notifyFrameLoaded = function() {
	// body...
};
ExternalContentManipulator.prototype.extractFromUrl = function(url) {
	// body...

};


browser.runtime.sendMessage({ call: "externalResourcesIframeIsLoaded" });

/*

var frameManager = new ExternalContentManipulator();
browser.runtime.onMessage.addListener(function callPageSideActions(request, sender, sendResponse) {

	if(pageManager[request.call]){
		//console.log("calling " + request.call + " (content_scripts/page-actions/PageSelector.js)");
		//Se lo llama con: browser.tabs.sendMessage
		pageManager[request.call](request.args);
	}
});*/

