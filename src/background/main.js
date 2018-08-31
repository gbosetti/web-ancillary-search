var browserUI = new BrowserUiManager();

browser.browserAction.onClicked.addListener(function updateIcon() {
	console.log("cicking!");
  browserUI.toggleSidebar();
});

browser.webRequest.onHeadersReceived.addListener( //allowing multiple origins in iframes to load
    function(info) {
        var headers = info.responseHeaders;
        for (var i=headers.length-1; i>=0; --i) {
            var header = headers[i].name.toLowerCase();
            if (header == 'x-frame-options' || header == 'frame-options') {
                headers.splice(i, 1); // Remove header
            }
        }
        return {responseHeaders: headers};
    },
    {
        urls: [ '*://*/*' ], // Pattern to match all http(s) pages
        types: [ 'sub_frame' ]
    },
    ['blocking', 'responseHeaders']
);

//From: sidebar to: addon, indicating it was sucessfully loaded
browser.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  console.log("message: ", message, " (at main.js)");
  if (browserUI[message.call]) {
    return browserUI[message.call](message.args); //in case you need to return a promise
  }
});
