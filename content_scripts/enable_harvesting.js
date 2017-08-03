//TODO: somehow, the file is realoded and that makes it impossible to remove listeners :(
console.log("\n\n\n********* LOADING THE FILE *********\n\n\n");

function DomUiManager(){

	this.createEventListeners();
};
DomUiManager.prototype.createEventListeners = function(){

	
	//Thiss is created separately so we can attach and detach them
	var man = this;
	this.highlightElement = function (evt) {
		evt.stopImmediatePropagation(); 
		evt.preventDefault();
		man.addHighlightingClass(this);
	};
	this.unhighlightElement = function(evt) {
		evt.stopImmediatePropagation(); 
		evt.preventDefault();
		man.removeHighlightingClass(this);
	};
	this.selectContextualizedElement = function(evt) {
		evt.stopImmediatePropagation(); //evt.preventDefault();

		man.removeHighlightingClass(evt.target); //so the preview is generated without the selection style

		browser.runtime.sendMessage({
			call: "setContextualizedElement",
			args: {
				"xpaths": man.labelXPaths(man.getDomElementXPaths(evt.target)),
				"preview": man.createCTemplateThumbnail(evt.target)
			}
		});

		man.addHighlightingClass(evt.target);
	};
};
DomUiManager.prototype.addHighlightingClass = function(elem){

	elem.classList.add('andes-highlighted-element');
};
DomUiManager.prototype.getMatchedElementsQuantity = function(xpath){

	var elems = (new window["XPathInterpreter"]()).getElementsByXpath(xpath, document);
	return (elems && elems.length && elems.length > 0)? elems.length : 0;
};
DomUiManager.prototype.labelXPaths = function(xpaths, baseXpath){


	var labeledXpaths = [];
	for (var i = 0; i < xpaths.length; i++) {

		var matches = (baseXpath)? this.getMatchedElementsQuantity(baseXpath + "/" + xpaths[i]): this.getMatchedElementsQuantity(xpaths[i]);

		if(matches >= 1){
			var lbl = (matches==1)? browser.i18n.getMessage("singleMatch"): browser.i18n.getMessage("multipleMatches");
			labeledXpaths.push({
				order: matches,
				label: matches + ' ' + lbl,
				value: xpaths[i]
			});
		}
	};
	labeledXpaths.sort(function compare(a,b) {
		if (a.order < b.order) return -1;
		else if (a.order > b.order) return 1;
		else return 0;
	});
	return labeledXpaths;
};
DomUiManager.prototype.createCTemplateThumbnail = function(element) { 
	try{
		/*var hElems = document.getElementsByClassName("andes-highlighted-element");
		for (var i = 0; i < hElems.length; i++) {
			hElems[i].classList.remove("andes-highlighted-element");
		}*/
		
	    var canvas = document.createElement("canvas");
		    canvas.width = element.offsetWidth;
		    canvas.height = element.offsetHeight;
	    var ctx = canvas.getContext("2d");
	    var box = element.getBoundingClientRect();
	    ctx.drawWindow(document.defaultView, parseInt(box.left)+
	    	document.defaultView.scrollX,parseInt(box.top)+
	    	document.defaultView.scrollY, element.offsetWidth,element.offsetHeight, "rgb(0,0,0)");

	    return canvas.toDataURL();
	}catch(err){
		console.log(err.message);
		return;
	}
}
DomUiManager.prototype.removeHighlightingClass = function(elem){

	if(elem.classList.contains("andes-highlighted-element")) 
		elem.classList.remove('andes-highlighted-element');
};
DomUiManager.prototype.getDomElementXPaths = function(elem){

	return (new window["XPathInterpreter"]()).getMultipleXPaths(elem, elem.ownerDocument);
};
DomUiManager.prototype.addHighlightingEventListeners = function(elem){

	elem.addEventListener("mouseover", this.highlightElement);
	elem.addEventListener("mouseout", this.unhighlightElement);
};
DomUiManager.prototype.removeHighlightingEventListeners = function(elem){

	elem.removeEventListener("mouseover", this.highlightElement);
	elem.removeEventListener("mouseout", this.unhighlightElement);
};
DomUiManager.prototype.enableHighlight = function(){
	
	var me = this, elems = this.getAllVisibleDomElements(); 	
	elems.forEach(function(elem) { 
    	me.addHighlightingEventListeners(elem);
    });
};
DomUiManager.prototype.enableContextElementSelection = function(){
	
	var me = this, elems = this.getAllVisibleDomElements(); 	
	elems.forEach(function(elem) { 
    	elem.addEventListener("contextmenu", me.selectContextualizedElement);
    });
};
DomUiManager.prototype.disableContextElementSelection = function(){
	
	var me = this, elems = this.getAllVisibleDomElements(); 	
	elems.forEach(function(elem) { 
    	elem.removeEventListener("contextmenu", me.selectContextualizedElement);
    });
};
DomUiManager.prototype.getAllVisibleDomElements = function(){
	return document.querySelectorAll("div, a, img, span, label, ul, li, p, pre");
};
DomUiManager.prototype.disableHighlight = function(){

	var me = this, elems = this.getAllVisibleDomElements(); 
	elems.forEach(function(elem) { 
    	me.removeHighlightingEventListeners(elem);
    });
};

var ui = new DomUiManager();

browser.runtime.onMessage.addListener(function callPageSideActions(request, sender, sendResponse) {

	console.log("calling " + request.call);
	//Se lo llama con: browser.tabs.sendMessage
	ui[request.call]();
});