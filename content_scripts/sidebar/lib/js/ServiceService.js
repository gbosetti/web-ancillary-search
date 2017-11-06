serviceCreator.service("ServiceService", ["$q", "$timeout", function($q, $timeout) {
  
  var service = {
    name: "demo name",
    input: {
      selector:"",
      preview: ""
    }
  };
  
  this.asDeferred = function(action){
    var deferred = $q.defer();
    $timeout(function() {

      if(action) action(service);
      deferred.resolve(service);

    }, 500);
    return deferred.promise;
  };
  this.getService = function() {

    return this.asDeferred();
  };
  this.setName = function(name) {

    return this.asDeferred(function(){
      service.name = name;  
    });
  };
  this.setInput = function(input) {

    return this.asDeferred(function(){
      service.input = input;  
    });
  };
}]);