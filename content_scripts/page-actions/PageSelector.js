//TODO: somehow, the file is realoded and that makes it impossible to remove listeners :(
console.log("\n\n\n********* LOADING THE 'PAGE SELECTOR' FILE *********\n\n\n");

function PageSelector(){
	//this.createEventListeners();
	this.highlightingClass = "andes-highlighted";
	this.clearBackgroundClass = "andes-clear-background";
	this.obfuscatedClass = "andes-blurred";
	this.loadListeners();
};
PageSelector.prototype.loadListeners = function(){
	
	var me = this;
	this.onElementSelectionMessage; 
	this.selectionListener = function(evt){

		//evt.stopImmediatePropagation();
		browser.runtime.sendMessage({ 
			"call": me.onElementSelectionMessage,
			"args": {
				"selectors": (new XPathInterpreter()).getMultipleXPaths(evt.target),
				"previewSource": me.generatePreview(evt.target)
			}
		});
	};
	this.preventActionsListener = function(evt){

		me.executeAndesActions(evt);
		evt.preventDefault();
		evt.stopImmediatePropagation();
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

	var me=this, elements = this.getAllVisibleDomElementsButBody(); ///////THIS MAY BE A PROBLEM FOR THE SIDEBAR IF THIS METHOD IS CALLED IN THE MIDDLE OF THE PROCESS
	elements.forEach(function(elem){
		
		me.getEventsNamesToPrevent().forEach(function(eventToPrevent){

			elem.removeEventListener(eventToPrevent, me.preventActionsListener, false);
		});
	});
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
		me.removeHighlightingClass(elem);
    });
}
PageSelector.prototype.executeAndesActions = function(evt){

	var actions = this.getAndesActions(evt.target);
	for (var i = actions.length - 1; i >= 0; i--) {
		if(evt.type.toUpperCase() == actions[i].event.toUpperCase())
			this[actions[i].listener](evt);
	}
}
PageSelector.prototype.getAndesActions = function(elem){

	var actions = elem.getAttribute("andes-actions");
	return (actions && actions.length)? actions=JSON.parse(actions): actions=[];
}
PageSelector.prototype.addAndesAction = function(elem, action){

	var actions = this.getAndesActions(elem);
		actions.push(action);

	elem.setAttribute("andes-actions", JSON.stringify(actions))
}
PageSelector.prototype.addSelectionListener = function(selector, onElementSelection, onEvent){

	var me = this;
	this.getTargetElements(selector).forEach(function(elem) { 
		me.undarkify(elem);	
		me.addHighlightingClass(elem);
		me.onElementSelectionMessage = onElementSelection; //callback
		me.addAndesAction(elem, {"listener": "selectionListener", "event": onEvent});
    });	
}
PageSelector.prototype.removeSelectionListener = function(selector, onEvent){

	var me = this;
	this.getTargetElements(selector).forEach(function(elem) { 
		elem.removeEventListener(onEvent, me.selectionListener);	
    });	
}
PageSelector.prototype.generatePreview = function(element){

	try{
		this.removeHighlightingClass(element);
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
	    this.addHighlightingClass(element);

	    return canvas.toDataURL();
	}catch(err){
		console.log(err.message);
		return;
	}
}
PageSelector.prototype.addHighlightingClass = function(elem){

	this.addStyleClass(elem, this.highlightingClass);  
}
PageSelector.prototype.removeFullSelectionStyle = function(){

	this.removeClassFromMatchingElements(this.obfuscatedClass);
	this.removeClassFromMatchingElements(this.highlightingClass);
	this.removeClassFromMatchingElements(this.clearBackgroundClass);
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
	
	if(elem.classList && elem.classList.contains(className)){
		elem.classList.remove(className);
	}
};
PageSelector.prototype.undarkify = function(elem){
	
	this.removeStyleClass(elem, this.obfuscatedClass);
};
PageSelector.prototype.removeHighlightingClass = function(elem){
	
	this.removeStyleClass(elem, this.highlightingClass);	
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