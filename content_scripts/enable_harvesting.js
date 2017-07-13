function DomUiManager(){

	this.createEventListeners();
};
DomUiManager.prototype.createEventListeners = function(){

	this.highlightElement = function (evt) {
		evt.stopImmediatePropagation(); evt.preventDefault();
		this.classList.add('woa-highlighted-element');
	};
	this.unhighlightElement = function(evt) {
		evt.stopImmediatePropagation(); evt.preventDefault();
		this.classList.remove('woa-highlighted-element');
	};
	this.selectElement = function(evt) {
		evt.stopImmediatePropagation(); 
		man.disableSelection();
	};
};
DomUiManager.prototype.addHighlightingEventListeners = function(elem){

	elem.addEventListener("mouseover", this.highlightElement);
	elem.addEventListener("mouseout", this.unhighlightElement);
	elem.addEventListener("contextmenu", this.selectElement);
};
DomUiManager.prototype.removeHighlightingEventListeners = function(elem){

	elem.removeEventListener("mouseover", this.highlightElement);
	elem.removeEventListener("mouseout", this.unhighlightElement);
	elem.removeEventListener("contextmenu", this.selectElement);
};
DomUiManager.prototype.enableHighlight = function(){
	
	var me = this, elems = this.getAllVisibleDomElements(); 	
	elems.forEach(function(elem) { 
    	me.addHighlightingEventListeners(elem);
    });
};
DomUiManager.prototype.getAllVisibleDomElements = function(){
	return document.querySelectorAll("div, a, img, span, label, ul, li, p, pre");
}
DomUiManager.prototype.disableHighlight = function(){

	var me = this, elems = this.getAllVisibleDomElements(); 	
	elems.forEach(function(elem) { 
    	me.removeHighlightingEventListeners(elem);
    });
};

var ui = new DomUiManager();

browser.runtime.onMessage.addListener(function enableHarvesting(request, sender, sendResponse) {
	ui.enableHighlight();
});