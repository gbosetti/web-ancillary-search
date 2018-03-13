//GLOBALS for making it compatible btw firefox and chrome
//We can decorate it but...
if(window.chrome){ 

  browser = window.chrome;

  browser.contextMenus.oldremoveAll = browser.contextMenus.removeAll;
  browser.contextMenus.removeAll = function(){

    const prom = new Promise((resolve, reject) => {
      
      browser.contextMenus.oldremoveAll(function(val){
        resolve(val); 
      });
    });

    return prom; 
  };
  browser.storage.local.oldget = browser.storage.local.get;
  browser.storage.local.get = function(key){

    const prom = new Promise((resolve, reject) => {
      
      browser.storage.local.oldget(key, function(val){
        resolve(val); 
      });
    });

    return prom; 
  };
  browser.runtime.oldsendMessage = browser.runtime.sendMessage;
  browser.runtime.sendMessage = function(data){

    const prom = new Promise((resolve, reject) => {
      
      browser.runtime.oldsendMessage(data, function(val){
        resolve(val); 
      });
    });

    return prom; 
  };
  browser.tabs.oldquery = browser.tabs.query;
  browser.tabs.query = function(data){

    const prom = new Promise((resolve, reject) => {
      
      browser.tabs.oldquery({active: true, currentWindow: true}, function(tabs){
        resolve(tabs);
      });
    });

    return prom; 
  }; 
  browser.tabs.oldexecuteScript = browser.tabs.executeScript;
  browser.tabs.executeScript = function(tabId, details){

    const prom = new Promise((resolve, reject) => {
      
      browser.tabs.oldexecuteScript(tabId, details, function(){
        resolve();
      });
    });

    return prom; 
  }; 
  browser.tabs.oldinsertCSS = browser.tabs.insertCSS;
  browser.tabs.insertCSS = function(tabId, details){

    const prom = new Promise((resolve, reject) => {
      
      browser.tabs.oldinsertCSS(tabId, details, function(){
        resolve();
      });
    });

    return prom; 
  }; 
}