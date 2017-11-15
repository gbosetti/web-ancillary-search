//TODO: implement a state for being sure getMatchingServices is retrieving something when everything is fully loaded

function BuildingStrategy(){
  this.uniqueNameService = function(name, client, deferred){};
  
}
function NewServiceEdition(){
  BuildingStrategy.call(this);

  this.uniqueNameService = function(name, client, deferred){
      deferred.resolve(client.hasServiceNamed(name));
  }
}
function ExistingServiceEdition(){
  BuildingStrategy.call(this);

  this.uniqueNameService = function(name, client, deferred){

    if(client.services[client.currentServiceKey].name == name)
      deferred.resolve(false);
    else deferred.resolve(client.hasServiceNamed(name));
  }
}


serviceCreator.service("ServiceService", ["$q", "$timeout", function($q, $timeout) {

  this.services;
  this.currentServiceKey;
  this.buildingStrategy;
  var $service = this;
  
  this.initialize = function(){

    browser.storage.local.get("services").then((storedServices) => {

        if(storedServices.services && Object.keys(storedServices.services).length > 0){
          $service.services = storedServices.services;
        }
        else {
          $service.services = {}; //check if this is necessary. I thunk this is the def value, but just in case
        }
    });
  };
  this.hasServiceNamed = function(name){

    var serviceExists = false; 
    Object.keys($service.services).some(function(key, index) {
      if ($service.services[key].name == name) {
        serviceExists = true;
        return;
      }
    });
    return serviceExists;
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
      Object.keys($service.services).forEach(function(i) {
        if(me.getUrlDomain(url) == me.getUrlDomain($service.services[i].url))
          matchingServices[$service.services[i].name] = $service.services[i];
      });   
      deferred.resolve(matchingServices);*/
      deferred.resolve($service.services);

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
            className: 'ClickBasedTrigger' /*and extra properties "by the strategy"*/
          }      
      },
      results: {
        name: undefined,
        selector:undefined,
        preview: undefined,
        properties:{} /*{name relativeSelector}*/
      },
      moreResults: {
        className: 'NoMoreResults', /*and extra properties "by the strategy"*/
      }
    };
  };
  this.asDeferred = function(action){

    var deferred = $q.defer();
    $timeout(function() {

      if(action == undefined) {
        deferred.resolve();
      }
      else{

        var returnElem = action();
        deferred.resolve(returnElem);
      }

    }, 500);
    return deferred.promise;
  };
  this.logService = function() {
    this.asDeferred(function(){
      console.log($service.services[$service.currentServiceKey]);  
      return;
    });
  };
  this.getService = function() { //Should be getCurrentService

    return this.asDeferred(function(){
      return $service.services[$service.currentServiceKey];  
    });
  };
  this.uniqueNameService = function(name) {

    var deferred = $q.defer();

      this.buildingStrategy.uniqueNameService(name, $service, deferred);

    return deferred.promise;
  };
  this.setName = function(name) {

    var me = this;
    return this.asDeferred(function(){

      if($service.services[$service.currentServiceKey] == undefined)
        $service.services[$service.currentServiceKey] = me.newServiceWithName(name);

      $service.services[$service.currentServiceKey].name = name;  

      $service.updateServices();
      return;
    });
  };
  this.updateServices = function(){
    browser.storage.local.set({ "services": $service.services });
  };
  this.setInput = function(input) {

    return this.asDeferred(function(){
      $service.services[$service.currentServiceKey].input = input;  
      $service.updateServices();
      return;
    });
  };
  this.setUrl = function(url) {

    return this.asDeferred(function(){
      $service.services[$service.currentServiceKey].url = url;  
      $service.updateServices();
      return;
    });
  };
  this.setTrigger = function(trigger) {

    return this.asDeferred(function(){
      $service.services[$service.currentServiceKey].trigger = trigger; 
      $service.updateServices();
      return;
    });
  };
  this.setCurrentServiceKey = function(key) {

    return this.asDeferred(function(){
      $service.currentServiceKey = key;
      return;
    });
  };
  this.setResultsName = function(name) {

    return this.asDeferred(function(){
      $service.services[$service.currentServiceKey].results.name = name;  
      return;
    });
  };
  this.setResultsSelector = function(selector) {

    return this.asDeferred(function(){
      $service.services[$service.currentServiceKey].results.selector = selector;  
      $service.updateServices();
      return;
    });
  };
  this.setResultsPreview = function(preview) {

    return this.asDeferred(function(){
      $service.services[$service.currentServiceKey].results.preview = preview;  
      return;
    });
  };
  this.setMoreResultsStrategy = function(className) {

    return this.asDeferred(function(){
      $service.services[$service.currentServiceKey].moreResults.className = className;  
      return;
    });
  };
  this.setBuildingStrategy = function(strategy) { // ExistingServiceEdition || NewServiceEdition

    return this.asDeferred(function(){
      $service.buildingStrategy = new window[strategy](); 
      return; 
    });
  };
  this.getBuildingStrategy = function(strategy) { // TODO: remove

    return this.asDeferred(function(){
      return $service.buildingStrategy;  
    });
  };

  this.initialize();
}]);