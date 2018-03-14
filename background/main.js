var browserUI = new BrowserUiManager();

browser.browserAction.onClicked.addListener(function updateIcon() {
  browserUI.toggleSidebar();
});

//From: sidebar to: addon, indicating it was sucessfully loaded 
browser.runtime.onMessage.addListener(function(message, sender, sendResponse){

    console.log("message: ", message, " (at main.js)");
    if(browserUI[message.call]) {
    	browserUI[message.call](message.args, sendResponse); // e.g. message.call = "notifyContextualElementChange"
    	return true;
    }
});
