function Searcher(){
	this.searchStrategy = new UrlQueryBasedSearch(new StoppedSearch());
}
Searcher.prototype.notifyVisitedPageUrl = function() {
	var me = this;
	browser.runtime.sendMessage({ 
		"call": "newDocumentWasLoaded",
		"args": {
			"url": window.location.href
		}
	}).then(response =>{

		console.log("Setting status: " + response.status);
		me.searchStrategy = new UrlQueryBasedSearch(new window[response.status]()); //TODO: extend UrlQueryBasedSearch
		me.searchStrategy.analyseDom(response.data);
	})
};


//********************STRATEGIES



function SearchStrategy(status){
	this.status = status;
	this.analyseDom = function(data) {}
}


function NoSearchStrategy(status){
	SearchStrategy.call(this, status);
}


function UrlQueryBasedSearch(status){
	SearchStrategy.call(this, status);
	//this.status = status;
	this.analyseDom = function(data) {

		this.status.analyseDom(data);
	};
};


//********************STATUS

function SearchStatus(){

	this.analyseDom = function(data){}
}

function StoppedSearch(){
  SearchStatus.call(this);
  this.analyseDom = function(data){}
}

function ReadyToTrigger(){
  SearchStatus.call(this);
  this.analyseDom = function(data){

	  var xpi = new XPathInterpreter();

		var input = xpi.getSingleElementByXpath(data.service.input.selector, document);
			input.value = data.keywords;

		var trigger = xpi.getSingleElementByXpath(data.service.trigger.strategy.selector, document);

		var me = this;
		browser.runtime.sendMessage({ 
			"call": "setSearchListeningStatus",
			"args": {"status": "ReadyToExtractResults"}
		}).then(response =>{
			trigger.click();
		})
	}
}

function ReadyToExtractResults(){
	SearchStatus.call(this);
	this.analyseDom = function(data, caller){

	  	console.log("READY TO EXTRACT!!!!");
	  	var conceptDomElems = this.evaluateSelector(data.service.results.selector.value, document);  
    	console.log(conceptDomElems);

    	data.service.results = this.extractConcepts(conceptDomElems, data.service.results.properties);
    	console.log(data.service.results);

    	var me = this;
		browser.runtime.sendMessage({ 
			"call": "presentData",
			"args": data
		})
	};
	this.evaluateSelector = function(selector, doc){
	  //TODO: acá se debería tener un strategy para laburar con diferentes tipos de selectores
	  return (new XPathInterpreter()).getElementsByXpath(selector, doc);
	};
	this.getMultiplePropsFromElements = function(relativeSelector, relativeDomElems){
	  //TODO: acá se debería tener un strategy para laburar con diferentes tipos de selectores
	  var props = [], indexesOfInfoItems = Object.keys(relativeDomElems);

	  if(indexesOfInfoItems.length > 0){
	    indexesOfInfoItems.forEach(function(index){
	      var prop = (new XPathInterpreter()).getSingleElementByXpath(relativeSelector, relativeDomElems[index]);
	      
	      if(prop) {
	        props.push(prop);
	      } else props.push(" ");
	    });
	  }
	  return props; 
	};
	this.extractConcepts = function(domElements, propSpecs){
	  //TODO: Modularizar codigo
	  var concepts = [], me= this;
	  var keys = Object.keys(propSpecs);
	  var me = this;
	  
	  if(keys.length > 0){
	    keys.forEach(function(key){

	      var propElems = me.getMultiplePropsFromElements(propSpecs[key].relativeSelector, domElements);

	      for (i = 0; i < propElems.length; i++) { 
	        if (propElems[i] != null){ //If the object has the property, then

	          //console.log(propElems[i]);
	          if (concepts[i]){ //si hay concepto, se agrega propiedad
	            if(propElems[i] && propElems[i].textContent){
	              concepts[i][key] = propElems[i].textContent;
	            }else concepts[i][key] = propElems[i].src;
	          } //si no hay concepto, se crea
	          else{
	            concepts[i] = {};
	            if(propElems[i] && propElems[i].textContent){
	              concepts[i][key] = propElems[i].textContent;
	            }else concepts[i][key] = propElems[i].src;
	          }
	        } 

	        if(concepts[i][key] == undefined || concepts[i][key] == null) 
	          concepts[i][key] = " ";
	      }
	    });
	  } else alert("There are no properties defined. Results can not be extracted.");
	  return concepts;
	};
}

var searher = new Searcher();
	searher.notifyVisitedPageUrl();

browser.runtime.onMessage.addListener(function callAndesAutomaticSearchers(request, sender) {

	if(searher[request.call]){
		searher[request.call](request.args);
	}
});