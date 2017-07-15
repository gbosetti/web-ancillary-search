var browserUI = new BrowserUiManager();

browser.browserAction.onClicked.addListener(function updateIcon() {
  browserUI.updateBrowserActionIconByClicks();
});