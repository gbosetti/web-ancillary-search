//TODO: somehow, the file is realoded and that makes it impossible to remove listeners :(
console.log("\n\n\n********* LOADING THE FILE *********\n\n\n");

function PageSelector(){
	//this.createEventListeners();
	this.highlightingClass = "andes-highlighted";
};
PageSelector.prototype.getAllVisibleDomElements = function(){
	return document.querySelectorAll("div, a, img, span, label, ul, li, p, pre, cite, em"); //:not(.first)
};
/*PageSelector.prototype.getAllVisibleDomElementsButSidebar = function(){
	var elems = document.querySelectorAll("div, a, img, span, label, ul, li, p, pre, cite, em"); //*:not(#andes-sidebar)
	var sidebarElems = document.querySelector("#andes-sidebar").querySelectorAll("*");

	console.log(elems);
	sidebarElems.forEach(function(sidebarElem){

		for (var i = elems.length - 1; i >= 0; i--) {
			if(elems[i] == sidebarElem){
				console.log(elems[i]);
				elems.splice(i, 1);
				return;
			}
		}
	});
	return elems;
};*/
PageSelector.prototype.getCurrentSidebarElements = function(){
	
	return document.querySelector("#andes-sidebar").querySelectorAll("*");
};
PageSelector.prototype.preventDomElementsBehaviour = function(){
	var elements = this.getAllVisibleDomElements(); ///////THIS MAY BE A PROBLEM FOR THE SIDEBAR IF THIS METHOD IS CALLED IN THE MIDDLE OF THE PROCESS
	elements.forEach(function(elem){
		
		["click", "keydown", "keyup", "keypress", "mouseup", "mousedown"].forEach(function(eventToPrevent){

			elem.addEventListener(eventToPrevent, function(evt){
				evt.preventDefault();
				evt.stopImmediatePropagation();
			});
		});
	});
};
PageSelector.prototype.getTargetElements = function(selector){
	
	return document.querySelectorAll(selector);
};
PageSelector.prototype.enableElementSelection = function(data){

	this.darkifyAllDomElements();
    this.makeTargetElementsSelectable(data.targetElementSelector, data.onElementSelection);
    this.undarkifySidebarElements();
    this.darkify(document.body); 
};
PageSelector.prototype.darkifyAllDomElements = function(){

	var me = this, elems = this.getAllVisibleDomElements(); 
	elems.forEach(function(elem) { 
		me.darkify(elem);
    });
}
PageSelector.prototype.makeTargetElementsSelectable = function(selector, onElementSelection){

	var me = this;
	this.getTargetElements(selector).forEach(function(elem) { 
		me.undarkify(elem);	
		me.highlight(elem);

		elem.addEventListener("click", function(evt){

			evt.stopImmediatePropagation();

			browser.runtime.sendMessage({ 
				"call": onElementSelection,
				"args": {
					"selectors": (new XPathInterpreter()).getMultipleXPaths(this),
					"previewSource": me.generatePreview(this)
				}
			});
		})	
    });	
}
PageSelector.prototype.generatePreview = function(element){

	try{
		this.removeHighlighting();

	    var canvas = document.createElement("canvas");
	    canvas.width = element.offsetWidth;
	    canvas.height = element.offsetHeight;
	    var ctx = canvas.getContext("2d");
	    var box = element.getBoundingClientRect();
	    ctx.drawWindow(document.defaultView, parseInt(box.left)+
	    	document.defaultView.scrollX,parseInt(box.top)+
	    	document.defaultView.scrollY, element.offsetWidth,element.offsetHeight, "rgb(0,0,0)");

	    element.classList.add(this.highlightingClass);
	    return canvas.toDataURL();
	}catch(err){
		console.log(err.message);
		return;
	}
}
PageSelector.prototype.highlight = function(elem){

	if(!elem.classList.contains(this.highlightingClass)) 
		elem.classList.add(this.highlightingClass);
}
PageSelector.prototype.removeHighlighting = function(){

	var hElems = document.getElementsByClassName(this.highlightingClass);
	for (var i = 0; i < hElems.length; i++) {
		hElems[i].classList.remove(this.highlightingClass);
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
/*PageSelector.prototype.showSelectionPopup = function(elem){

    var popup = this.createPopup(elem); 
	elem.ownerDocument.body.appendChild(popup);

	return popup;
};
PageSelector.prototype.createPopup = function(elem){

	var me=this;
    var menu = document.createElement("div");
		menu.style["z-index"] = "2147483647";

		var bounds = elem.getBoundingClientRect();

		menu.style["width"] = bounds.width - 50;
		menu.style["height"] = bounds.height;
		menu.style["margin-bottom"] = "20px !important";
		menu.style["overflow"] = "hidden !important";
		menu.style["box-shadow"] = "5px 5px rgba(0,0,0,0.5)";
		menu.style["color"] = "white";
		menu.style["display"] = "table";

		elem.parentNode.appendChild(menu);

	return menu;
};*/
PageSelector.prototype.darkify = function(elem){
	
	if(!elem.classList.contains("andes-blurred")){
		elem.classList.add("andes-blurred");
	}
};
PageSelector.prototype.undarkify = function(elem){
	
	if(elem.classList.contains("andes-blurred")){
		elem.classList.remove("andes-blurred")
	}	
};

var pageManager = new PageSelector();
browser.runtime.onMessage.addListener(function callPageSideActions(request, sender, sendResponse) {

	if(pageManager[request.call]){
		console.log("calling " + request.call + " (content_scripts/page-actions/PageSelector.js)");
		//Se lo llama con: browser.tabs.sendMessage
		pageManager[request.call](request.args);
	}
});