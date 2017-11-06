serviceCreator.service("ServiceService", ["$q", "$timeout", function($q, $timeout) {

  var buildingService, $service=this;
  
  this.initialize = function(action){
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
        selector:"",
        preview: ""
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

  this.initialize();
}]);