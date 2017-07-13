/* WARNING: In this context you can not use prototype, if you are calling this script from background (non-structured-clonable) */
function DomUiManager(){

	this.createEventListeners();
	this.createEventListeners = function(){

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
	this.addEventListeners = function(elem){

		elem.addEventListener("mouseover", this.highlightElement);
		elem.addEventListener("mouseout", this.unhighlightElement);
		elem.addEventListener("contextmenu", this.selectElement);
	};
	this.enableHighlight = function(){
		var elems = document.querySelectorAll("div, a, img, span, label, ul, li"); 
		var me = this;
		
		elems.forEach(function(elem) { 
	    	me.addEventListeners(elem);
	    });
	};
};