serviceCreator.service("ServiceService", ["$q", "$timeout", function($q, $timeout) {

  var buildingService, $service=this;
  
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
      }
    };
  };
  this.asDeferred = function(action){
    var deferred = $q.defer();
    $timeout(function() {

      if(action) action(buildingService);
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

  this.initialize();
}]);