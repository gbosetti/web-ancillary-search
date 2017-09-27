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
	
	this.selectionListener = function(evt){

		evt.stopImmediatePropagation();

		browser.runtime.sendMessage({ 
			"call": onElementSelection,
			"args": {
				"selectors": (new XPathInterpreter()).getMultipleXPaths(this),
				"previewSource": me.generatePreview(this)
			}
		});
	};
	this.preventActionsListener = function(evt){
		evt.preventDefault();
		evt.stopImmediatePropagation();
	};
};
PageSelector.prototype.getAllVisibleDomElements = function(){
	return document.querySelectorAll("div, a, img, span, label, ul, li, p, pre, cite, em"); //:not(.first)
};
PageSelector.prototype.getCurrentSidebarElements = function(){
	
	return document.querySelector("#andes-sidebar").querySelectorAll("*");
};
PageSelector.prototype.preventDomElementsBehaviour = function(){
	var me=this, elements = this.getAllVisibleDomElements(); ///////THIS MAY BE A PROBLEM FOR THE SIDEBAR IF THIS METHOD IS CALLED IN THE MIDDLE OF THE PROCESS
	elements.forEach(function(elem){
		
		me.getEventsNamesToPrevent().forEach(function(eventToPrevent){
			elem.addEventListener(eventToPrevent, me.preventActionsListener );
		});
	});
};
PageSelector.prototype.restoreDomElementsBehaviour = function(){
	var me=this, elements = this.getAllVisibleDomElements(); ///////THIS MAY BE A PROBLEM FOR THE SIDEBAR IF THIS METHOD IS CALLED IN THE MIDDLE OF THE PROCESS
	elements.forEach(function(elem){
		
		me.getEventsNamesToPrevent().forEach(function(eventToPrevent){

			elem.removeEventListener(eventToPrevent, me.preventActionsListener );
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
    this.addSelectionListener(data.targetElementSelector, data.onElementSelection);
    this.undarkifySidebarElements();
    this.darkify(document.body); 
};
PageSelector.prototype.disableElementSelection = function(data){

	this.undarkifyAllDomElements();
    this.removeSelectionListener();
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
PageSelector.prototype.addSelectionListener = function(selector, onElementSelection){

	var me = this;
	this.getTargetElements(selector).forEach(function(elem) { 
		me.undarkify(elem);	
		me.highlight(elem);
		elem.addEventListener("click", this.selectionListener)	
    });	
}
PageSelector.prototype.removeSelectionListener = function(selector){

	var me = this;
	this.getTargetElements(selector).forEach(function(elem) { 
		elem.removeEventListener("click", this.selectionListener)	
    });	
}
PageSelector.prototype.generatePreview = function(element){

	try{
		this.unhighlight(element);
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
	    this.highlight(element);

	    return canvas.toDataURL();
	}catch(err){
		console.log(err.message);
		return;
	}
}
PageSelector.prototype.highlight = function(elem){

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
	
	if(elem.classList.contains(className)){
		elem.classList.remove(className);
	}
};
PageSelector.prototype.undarkify = function(elem){
	
	this.removeStyleClass(elem, this.obfuscatedClass);
};
PageSelector.prototype.unhighlight = function(elem){
	
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