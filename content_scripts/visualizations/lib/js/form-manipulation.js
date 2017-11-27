console.log("IFRAME: ", window.location.href);

function ExternalContentManipulator(){}
ExternalContentManipulator.prototype.notifyFrameLoaded = function() {
	// body...
};
ExternalContentManipulator.prototype.extractFromUrl = function(url) {
	// body...

};

//window.postMessage('Hello from the main page!', '*', []);
//top.window.postMessage('2nd Hello from the main page!', '*', []);

window.top.browserUI.externalResourcesIframeIsLoaded();

//window.top.browser.runtime.sendMessage({ call: "externalResourcesIframeIsLoaded" });
/*

window.top.browser.tabs.query({active: true, currentWindow: true}).then((tabs) => {
	console.log("current tab ");
	//window.top.browser.tabs.sendMessage(tabs[0].id, {call: "externalResourcesIframeIsLoaded"});
});
*/