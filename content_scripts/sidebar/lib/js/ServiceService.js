serviceCreator.service("ServiceService", ["$q", "$timeout", function($q, $timeout) {

  var services=[{ name:"google" }],
      buildingService, 
      $service=this;
  
  this.initialize = function(){
    browser.storage.local.get("buildingService").then((storage) => {
        if(storage.buildingService){
          buildingService = storage.buildingService;
        }
        else {
          buildingService = $service.getBlankService();
        }
    });
  };
  this.getBlankService = function(){
    return {
      name: "demo",
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

      if(action) 
        action(buildingService);
      
      deferred.resolve(buildingService);
      browser.storage.local.set({"buildingService": buildingService});

    }, 500);
    return deferred.promise;
  };
  this.logService = function() {
    this.asDeferred(function(){
      console.log(buildingService);  
    });
  };
  this.getService = function() {

    return this.asDeferred();
  };
  this.uniqueNameService = function(name) {

    var deferred = $q.defer();

      var serviceExists = false; 
      for (var i = services.length - 1; i >= 0; i--) {
        if(services[i].name == name){
          serviceExists = true;
          break;
        }
      };

      deferred.resolve(serviceExists);

    return deferred.promise;
  };
  this.setName = function(name) {

    return this.asDeferred(function(){
      buildingService.name = name;  
    });
  };
  this.setInput = function(input) {

    return this.asDeferred(function(){
      buildingService.input = input;  
    });
  };
  this.setTrigger = function(trigger) {

    return this.asDeferred(function(){
      buildingService.trigger = trigger; 
    });
  };
  this.setResultsName = function(name) {

    return this.asDeferred(function(){
      buildingService.results.name = name;  
    });
  };
  this.setResultsSelector = function(selector) {

    return this.asDeferred(function(){
      buildingService.results.selector = selector;  
    });
  };
  this.setResultsPreview = function(preview) {

    return this.asDeferred(function(){
      buildingService.results.preview = preview;  
    });
  };
  this.setMoreResultsStrategy = function(className) {

    return this.asDeferred(function(){
      buildingService.moreResults.className = className;  
    });
  };

  this.initialize();
}]);