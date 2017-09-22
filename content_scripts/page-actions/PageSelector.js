//TODO: somehow, the file is realoded and that makes it impossible to remove listeners :(
console.log("\n\n\n********* LOADING THE FILE *********\n\n\n");

function PageSelector(){
	//this.createEventListeners();
};
/*PageSelector.prototype.createEventListeners = function(){

	
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
PageSelector.prototype.addHighlightingClass = function(elem){

	elem.classList.add('andes-highlighted-element');
};
PageSelector.prototype.getMatchedElementsQuantity = function(xpath){

	var elems = (new window["XPathInterpreter"]()).getElementsByXpath(xpath, document);
	return (elems && elems.length && elems.length > 0)? elems.length : 0;
};
PageSelector.prototype.labelXPaths = function(xpaths, baseXpath){


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
PageSelector.prototype.createCTemplateThumbnail = function(element) { 
	try{

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
PageSelector.prototype.removeHighlightingClass = function(elem){

	if(elem.classList.contains("andes-highlighted-element")) 
		elem.classList.remove('andes-highlighted-element');
};
PageSelector.prototype.getDomElementXPaths = function(elem){

	return (new window["XPathInterpreter"]()).getMultipleXPaths(elem, elem.ownerDocument);
};
PageSelector.prototype.addHighlightingEventListeners = function(elem){

	elem.addEventListener("mouseover", this.highlightElement);
	elem.addEventListener("mouseout", this.unhighlightElement);
};
PageSelector.prototype.removeHighlightingEventListeners = function(elem){

	elem.removeEventListener("mouseover", this.highlightElement);
	elem.removeEventListener("mouseout", this.unhighlightElement);
};*/


















PageSelector.prototype.getAllVisibleDomElements = function(){
	return document.querySelectorAll("div, a, img, span, label, ul, li, p, pre, cite, em )"); //:not(.first)
};
PageSelector.prototype.enableElementSelection = function(data){
	
	var me = this, elems = this.getAllVisibleDomElements(); 	
	elems.forEach(function(elem) { 
		me.darkify(elem);
    });

    var selectableElements = document.querySelectorAll(data.targetElementSelector);
    selectableElements.forEach(function(elem) { 
		me.undarkify(elem);
    });

   


    //me.addSelectionEventListener(elem);
};
PageSelector.prototype.darkify = function(elem){
	
	if(!elem.classList.contains("andes-blurred")){
		elem.classList.add("andes-blurred");
	}
};
PageSelector.prototype.undarkify = function(elem){
	
	var element = elem;
	while(element.parentNode) {
		if(element.classList.contains("andes-blurred")){
			console.log("removing the class", element);
			element.classList.remove("andes-blurred")
		}

		element = element.parentNode;
	}	
};
/*PageSelector.prototype.enableContextElementSelection = function(){
	
	var me = this, elems = this.getAllVisibleDomElements(); 	
	elems.forEach(function(elem) { 
    	elem.addEventListener("contextmenu", me.selectContextualizedElement);
    });
};
PageSelector.prototype.disableContextElementSelection = function(){
	
	var me = this, elems = this.getAllVisibleDomElements(); 	
	elems.forEach(function(elem) { 
    	elem.removeEventListener("contextmenu", me.selectContextualizedElement);
    });
};
PageSelector.prototype.disableHighlight = function(){

	var me = this, elems = this.getAllVisibleDomElements(); 
	elems.forEach(function(elem) { 
    	me.removeHighlightingEventListeners(elem);
    });
};
PageSelector.prototype.removeHighlightings = function(){

	var me = this, elems = this.getAllVisibleDomElements(); 
	elems.forEach(function(elem) { 
		//console.log(elem);
    	me.removeHighlightingClass(elem);
    });
};
PageSelector.prototype.highlightMatchingElements = function(data){

	var elems = (new window.XPathInterpreter()).getElementsByXpath(data.xpath, document);
	this.removeHighlightings();

	for (var i = elems.length - 1; i >= 0; i--) {
		this.addHighlightingClass(elems[i]);
	}
};*/

var pageManager = new PageSelector();
browser.runtime.onMessage.addListener(function callPageSideActions(request, sender, sendResponse) {

	if(pageManager[request.call]){
		console.log("calling " + request.call + " (content_scripts/page-actions/PageSelector.js)");
		//Se lo llama con: browser.tabs.sendMessage
		pageManager[request.call](request.args);
	}
});