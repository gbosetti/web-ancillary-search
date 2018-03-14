//GLOBALS for making it compatible btw firefox and chrome
//We can decorate it but we should adapt it properly and maybe change the name of "browser"
var browser;
var BrowserStandarizer = function () {
    if (BrowserStandarizer._instance) {
        return BrowserStandarizer._instance;
    }
    BrowserStandarizer._instance = this;
    return this;
};
BrowserStandarizer.getInstance = function () {
    return BrowserStandarizer._instance || new BrowserStandarizer();
}
BrowserStandarizer.prototype.standarize = function () {
    
    //TODO: refactor this method
    console.log("********************* standarize");
    if(window.chrome){ 

      browser = window.chrome;

      //FOR THE BACKGROUND LEVEL
      if(browser.contextMenus){ 

        browser.contextMenus.oldremoveAll = browser.contextMenus.removeAll;
        browser.contextMenus.removeAll = function(){

          const prom = new Promise((resolve, reject) => {
            browser.contextMenus.oldremoveAll(function(val){
              resolve(val); 
            });
          });

          return prom; 
        };

        browser.tabs.oldquery = browser.tabs.query;
        browser.tabs.query = function(data){

          const promQuery = new Promise((resolve, reject) => {
            
            browser.tabs.oldquery({active: true, currentWindow: true}, function(tabs){
              resolve(tabs);
            });
          });

          return promQuery; 
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

        browser.runtime.oldsendMessage = browser.runtime.sendMessage;
        browser.runtime.sendMessage = function(data){

          const prom = new Promise((resolve, reject) => {
            
            browser.runtime.oldsendMessage(data, function(){
              resolve(); 
            });
          });

          return prom; 
        };

        browser.tabs.oldsendMessage = browser.tabs.sendMessage;
        browser.tabs.sendMessage = function(tabId, data){

          const prom = new Promise((resolve, reject) => {
            
            browser.tabs.oldsendMessage(tabId, data, function(){
              resolve(); 
            });
          });

          return prom; 
        };
      }
      else{

        //var oldsendMessage = new Function('return ' + browser.runtime.sendMessage.toString())();
        browser.runtime.oldsendMessage = browser.runtime.sendMessage;
        browser.runtime.sendMessage = function(data){

          return new Promise((resolve, reject) => {
            
            browser.runtime.oldsendMessage(data, function(){
              resolve(); 
            });
          });
        };
      }

      //FOR BOTH KIND OF SCRIPTS
      browser.storage.local.oldget = browser.storage.local.get;
      browser.storage.local.get = function(key){

        const prom = new Promise((resolve, reject) => {
          
          browser.storage.local.oldget(key, function(val){
            resolve(val); 
          });
        });

        return prom; 
      };
    }
}

BrowserStandarizer.getInstance().standarize();