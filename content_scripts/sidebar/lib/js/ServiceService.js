//TODO: implement a state for being sure getMatchingServices is retrieving something when everything is fully loaded

serviceCreator.service("ServiceService", ["$q", "$timeout", function($q, $timeout) {

  var services, currentServiceKey;
  
  this.initialize = function(){

    browser.storage.local.get("services").then((storedServices) => {

        if(Object.keys(storedServices).length > 0){
          services = storedServices;
        }
        else {
          services = {}; //check if this is necessary. I thunk this is the def value, but just in case
        }
    });
  };
  this.getUrlDomain = function(url){

    if(url){
      var a = document.createElement('a');
        a.setAttribute('href', url);
      return a.hostname;
    }
    return "*"; 
  }
  this.getMatchingServices = function(url){

    var me=this, deferred = $q.defer();
    $timeout(function() {

      /*var matchingServices = {};
      Object.keys(services).forEach(function(i) {
        if(me.getUrlDomain(url) == me.getUrlDomain(services[i].url))
          matchingServices[services[i].name] = services[i];
      });   
      deferred.resolve(matchingServices);*/
      deferred.resolve(services);

    }, 500);
    return deferred.promise;
  };
  this.newServiceWithName = function(name){
    return {
      name: name,
      url: "*",
      input: {
        selector:undefined,
        preview: undefined
      },
      trigger: {
          strategy: {
            className: 'ClickBasedTrigger'
          }      
      },
      results: {
        name: undefined,
        selector:undefined,
        preview: undefined
      },
      moreResults: {
        className: 'NoMoreResults',
      }
    };
  };
  this.asDeferred = function(action){
    var deferred = $q.defer();
    $timeout(function() {

      if(currentServiceKey == undefined){
        return deferred.promise;
      }

      if(action) 
        action(services[currentServiceKey]);

      //console.log("SERVICE FROM STORAGE",currentServiceKey, services[currentServiceKey]); 
      
      deferred.resolve(services[currentServiceKey]);

      /*var entry = {}; //DON'T DO THIS -> {currentServiceKey: services[currentServiceKey]}
        entry[currentServiceKey] = services[currentServiceKey];
      browser.storage.local.set(entry);*/

    }, 500);
    return deferred.promise;
  };
  this.logService = function() {
    this.asDeferred(function(){
      console.log(services[currentServiceKey]);  
    });
  };
  this.getService = function() { //Should be getCurrentService

    return this.asDeferred();
  };
  this.uniqueNameService = function(name) {

    var deferred = $q.defer();

      var serviceExists = false; 
      Object.keys(services).some(function(key, index) {
        console.log("key");
        if (services[key].name == name) {
          serviceExists = true;
          console.log("breaking");
          return;
        }
      });

      deferred.resolve(serviceExists);

    return deferred.promise;
  };
  this.setName = function(name) {

    var me = this;
    return this.asDeferred(function(){

      if(services[currentServiceKey] == undefined)
        services[currentServiceKey] = me.newServiceWithName(name);

      services[currentServiceKey].name = name;  
    });
  };
  this.setInput = function(input) {

    return this.asDeferred(function(){
      services[currentServiceKey].input = input;  
    });
  };
  this.setUrl = function(url) {

    return this.asDeferred(function(){
      services[currentServiceKey].url = url;  
    });
  };
  this.setTrigger = function(trigger) {

    return this.asDeferred(function(){
      services[currentServiceKey].trigger = trigger; 
    });
  };
  this.setCurrentServiceKey = function(key) {

    currentServiceKey = key;
  };
  this.setResultsName = function(name) {

    return this.asDeferred(function(){
      services[currentServiceKey].results.name = name;  
    });
  };
  this.setResultsSelector = function(selector) {

    return this.asDeferred(function(){
      services[currentServiceKey].results.selector = selector;  
    });
  };
  this.setResultsPreview = function(preview) {

    return this.asDeferred(function(){
      services[currentServiceKey].results.preview = preview;  
    });
  };
  this.setMoreResultsStrategy = function(className) {

    return this.asDeferred(function(){
      services[currentServiceKey].moreResults.className = className;  
    });
  };

  this.initialize();
}]);