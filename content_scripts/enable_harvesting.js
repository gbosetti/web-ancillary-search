//TODO: somehow, the file is realoded and that makes it impossible to remove listeners :(
console.log("LOADING THE FILE ***********************************");

function DomUiManager(){

    /*if (DomUiManager._instance) {
        return DomUiManager._instance;
    }
    DomUiManager._instance = this;*/

	this.createEventListeners();
};
DomUiManager.prototype.createEventListeners = function(){

	
	//TODO: problem: the dom is instantiated each time, so we can never remove the listeners!
	var man = this;
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
		//man.disableHighlight();
	};
};
DomUiManager.prototype.addHighlightingEventListeners = function(elem){

	elem.addEventListener("mouseover", this.highlightElement);
	elem.addEventListener("mouseout", this.unhighlightElement);
	//elem.addEventListener("contextmenu", this.selectElement);
};
DomUiManager.prototype.removeHighlightingEventListeners = function(elem){

	elem.removeEventListener("mouseover", this.highlightElement);
	elem.removeEventListener("mouseout", this.unhighlightElement);
	//elem.removeEventListener("contextmenu", this.selectElement);
};
DomUiManager.prototype.enableHighlight = function(){
	
	var me = this, elems = this.getAllVisibleDomElements(); 	
	elems.forEach(function(elem) { 
    	me.addHighlightingEventListeners(elem);
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

browser.runtime.onMessage.addListener(function enableHarvesting(request, sender, sendResponse) {

	console.log("calling " + request.call);

	ui[request.call]();
});