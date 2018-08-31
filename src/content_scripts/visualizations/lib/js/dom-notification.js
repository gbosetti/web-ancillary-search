function Searcher() {
  this.searchStrategy = new UrlQueryBasedSearch(new window["StoppedSearch"]());
}

Searcher.prototype.notifyVisitedPageUrl = function() {
  var me = this;

  if(!window.location.href.includes("notifications.google.com")){
    browser.runtime.sendMessage({
      "call": "newDocumentWasLoaded",
      "args": {
        "url": window.location.href
      }
    }).then(response => {
      me.searchStrategy = new UrlQueryBasedSearch(new window[response.status]()); //TODO: extend UrlQueryBasedSearch
      me.searchStrategy.analyseDom(response.data);
    })
  }
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
    if (!input) return;

   var extractionTries=0; //Puede que el input aun no exista
    
    this.waitingForDomToLoad(input.selector, data, extractionTries)
  };

  this.waitingForDomToLoad = function(selector, data, extractionTries){

    var me=this;

    setTimeout(function() {

      extractionTries++;
      var inputElement = (new XPathInterpreter()).getSingleElementByXpath(selector, document);

      console.log("\n\n*********************************************");
      console.log("Loading url ", document.URL, inputElement);

      if(inputElement || extractionTries > 10){

        me.extractAndShow(inputElement, data);
      }
      else {
        me.waitingForDomToLoad(selector, data, extractionTries);
      }
    }, 1500);
  }

  this.extractAndShow = function(inputElement, data){

    var me = this;
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
      /*console.log(`calling ${methodName} strategy`);
      console.log(self);
      console.log(self[methodName]);*/

      //TODO: acá debería haber un strategy, no un binding. Instanciar una clase y llamar al mismo método, mediante polimorfismo
      me[methodName].bind(me)({strategy, inputElement});
    });
  }

  this.clickBasedTrigger = function({strategy}) {
    const xpi = new XPathInterpreter();
    const triggerElement = xpi.getSingleElementByXpath(strategy.selector, document);
    triggerElement.click();
  };

  this.enterBasedTrigger = function({ inputElement }) {
    const e = jQuery.Event("keypress");
    e.which = 13;
    $(inputElement)
      .keypress(event => {
        event.target.form.submit();
      })
      .trigger(e);
  };

  this.typeAndWaitBasedTrigger = function({ inputElement }) {
    /* TODO how to trigger input change?! */
  };

  this.typeAndEnterBasedTrigger = function({ inputElement }) {
    /* TODO how to trigger input change?! */
  };
}
window.ReadyToTrigger = ReadyToTrigger;

function ReadyToExtractResults() {
  SearchStatus.call(this);
  this.analyseDom = function(data) {

    //Puede que el doc no esté completamente cargado aún! 
    //TODO: add listener

    var me=this, conceptDomElems, extractionTries=0;
    var myVar = setInterval(function myTimer() {
      conceptDomElems = me.evaluateSelector(data.service.results.selector.value, document);

      if((conceptDomElems && conceptDomElems.length > 0) || extractionTries > 10){
        clearInterval(myVar);
        me.extractAndShow(conceptDomElems, data);
      }
      extractionTries++;
    }, 1500);

    
  };
  this.extractAndShow = function(conceptDomElems, data) {
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
