var browserUI = new BrowserUiManager();

browser.browserAction.onClicked.addListener(function updateIcon() {
  browserUI.toggleSidebar();
});

/*function rewriteHeader(e) {
  
  for (var header of e.responseHeaders) {
  	//console.log(header.name);
    if (header.name == "x-frame-options") {
      	header.value = 'ALLOW FROM *';
      	//break;
    }
    if (header.name == "x-xss-protection"){
    	header.value = '0';
    }
  }
  e.responseHeaders.push({ name: "Access-Control-Allow-Origin", value: "*"});
  e.responseHeaders.push({ name: "Access-Control-Allow-Methods", value: "GET, POST, DELETE, PUT, OPTIONS, HEAD"});

  //console.log("RESPONSE HEADERS", e.responseHeaders);
  return {"responseHeaders": e.responseHeaders};
}

browser.webRequest.onHeadersReceived.addListener(
  rewriteHeader,
  {urls: ['<all_urls>']},
  ["blocking", "responseHeaders"]
);*/

//From: sidebar to: addon, indicating it was sucessfully loaded 
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {

    console.log("message: ", message, " (at main.js)");
    if(browserUI[message.call]) {
    	browserUI[message.call](message.args, sendResponse); // e.g. message.call = "notifyContextualElementChange"
    	return true;
    }
});
