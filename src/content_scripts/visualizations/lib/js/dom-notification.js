function Searcher() {
  this.searchStrategy = new UrlQueryBasedSearch(new window["StoppedSearch"]());
}

Searcher.prototype.notifyVisitedPageUrl = function() {
  var me = this;
  browser.runtime.sendMessage({
    "call": "newDocumentWasLoaded",
    "args": {
      "url": window.location.href
    }
  }).then(response => {
    console.log("Instantiating search status", response.status);
    me.searchStrategy = new UrlQueryBasedSearch(new window[response.status]()); //TODO: extend UrlQueryBasedSearch
    console.log("data", response.data);
    me.searchStrategy.analyseDom(response.data);
  })
};


//********************STRATEGIES



function SearchStrategy(status) {
  this.status = status;
  this.analyseDom = function(data) {}
}


function NoSearchStrategy(status) {
  SearchStrategy.call(this, status);
}


function UrlQueryBasedSearch(status) {
  SearchStrategy.call(this, status);
  //this.status = status;
  this.analyseDom = function(data) {

    this.status.analyseDom(data);
  };
};


//********************STATUS

function SearchStatus() {

  this.analyseDom = function(data) {}
}

function StoppedSearch() {
  SearchStatus.call(this);
  this.analyseDom = function(data) {}
}
window.StoppedSearch = StoppedSearch;

function ReadyToTrigger() {
  SearchStatus.call(this);

  this.analyseDom = function(data) {
    var { input } = data.service;
    var xpi = new XPathInterpreter();
    var inputElement = xpi.getSingleElementByXpath(input.selector, document);

    if (!input) {
      return;
    }

    console.log("Input is here!");

    const self = this;

    browser.runtime.sendMessage({
      "call": "setSearchListeningStatus",
      "args": {
        "status": "ReadyToExtractResults"
      }
    }).then(response => {
      const { strategy } = data.service.trigger;
      const { className } = strategy;
      const methodName = className.charAt(0).toLowerCase() + className.slice(1);

      inputElement.value = data.keywords;
      console.log(`calling ${methodName} strategy`);
      console.log(self);
      console.log(self[methodName]);
      self[methodName].bind(self)({strategy, inputElement});
    });
  };

  this.clickBasedTrigger = function({strategy}) {
    console.log("clickBasedTrigger");
    const xpi = new XPathInterpreter();
    var triggerElement = xpi.getSingleElementByXpath(strategy.selector, document);
    triggerElement.click();
  };

  this.enterBasedTrigger = function({ inputElement }) {
    var e = jQuery.Event("keypress");
    e.which = 13;
    $(inputElement)
      .keypress(event => {
        event.target.form.submit();
      })
      .trigger(e);
  };
}
window.ReadyToTrigger = ReadyToTrigger;


function ReadyToExtractResults() {
  SearchStatus.call(this);
  this.analyseDom = function(data) {

    var conceptDomElems = this.evaluateSelector(data.service.results.selector.value, document);
    data.service.results = this.extractConcepts(conceptDomElems, data.service.results.properties);

    var me = this;
    browser.runtime.sendMessage({
      "call": "setSearchListeningStatus",
      "args": {
        "status": "StoppedSearch"
      }
    }).then(response => {
      browser.runtime.sendMessage({
        "call": "presentData",
        "args": data.service
      })
    })
  };
  this.evaluateSelector = function(selector, doc) {
    //TODO: acá se debería tener un strategy para laburar con diferentes tipos de selectores
    return (new XPathInterpreter()).getElementsByXpath(selector, doc);
  };
  this.getMultiplePropsFromElements = function(relativeSelector, relativeDomElems) {
    //TODO: acá se debería tener un strategy para laburar con diferentes tipos de selectores
    var props = [],
      indexesOfInfoItems = Object.keys(relativeDomElems);

    if (indexesOfInfoItems.length > 0) {
      indexesOfInfoItems.forEach(function(index) {
        var prop = (new XPathInterpreter()).getSingleElementByXpath(relativeSelector, relativeDomElems[index]);

        if (prop) {
          props.push(prop);
        } else props.push(" ");
      });
    }
    return props;
  };
  this.extractConcepts = function(conceptDomElems, propSpecs) {

    var concepts = [],
      me = this;
    var propSpecKeys = Object.keys(propSpecs);
    var me = this;

    if (propSpecKeys.length > 0) {

      conceptDomElems.forEach(conceptDom => {

        var incompleteConcept = false;
        var concept = {};
        propSpecKeys.forEach(propIndex => {

          var propDom = (new XPathInterpreter()).getSingleElementByXpath(
            propSpecs[propIndex].relativeSelector,
            conceptDom
          );
          if (propDom != null) { //asi solo se agregan los que tienen algo
            concept[propIndex] = propDom.textContent.replace(/\n/g, ' ').trim();
          } else incompleteConcept = true;
        });

        if (Object.keys(concept).length > 0 && !incompleteConcept)
          concepts.push(concept);
      });
    }
    return concepts;
  };
}
window.ReadyToExtractResults = ReadyToExtractResults;

var searher = new Searcher();
searher.notifyVisitedPageUrl();

browser.runtime.onMessage.addListener(function callAndesAutomaticSearchers(request, sender) {

  if (searher[request.call]) {
    searher[request.call](request.args);
  }
});
