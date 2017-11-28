//TODO: somehow, the file is realoded and that makes it impossible to remove listeners :(
console.log("\n\n\n********* LOADING THE 'PAGE SELECTOR' FILE *********\n\n\n");

var scrappers = { // Because we can not use window instead
	"XpathScrapper": function(){
		this.getElements = function(selector){
			return (new XPathInterpreter()).getElementsByXpath(selector, document);
		};
		this.getElement = function(selector){
			if(selector == undefined)
				return;

			var elems = (new XPathInterpreter()).getElementsByXpath(selector, document);
			return (elems && elems.length > 0)? elems[0] : undefined; //(new XPathInterpreter()).getElementByXPath(selector, document);
		};
	},
	"QuerySelectorScrapper": function(){
		this.getElements = function(selector){
			return document.querySelectorAll(selector);
		};
		this.getElement = function(selector){
			if(selector == undefined)
				return;
			return document.querySelector(selector);
		};
	}
}

function PageSelector(){
	//this.createEventListeners();
	this.selectableElemClass = "andes-selectable";
	this.selectionClass = "andes-selected";
	this.clearBackgroundClass = "andes-clear-background";
	this.obfuscatedClass = "andes-blurred";
	this.loadListeners();
	this.selectedElem;
};
PageSelector.prototype.executeSearchWith = function(data){
  this.autocompleteInput(data.props.inputSelector);
  this.simulateClick(data.props.triggerSelector);

  console.log("DONE 5");
  return Promise.resolve();
};
PageSelector.prototype.autocompleteInput = function(inputSelector){
  var input = (new XPathInterpreter()).getSingleElementByXpath(inputSelector, document);
  input.value = (input.value && input.value.trim().length > 0)? input.value : "demo";
};
PageSelector.prototype.simulateClick = function(triggerSelector){
  	var button = (new XPathInterpreter()).getSingleElementByXpath(triggerSelector, document);
  	button.removeEventListener("click", this.preventActionsListener);

  	button.click();
};
PageSelector.prototype.getSetOfXPathsByOccurrences = function(element, relativeElem){

	var xpi = new XPathInterpreter(),
		labeledXpaths = {}, 
		xpaths = xpi.getMultipleXPaths(element, relativeElem || element.ownerDocument);

    for (var i = xpaths.length - 1; i >= 0; i--) {

        var elemsBySelector = xpi.getElementsByXpath(xpaths[i], element.ownerDocument).length;
        if(elemsBySelector > 0){

            if(labeledXpaths[elemsBySelector])
            	this.addToExistingLabeledXpath(elemsBySelector, xpaths[i], labeledXpaths)
            else this.createNewLabeledXpath(elemsBySelector, xpaths[i], labeledXpaths); 
        }
    }

    return labeledXpaths;
}
PageSelector.prototype.addToExistingLabeledXpath = function(ocurrences, xpath, labeledXpaths){

	var xpaths = labeledXpaths[ocurrences]; 
	//console.log("existing", xpaths, " with ", xpath);
		xpaths.push(xpath);

	labeledXpaths[ocurrences] = xpaths; 
}
PageSelector.prototype.createNewLabeledXpath = function(ocurrences, xpath, labeledXpaths){

	labeledXpaths[ocurrences] = [xpath]; 
}
PageSelector.prototype.loadListeners = function(){
	
	var me = this;
	this.onElementSelectionMessage; 
	this.scoped;

	this.selectionListener = function(evt){

		//Tiene que quitarlos en todas para la correcta generación de los xpaths
		var matchingHighlighted = me.removeClassFromMatchingElements("andes-highlighted-on-hover");
		var matchingSelectable = me.removeClassFromMatchingElements(this.selectableElemClass);
		var matchingSelection = me.removeClassFromMatchingElements(this.selectionClass);

		browser.runtime.sendMessage({ 
			"call": me.onElementSelectionMessage,
			"args": {
				"selectors": me.getSetOfXPathsByOccurrences(me.selectedElem, me.refElem), 
				"previewSource": me.generatePreview(me.selectedElem),
				"scoped": me.scoped,
				"exampleValue": me.selectedElem.textContent
			}
		});

		if(!me.removeStyleOnSelection){ //Después vuelve a ponerlos, if required
			me.addClassToMatchingElements(matchingHighlighted, "andes-highlighted-on-hover");
			me.addClassToMatchingElements(matchingSelectable, this.selectableElemClass);
			me.addClassToMatchingElements(matchingSelection, this.selectionClass);
		}		
	};
	this.mouseEnterSelection = function(evt) {  
		me.removeStyleClass(me.selectedElem, "andes-highlighted-on-hover");
		me.selectedElem = this; 
		me.addStyleClass(me.selectedElem, "andes-highlighted-on-hover");
		evt.preventDefault(); evt.stopImmediatePropagation();
	};
	this.preventActionsListener = function(evt){
		
		evt.preventDefault();

		var target = me.selectedElem; //evt.target;
		if(target) {
			me.executeAugmentedActions({"target": target, "type": evt.type});

			if(me.hasAugmentedAction(target)){ //so it continues until a container with behaviour may be found
				evt.stopImmediatePropagation();
			}
		} 
		else {evt.stopImmediatePropagation();}

		return false; //This is for preventing anchors
	};
};
PageSelector.prototype.getAllVisibleDomElements = function(){
	return document.querySelectorAll("body, input, div, a, img, span, label, ul, li, p, pre, cite, em"); //:not(.first)
};
PageSelector.prototype.getAllVisibleDomElementsButBody = function(){
	return document.querySelectorAll("div, input, a, img, span, label, ul, li, p, pre, cite, em"); //:not(.first)
};
PageSelector.prototype.getCurrentSidebarElements = function(){
	
	return document.querySelector("#andes-sidebar").querySelectorAll("*");
};
PageSelector.prototype.highlightMatchingElements = function(data){

	/*var elems = (new XPathInterpreter()).getElementsByXpath(data.xpath, document);
	for (var i = elems.length - 1; i >= 0; i--) {
		this.addSelectionClass(elems[i]);
	}*/
};
PageSelector.prototype.selectMatchingElements = function(data){

	var refElem = (data.scrapper && data.refElemSelector)? (new scrappers[data.scrapper]()).getElement(data.refElemSelector) : document;

	var elems = (new XPathInterpreter()).getElementsByXpath(data.selector, refElem);
	for (var i = elems.length - 1; i >= 0; i--) {
		this.addSelectionClass(elems[i]);
	};
};
PageSelector.prototype.preventDomElementsBehaviour = function(){

	var me=this;
	this.getAllVisibleDomElementsButBody().forEach(function(elem){
		
		me.getEventsNamesToPrevent().forEach(function(eventToPrevent){
			elem.addEventListener(eventToPrevent, me.preventActionsListener, false);
		});
	});

	//TODO: it is not working with "addEventListener". This is a problem because maybe we can not resore the original behaviour after this
	document.querySelectorAll("form").forEach(function(form){ 
		if(form.addEventListener){
			form.onsubmit = function(evt){ 
        		return false;
    		}; 
    	};
    });
};
PageSelector.prototype.restoreDomElementsBehaviour = function(){

	var me=this, elements = this.getAllVisibleDomElements(); ///////THIS MAY BE A PROBLEM FOR THE SIDEBAR IF THIS METHOD IS CALLED IN THE MIDDLE OF THE PROCESS
	elements.forEach(function(elem){
		
		me.undarkify(elem);
		me.removeSelectableElemStyle(elem);
		me.removeClearBackground(elem);
		me.removeAugmentedActions(elem); 
		me.removeStyleClass(elem, "andes-highlighted-on-hover");
		me.removeHighlightingOnHover(elem);

		me.getEventsNamesToPrevent().forEach(function(eventToPrevent){
			elem.removeEventListener(eventToPrevent, me.preventActionsListener);
		});
	});
};
PageSelector.prototype.removeAugmentedActions = function(elem){
	
	elem.removeAttribute("andes-actions");
};
PageSelector.prototype.getEventsNamesToPrevent = function(){
	
	return ["click", "keydown", "keyup", "keypress", "mouseup", "mousedown"];
};
PageSelector.prototype.getTargetElements = function(selector){
	
	return document.querySelectorAll(selector);
};
PageSelector.prototype.enableElementSelection = function(data){

	this.darkifyAllDomElements();

	this.lastUsedExtractor = new scrappers[data.scrapperClass]();
	var elements = this.lastUsedExtractor.getElements(data.targetElementSelector);

	this.refElem = this.lastUsedExtractor.getElement(data.refElemSelector);
    this.addSelectionListener(
    	elements, 
    	data.onElementSelection, 
    	"click", 
    	data.scoped,
    	data.removeStyleOnSelection
    );
    this.undarkifySidebarElements();
    this.darkify(document.body); 
};
PageSelector.prototype.disableElementSelection = function(data){

	this.undarkifyAllDomElements();
	this.removeElemsHighlightingClass(data.selector);
	this.removeHighlightingOnHoverFrom(data.selector);
    this.removeAugmentedActionsFrom(data.selector, "click"); //TODO: do not just remove. add a default action (prevent)
};
PageSelector.prototype.darkifyAllDomElements = function(){

	var me = this, elems = this.getAllVisibleDomElements(); 
	elems.forEach(function(elem) { 
		me.darkify(elem);
    });
}
PageSelector.prototype.undarkifyAllDomElements = function(){

	var me = this, elems = this.getAllVisibleDomElements(); 
	elems.forEach(function(elem) { 
		me.undarkify(elem);
    });
}
PageSelector.prototype.removeElemsHighlightingClass = function(selector){

	var me = this, elems = this.lastUsedExtractor.getElements(selector); 
	elems.forEach(function(elem) { 
		me.removeSelectableElemStyle(elem);
    });
}
PageSelector.prototype.hasAugmentedAction = function(target){

	return (this.getAugmentedActions(target).length > 0);	
}
PageSelector.prototype.executeAugmentedActions = function(evt){

	var actions = this.getAugmentedActions(evt.target);
	for (var i = actions.length - 1; i >= 0; i--) {
		if(evt.type.toUpperCase() == actions[i].event.toUpperCase())
			this[actions[i].listener](evt);
	}
}
PageSelector.prototype.getAugmentedActions = function(elem){

	if (elem){
		var actions = elem.getAttribute("andes-actions");
		if (actions && actions.length)
			return actions=JSON.parse(actions);
	}
	return [];
}
PageSelector.prototype.isActionIncluded = function(existingAction, actions){

	for (var i = actions.length - 1; i >= 0; i--) {
		if(actions[i].listener == existingAction.listener && actions[i].listener == existingAction.listener){
			return true;
		}
	}
	return false;
}
PageSelector.prototype.addAugmentedAction = function(elem, action){

	var actions = this.getAugmentedActions(elem);
	if(!this.isActionIncluded(action, actions)) {
		actions.push(action);
		elem.setAttribute("andes-actions", JSON.stringify(actions))
	}
}
PageSelector.prototype.addSelectionListener = function(elements, onElementSelection, onEvent, scoped, removeStyleOnSelection){

	var me = this;
		me.onElementSelectionMessage = onElementSelection; //callback
		me.removeStyleOnSelection = removeStyleOnSelection;
		me.scoped = scoped;

	elements.forEach(function(elem) { 
		me.undarkify(elem);	
		me.addHighlightingOnHover(elem);
		me.addSelectableElemStyle(elem);
		me.addAugmentedAction(elem, {"listener": "selectionListener", "event": onEvent});
    });	
}
PageSelector.prototype.removeAugmentedActionsFrom = function(selector, onEvent){

	var me = this;
	(this.lastUsedExtractor.getElements(selector)).forEach(function(elem) { 
		me.removeAugmentedActions(elem);	
    });	
}
PageSelector.prototype.generatePreview = function(element){

	try{
		this.removeSelectableElemStyle(element);
		this.addClearBackground(element);

	    var canvas = document.createElement("canvas");
		    canvas.width = element.offsetWidth;
		    canvas.height = element.offsetHeight;
	    var ctx = canvas.getContext("2d");
	    var box = element.getBoundingClientRect();
	    ctx.drawWindow(document.defaultView, parseInt(box.left)+
	    	document.defaultView.scrollX,parseInt(box.top)+
	    	document.defaultView.scrollY, element.offsetWidth,element.offsetHeight, "rgb(0,0,0)");

	    this.removeClearBackground(element);
	    this.addSelectableElemStyle(element);

	    return canvas.toDataURL();
	}catch(err){
		console.log(err.message);
		return;
	}
}
PageSelector.prototype.addHighlightingOnHover = function(elem){

	elem.addEventListener("mouseenter", this.mouseEnterSelection, false);
}
PageSelector.prototype.removeHighlightingOnHover = function(elem){

	elem.removeEventListener("mouseenter", this.mouseEnterSelection, false);
}
PageSelector.prototype.addSelectableElemStyle = function(elem){

	this.addStyleClass(elem, this.selectableElemClass);  
}
PageSelector.prototype.addSelectionClass = function(elem){

	this.addStyleClass(elem, this.selectionClass);  
}
PageSelector.prototype.removeSelectionClass = function(elem){

	this.removeStyleClass(elem, this.selectionClass);  
}
PageSelector.prototype.removeFullSelectionStyle = function(){

	this.removeClassFromMatchingElements(this.obfuscatedClass);
	this.removeClassFromMatchingElements(this.selectableElemClass);
	this.removeClassFromMatchingElements("andes-highlighted-on-hover");
	this.removeClassFromMatchingElements(this.clearBackgroundClass);
	this.removeClassFromMatchingElements(this.selectionClass);

	return Promise.resolve();
}
PageSelector.prototype.removeHighlightingOnHoverFrom = function(selector){
	
	this.selectedElem = undefined;

	var me = this;
	(this.lastUsedExtractor.getElements(selector)).forEach(function(elem){
		me.removeHighlightingOnHover(elem);
	});
}
PageSelector.prototype.removeEventBlockers = function(){

	console.log("Removing event blockers");
}
PageSelector.prototype.removeClassFromMatchingElements = function(className){

	var hElems = document.querySelectorAll("." + className);
	for (var i = 0; i < hElems.length; i++) {
		hElems[i].classList.remove(className);
	}
	return hElems;
}
PageSelector.prototype.addClassToMatchingElements = function(elems, className){

	for (var i = 0; i < elems.length; i++) {
		this.addStyleClass(elems[i], className);
	}
	return elems;
}
PageSelector.prototype.undarkifySidebarElements = function(){

	var me = this;
	this.getCurrentSidebarElements().forEach(function(elem) { 
		me.undarkify(elem);		
    });
    this.undarkify(document.querySelector("#andes-sidebar"));	
}
PageSelector.prototype.isAVisibleElement = function(elem){

	return (elem.style.display != "none" && elem.getBoundingClientRect().width != 0)? true : false;
}
PageSelector.prototype.darkify = function(elem){

	this.addStyleClass(elem, this.obfuscatedClass);
};
PageSelector.prototype.addClearBackground = function(elem){
	
	this.addStyleClass(elem, this.clearBackgroundClass);
};
PageSelector.prototype.addStyleClass = function(elem, className){

	if(!elem.classList.contains(className)){
		elem.classList.add(className);
	}
};
PageSelector.prototype.removeStyleClass = function(elem, className){
	
	if(elem && elem.classList && elem.classList.contains(className)){
		elem.classList.remove(className);
	}
};
PageSelector.prototype.undarkify = function(elem){
	
	this.removeStyleClass(elem, this.obfuscatedClass);
};
PageSelector.prototype.removeSelectableElemStyle = function(elem){
	
	this.removeStyleClass(elem, this.selectableElemClass);	
};
PageSelector.prototype.removeClearBackground = function(elem){
	
	this.removeStyleClass(elem, this.clearBackgroundClass);	
};

var pageManager = new PageSelector();
browser.runtime.onMessage.addListener(function callPageSideActions(request, sender, sendResponse) {

	if(pageManager[request.call]){
		//console.log("calling " + request.call + " (content_scripts/page-actions/PageSelector.js)");
		//Se lo llama con: browser.tabs.sendMessage
		pageManager[request.call](request.args);
	}
});