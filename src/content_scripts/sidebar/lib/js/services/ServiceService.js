//TODO: implement a state for being sure getMatchingServices is retrieving something when everything is fully loaded

function BuildingStrategy() {
  this.uniqueNameService = function(name, client, deferred) {};
}

function NewServiceEdition() {
  BuildingStrategy.call(this);

  this.uniqueNameService = function(name, client, deferred) {
    console.log("uniqueNameService  >  NewServiceEdition");
    deferred.resolve(client.hasServiceNamed(name));
  }
}

function ExistingServiceEdition() {
  BuildingStrategy.call(this);

  this.uniqueNameService = function(name, client, deferred) {
    console.log("uniqueNameService  >  ExistingServiceEdition");
    if (client.services[client.currentServiceKey].name == name) {
      deferred.resolve(false);
    } else {
      deferred.resolve(client.hasServiceNamed(name));
    }
  }
}

serviceCreator.service("ServiceService", [
  "$q",
  "$timeout",
  function($q, $timeout) {
    var $service = this;

    this.services;
    this.currentServiceKey;
    this.buildingStrategy;

    this.initialize = function() {
      browser.runtime.sendMessage({call: "getServices"}).then(storedServices => {
        $service.services = (storedServices.services && Object.keys(storedServices.services).length > 0) ?
          storedServices.services :
          {};
      });
    };

    this.hasServiceNamed = function(name) {
      var serviceExists = false;
      Object.keys($service.services).some(function(key, index) {
        if ($service.services[key].name == name) {
          serviceExists = true;
          return;
        }
      });
      return serviceExists;
    };

    this.getUrlDomain = function(url) {
      if (url) {
        var a = document.createElement('a');
        a.setAttribute('href', url);
        return a.hostname;
      }

      return "*";
    }
    this.getMatchingServices = function(url) {

      var me = this,
        deferred = $q.defer();
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

    this.newServiceWithName = function(name) {
      return {
        name: name,
        startingUrl: undefined,
        url: "*",
        input: {
          selector: undefined,
          preview: undefined
        },
        trigger: {/* TODO: this should be something similar to 'moreResults' */
          strategy: {
            className: 'ClickBasedTrigger'/* and extra properties "by the strategy" */
          }
        },
        results: {
          name: undefined,
          selector: undefined,
          preview: undefined,
          properties: {}/* {name relativeSelector} */
        },
        moreResults: {
          className: 'NoRetrieval',
          /* and extra properties "by the strategy" */
        },
        sorters: 'NoSorters',
        /* TODO: this should be something similar to 'moreResults' */
        filters: 'NoFilter'/* TODO: this should be something similar to 'moreResults' */
      };
    };

    this.asDeferred = function(action) {
      var deferred = $q.defer();
      $timeout(function() {
        if (action == undefined) {
          deferred.resolve();
        } else {
          const returnElem = action();
          deferred.resolve(returnElem);
        }
      }, 500);
      return deferred.promise;
    };

    this.logService = function() {
      this.asDeferred(function() {
        console.log($service.services[$service.currentServiceKey]);
        return;
      });
    };

    this.getService = function() { //Should be getCurrentService
      return this.asDeferred(function() {
        return $service.services[$service.currentServiceKey];
      });
    };

    this.removeService = function(key) {
      return this.asDeferred(function() {
        if ($service.services.hasOwnProperty(key)) {
          delete $service.services[key];
          $service.updateServices();
        }
        return;
      });
    };

    this.uniqueNameService = function(name) {
      const deferred = $q.defer();
      this.buildingStrategy.uniqueNameService(name, $service, deferred);

      return deferred.promise;
    };

    this.setName = function(name) {
      const self = this;

      return this.asDeferred(function() {
        if ($service.services[$service.currentServiceKey] == undefined) {
          $service.services[$service.currentServiceKey] = self.newServiceWithName(name);
        }

        $service.services[$service.currentServiceKey].name = name;
        return;
      });
    };

    this.updateServices = function() {
      browser.runtime.sendMessage({
        call: "setServices",
        args: {
          services: $service.services,
        },
      });
    };

    this.setInput = function(input) {
      return this.asDeferred(function() {
        $service.services[$service.currentServiceKey].input = input;
        $service.updateServices();
        return;
      });
    };

    this.setUrl = function(url) {
      return this.asDeferred(function() {
        $service.services[$service.currentServiceKey].url = url;
        return;
      });
    };

    this.setTrigger = function(trigger) {
      return this.asDeferred(function() {
        $service.services[$service.currentServiceKey].trigger = trigger;
        $service.updateServices();
        return;
      });
    };

    this.setCurrentServiceKey = function(key) {
      return this.asDeferred(function() {
        $service.currentServiceKey = key;
        return;
      });
    };

    this.setResultsName = function(name) {
      return this.asDeferred(function() {
        $service.services[$service.currentServiceKey].results.name = name;
        return;
      });
    };

    this.setResultsSelector = function(selector) {
      return this.asDeferred(function() {
        $service.services[$service.currentServiceKey].results.selector = selector;
        return;
      });
    };

    this.setResultsPreview = function(preview) {
      return this.asDeferred(function() {
        $service.services[$service.currentServiceKey].results.preview = preview;
        return;
      });
    };

    this.setMoreResultsStrategy = function(className) {
      return this.asDeferred(function() {
        $service.services[$service.currentServiceKey].moreResults.className = className;
        return;
      });
    };

    this.setMoreResultsExtraProps = function(props) {

      return this.asDeferred(function() {
        $service.services[$service.currentServiceKey].moreResults.props = props;
        return;
      });
    };

    this.updateServiceKey = function(oldKey, newKey) {
      return this.asDeferred(function() {
        $service.services[newKey] = $service.services[oldKey];
        delete $service.services[oldKey];
        $service.currentServiceKey = newKey;
        return;
      });
    };

    this.setBuildingStrategy = function(strategy) { // ExistingServiceEdition || NewServiceEdition
      return this.asDeferred(function() {
        $service.buildingStrategy = new window[strategy]();
        return;
      });
    };

    this.getBuildingStrategy = function(strategy) { // TODO: remove
      return this.asDeferred(function() {
        return $service.buildingStrategy;
      });
    };

    this.setProperties = function(properties) { // ExistingServiceEdition || NewServiceEdition
      //todo: add one by one, do not save an external collection
      return this.asDeferred(function() {
        $service.services[$service.currentServiceKey].properties = properties;
        return;
      });
    };

    this.setSorters = function(sorters) {
      //todo: add one by one, do not save an external collection
      return this.asDeferred(function() {
        $service.services[$service.currentServiceKey].sorters = sorters;
        return;
      });
    };

    this.setFilters = function(filters) {
      //todo: add one by one, do not save an external collection
      return this.asDeferred(function() {
        $service.services[$service.currentServiceKey].filters = filters;
        return;
      });
    };

    this.initialize();
  }
]);
