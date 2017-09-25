//TODO: somehow, the file is realoded and that makes it impossible to remove listeners :(
console.log("\n\n\n********* LOADING THE FILE *********\n\n\n");

function PageSelector(){
	//this.createEventListeners();
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
		elem.addEventListener("click", function(evt){
			evt.preventDefault();
			evt.stopImmediatePropagation();
		});
	});
};
PageSelector.prototype.getTargetElements = function(selector){
	
	return document.querySelectorAll(selector);
};
PageSelector.prototype.enableElementSelection = function(data){

	this.darkifyAllDomElements();
    this.makeTargetElementsSelectable(data.targetElementSelector);
    this.undarkifySidebarElements();
    this.darkify(document.body); 
};
PageSelector.prototype.darkifyAllDomElements = function(){

	var me = this, elems = this.getAllVisibleDomElements(); 
	elems.forEach(function(elem) { 
		me.darkify(elem);
    });
}
PageSelector.prototype.makeTargetElementsSelectable = function(selector){

	var me = this;
	this.getTargetElements(selector).forEach(function(elem) { 
		me.undarkify(elem);	
		me.addClassToParentLevel(elem, "andes-highlighted", 1);
		
		elem.addEventListener("click", function(){
			alert("clicked!");
		})	
    });	
}
PageSelector.prototype.addClassToParentLevel = function(elem, className, deepeness){

	var element = elem, level=0;
	while(level < deepeness && element.parentNode) {
		if(!element.classList.contains(className)) element.classList.add(className);
		element = element.parentNode;
		level++;
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
/*PageSelector.prototype.undarkifyToParentLevel = function(elem, deepeness){
	
	var element = elem, level=0;
	while(level < deepeness && element.parentNode) {
		this.undarkify(element);
		element = element.parentNode;
		level++;
	}	
};
PageSelector.prototype.undarkifyToRoot = function(elem){
	
	var element = elem;
	while(element.parentNode) {
		this.undarkify(element);
		element = element.parentNode;
	}	
};*/
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