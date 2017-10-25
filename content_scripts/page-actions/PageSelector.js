//TODO: somehow, the file is realoded and that makes it impossible to remove listeners :(
console.log("\n\n\n********* LOADING THE 'PAGE SELECTOR' FILE *********\n\n\n");

function PageSelector(){
	//this.createEventListeners();
	this.selectableElemClass = "andes-selectable";
	this.selectionClass = "andes-selected";
	this.clearBackgroundClass = "andes-clear-background";
	this.obfuscatedClass = "andes-blurred";
	this.loadListeners();
	this.selectedElem;
};
PageSelector.prototype.loadListeners = function(){
	
	var me = this;
	this.onElementSelectionMessage; 
	this.selectionListener = function(evt){

		browser.runtime.sendMessage({ 
			"call": me.onElementSelectionMessage,
			"args": {
				"selectors": (new XPathInterpreter()).getMultipleXPathsWithOccurrences(me.selectedElem), //evt.target),
				"previewSource": me.generatePreview(me.selectedElem) //evt.target)
			}
		});
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
		me.executeAugmentedActions({"target": target, "type": evt.type});

		if(me.hasAugmentedAction(evt.target)){ //so it continues until a container with behaviour may be found
			evt.stopImmediatePropagation();
		}
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

	var elems = (new XPathInterpreter()).getElementsByXpath(data.selector, document);
	for (var i = elems.length - 1; i >= 0; i--) {
		this.addSelectionClass(elems[i]);
		
	}
	var me= this;
	setTimeout(function(){ me.removeFullSelectionStyle(this.selectionClass); }, 2000);
};
PageSelector.prototype.preventDomElementsBehaviour = function(){

	var me=this, elements = this.getAllVisibleDomElementsButBody(); ///////THIS MAY BE A PROBLEM FOR THE SIDEBAR IF THIS METHOD IS CALLED IN THE MIDDLE OF THE PROCESS
	elements.forEach(function(elem){
		
		me.getEventsNamesToPrevent().forEach(function(eventToPrevent){
			elem.addEventListener(eventToPrevent, me.preventActionsListener, false);
		});
	});

	//TODO: it is not working with "addEventListener". This is a problem because maybe we can not resore the original behaviour after this
	document.querySelectorAll("form").forEach(function(form){ 
		if(form.addEventListener){
			form.onsubmit = function(evt){ 
				console.log("preventing from ANDES");
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
    this.addSelectionListener(data.targetElementSelector, data.onElementSelection, "click");
    this.undarkifySidebarElements();
    this.darkify(document.body); 
};
PageSelector.prototype.disableElementSelection = function(data){

	this.undarkifyAllDomElements();
	this.removeElemsHighlightingClass(data.selector);
    this.removeSelectionListener(data.selector, "click");
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

	var me = this, elems = document.querySelectorAll(selector); 
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
PageSelector.prototype.addAugmentedAction = function(elem, action){

	var actions = this.getAugmentedActions(elem);
		actions.push(action);

	elem.setAttribute("andes-actions", JSON.stringify(actions))
}
PageSelector.prototype.addSelectionListener = function(selector, onElementSelection, onEvent){

	var me = this;
	this.getTargetElements(selector).forEach(function(elem) { 
		me.undarkify(elem);	
		me.addHighlightingOnHover(elem);
		me.addSelectableElemStyle(elem);
		me.onElementSelectionMessage = onElementSelection; //callback
		//console.log("ADDING LISTENER", selector, onElementSelection, onEvent);
		me.addAugmentedAction(elem, {"listener": "selectionListener", "event": onEvent});
    });	
}
PageSelector.prototype.removeSelectionListener = function(selector, onEvent){

	var me = this;
	this.getTargetElements(selector).forEach(function(elem) { 
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
}
PageSelector.prototype.removeEventBlockers = function(){

	console.log("Removing event blockers");
}
PageSelector.prototype.removeClassFromMatchingElements = function(className){

	var hElems = document.querySelectorAll("." + className);
	for (var i = 0; i < hElems.length; i++) {
		hElems[i].classList.remove(className);
	}
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
		console.log("calling " + request.call + " (content_scripts/page-actions/PageSelector.js)");
		//Se lo llama con: browser.tabs.sendMessage
		pageManager[request.call](request.args);
	}
});