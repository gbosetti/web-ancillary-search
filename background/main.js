var browserUI = new BrowserUiManager();

browser.browserAction.onClicked.addListener(function updateIcon() {
  browserUI.updateBrowserActionIconByClicks();
});

//From: sidebar to: addon, indicating it was sucessfully loaded 
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {

    console.log("message ", message, " (main.js)");
    browserUI[message.call](message.args); // e.g. message.call = "notifyContextualElementChange"
});