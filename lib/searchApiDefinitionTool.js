var UiManager = require("./UiManager").getClass();
var {Ci, Cu} = require("chrome"); //, Cc, CC
Cu.import("resource://gre/modules/Services.jsm");
Cu.import("resource://gre/modules/FileUtils.jsm");


function SearchApiDefinitionTool(locale, ui){

	this.initializeComponents(locale, ui);
	this.searchDefListener;
	this.locale = locale;
	this.ui = ui;
	this.persistence = require("./persistence").getInstance(locale);
	this.initContextMenus();
	//this.loadCssFiles();
	this.menu;
	this.initPopupHighlightingListener();
	this.createSidebar();
	this.sidebars = {};
}
SearchApiDefinitionTool.prototype = new UiManager();
SearchApiDefinitionTool.prototype.loadCssFiles = function() { 
	this.attachCssFiles(["./src/css/dom-elem-selection.css"]);
}
SearchApiDefinitionTool.prototype.initPopupHighlightingListener = function() { 

	var me = this;
	this.popupHighlightingListener = function(e) {		

		//just collect when the click menu is in the second level
		if(e.eventPhase == 2) return; //!=2

		//It is not possible to compare the menu itself because the "e.target elements" haven't some properties like id, therefore the comparison is always false
		if(me.menu.firstChild.firstChild == e.target.firstChild){
			me.loadCssFiles();
			me.triggerNode = e.target.triggerNode;
			me.highlightDomElement(e.target.triggerNode);
		}
		//Get the selection
		/*me.selectedText = me.getCurrentWindow().content.getSelection().toString();

		//Get Dom element
		if(e.shiftKey){
			me.selectedDomElement = e.target.triggerNode.parentElement;
		} 
		else{ 
			me.selectedDomElement = e.target.triggerNode; 
		}*/
	};
	this.getContentAreaContextMenu().addEventListener("popupshowing", 
		this.popupHighlightingListener, false);
}
SearchApiDefinitionTool.prototype.highlightDomElement = function(element) { 

	element.classList.add("search-apis-highlighted-element");
}
SearchApiDefinitionTool.prototype.initContextMenus = function() { 

	this.menu = this.createMenu();
	this.loadSearchEngineSubMenus();
}
SearchApiDefinitionTool.prototype.loadSearchEngineSubMenus = function() { 

	this.createInputMenu();
	this.createTriggerMenu();
	this.createNavNextMenu();
	this.createNavPrevMenu();
	this.createResultMenu();
	this.createResultPropertyMenu();
}
SearchApiDefinitionTool.prototype.buildStoreSearchElementMessage = function(id, expectedTypes, errorMessage) { 


}
SearchApiDefinitionTool.prototype.createInputMenu = function() { 
	this.createSearchElementMenu({
		id: 'ways-extract-search-input', 
		label: this.locale('input'),
		expectedTypes: ["input"],
		storeAs: "entry",
		errorMessage: this.locale("no_input_element")
	});
}
SearchApiDefinitionTool.prototype.createSearchElementMenu = function(data) { 

	var me = this;
	var item = this.createSearchEngineSubMenu({	id: data.id, label: data.label });
		item.expectedTypes = data.expectedTypes;
		item.storeAs = data.storeAs;
		item.errorMessage = data.errorMessage;
		item.onclick = function(evt){
			var target = me.getElementByType(this.expectedTypes, me.getSelectedDomElement());
			if(target) 
				me.saveSearchElement(target, this.id); 
			else me.getCurrentWindow().alert(this.errorMessage)
		};
	return item;
}
SearchApiDefinitionTool.prototype.createTriggerMenu = function() { 

	this.createSearchElementMenu({
		id: 'ways-extract-search-trigger', 
		label: this.locale('trigger'),
		expectedTypes: ["a", "button"],
		storeAs: "trigger",
		errorMessage: this.locale("no_trigger_element")
	});
}
SearchApiDefinitionTool.prototype.createNavNextMenu = function() { 

	this.createSearchElementMenu({
		id: 'ways-extract-search-next', 
		label: this.locale('next_page'),
		expectedTypes: ["a", "button"],
		storeAs: "next",
		errorMessage: this.locale("no_trigger_element")
	});
}
SearchApiDefinitionTool.prototype.createNavPrevMenu = function() { 

	this.createSearchElementMenu({
		id: 'ways-extract-search-prev', 
		label: this.locale('prev_page'),
		expectedTypes: ["a", "button"],
		storeAs: "prev",
		errorMessage: this.locale("no_trigger_element")
	});
}
SearchApiDefinitionTool.prototype.createResultMenu = function() { 

	var item = this.createSearchEngineSubMenu({
		id: 'ways-extract-search-result', 
		label: this.locale('result')
	});
	var me = this;
	item.onclick = function(evt){
		me.createResultTemplate(evt);
	};
}
SearchApiDefinitionTool.prototype.createResultPropertyMenu = function() { 

	var item = this.createSearchEngineSubMenu({
		id: 'ways-extract-search-result-prop', 
		label: this.locale('result_property')
	});
	var me = this;
	item.onclick = function(evt){
		me.createPropertyTemplate(evt);
	};
}
SearchApiDefinitionTool.prototype.createResultTemplate = function(evt) { 

	this.changeSidebarUrl("./search-api-new-result.html");
	var me = this;
	this.onceInSidebar(function(){

		me.sidebarWorker.port.emit("createSidebarManager", {locale: me.getJSONLocalizedBundle()});
		me.sidebarWorker.port.emit("createResultTemplate", 
			me.createResultThumbnail(me.triggerNode, "search-apis-highlighted-element"));
	});
}
SearchApiDefinitionTool.prototype.changeSidebarUrl = function(url) { 
	this.sidebar.url = require("sdk/self").data.url(url);
}
SearchApiDefinitionTool.prototype.createPropertyTemplate = function(evt) { 

	this.changeSidebarUrl("./search-api-new-property.html");
	var me = this;
	this.onceInSidebar(function(){
		//me.sidebarWorker.port.emit("createSidebarManager", {locale: me.getJSONLocalizedBundle()});
		me.sidebarWorker.port.emit("createPropertyTemplate", 
			me.createResultThumbnail(me.triggerNode, "search-apis-highlighted-element"));
	});
}
SearchApiDefinitionTool.prototype.createResultThumbnail = function(element, excludedClass) { 
	try{
		var document = element.ownerDocument;
		var hElems = document.getElementsByClassName(excludedClass);
		for (var i = 0; i < hElems.length; i++) {
			hElems[i].classList.remove(excludedClass);
		}
	    var canvas = document.createElement("canvas");
	    canvas.width = element.offsetWidth;
	    canvas.height = element.offsetHeight;
	    var ctx = canvas.getContext("2d");
	    var box = element.getBoundingClientRect();
	    ctx.drawWindow(document.defaultView, parseInt(box.left)+
	    	document.defaultView.scrollX,parseInt(box.top)+
	    	document.defaultView.scrollY, element.offsetWidth,element.offsetHeight, "rgb(0,0,0)");

	    element.classList.add(excludedClass);
	    return canvas.toDataURL();
	}catch(err){
		console.log(err.message);
		return;
	}
}
SearchApiDefinitionTool.prototype.createSidebar = function(config) {
	//TODO: This should be included in the extension manager, and getWorker instead getInstance
	var man = this;
	//if (win.location.href == "chrome://browser/content/web-panels.xul") console.log("sidebar is open");
	this.sidebar = require("sdk/ui/sidebar").Sidebar({ //can't set width
		id: 'woa-pim-sidebar',
		title: ' ',
		url: require("sdk/self").data.url("./search-api-new-result.html"),
		onAttach: function (worker) {
			man.sidebarWorker = worker;
			man.sidebar.isOpen = false;
		},
		onReady: function (worker) {
			//Pasa el bundle localizado como parámetro e inicializa el comportamiento asociado al sidebar
			//Shares the localized bundle with the sidebar and initialized the sidebar behaviour
			//worker.port.emit("initSidebar",{ locale: man.getJSONLocalizedBundle() });
		},
		onShow: function () {
			man.sidebar.isOpen = true;
			man.onSidebarReady(); 
		},
		onHide: function () {
			man.sidebar.isOpen = false;
			//man.unloadPopupEventsInSidebar();
		}
	});
}





SearchApiDefinitionTool.prototype.getJSONLocalizedBundle = function() {
	//Loads the needed localized strings
	var bundle = {}; 
	var keys = this.getKeysFromDefaultBundle();
	for (var i = 0; i < keys.length; i++) {
		bundle[keys[i]] = this.locale(keys[i]);
	}

	return bundle;
}
SearchApiDefinitionTool.prototype.getKeysFromDefaultBundle = function(){
	//I know, this could be directly used. But I want to avoid using global and there are some benefits from the SDK, like the html tags
	var keys = [];
	try{
		var bnd = Services.strings.createBundle('resource://woa-at-lifia-dot-info-dot-unlp-dot-edu-dot-ar/locale/en-US.properties'); 
		var props = bnd.getSimpleEnumeration();
		
		while (props.hasMoreElements()) {
			keys.push(props.getNext().QueryInterface(Ci.nsIPropertyElement).key);
		}
	}catch(err){
		console.log(err.message);
	}
	return keys;
}








SearchApiDefinitionTool.prototype.getElementByType = function(types, element) { 
	//Returns the element matching the type passed as parameter. This is because the user may 
	//have selected the container of, for example, an anchor, and not the anchor itself 

	if(element.tagName && types.indexOf(element.tagName.toLowerCase()) != -1){
		return element;
	} 
	else {
		for (var i = types.length - 1; i >= 0; i--) {
			var possibleElems = element.getElementsByTagName(types[i]);
			if(possibleElems && possibleElems.length && possibleElems.length > 0)
				return possibleElems[0];
		}
		return;
	} 
}
SearchApiDefinitionTool.prototype.getTriggerElement = function(element) { 
	//Returns the trigger element. This is because the user may 
	//have selected the container of the trigger element, and not the element itself. 

	if(element.onclick || element.href || element.type == "submit")
		return element;

	var descendants = element.querySelectorAll("*");
	for (var i = 0; i < descendants.length; i++) {
		if(descendants[i].onclick || descendants[i].href || descendants[i].type == "submit")
			return descendants[i];
	}
	return;
}
SearchApiDefinitionTool.prototype.createMenu = function(){

	this.menu = this.createContextMenu({
		id: 'ways-search-engine-definition',
		label:this.locale('collect_as_search_engine'), 
		menupopup: this.getContentAreaContextMenu()
	});

	return this.menu;
}
SearchApiDefinitionTool.prototype.checkRequiredParams = function(localeBundle) {
	// Making sure there is a locale bundle for getting the localized strings

	if (!localeBundle) {
		throw new Error("There was a problem loading the locale bundle. The API definition tool can not be properly loaded.");
	}
}
SearchApiDefinitionTool.prototype.setLocaleBundle = function(localeBundle) {

	this.locale = localeBundle;
}
SearchApiDefinitionTool.prototype.disable = function() {
	
	this.hideContextMenu();
};
SearchApiDefinitionTool.prototype.hideContextMenu = function(childNodes){

	this.menu.style.visibility = "hidden";
	this.menu.style.display = "none";
};
SearchApiDefinitionTool.prototype.enable = function() {
	
	this.showContextMenu();
};
SearchApiDefinitionTool.prototype.showContextMenu = function(){

	this.menu.style.visibility = "visible";
	this.menu.style.display = "";
}
/*SearchApiDefinitionTool.prototype.getMenupopup = function(elem, document) {

	if(elem.tagName == 'menupopup'){ 
        return elem;
    } else { 
        var parent = elem.getElementsByTagName("menupopup")[0];
        if(parent == null) {
        	var mpp = document.createElement("menupopup");
        	elem.appendChild(mpp);
        	return mpp; 
        } 
        return parent;
    }
}*/
SearchApiDefinitionTool.prototype.createSearchEngineSubMenu = function(data) {

    data.menu = this.menu;
    return this.createContextSubMenu(data);
}
SearchApiDefinitionTool.prototype.onceInSidebar = function(callback, args){
	//TODO: PROBLEM WITH CALLBACK
	if(this.sidebar.isOpen) {
		callback(args);
	}
	else {
		this.temp = {};
		this.onSidebarReady = function(){
			console.log("callback");
			callback(args);
		};
		this.sidebar.show();
	}
}
SearchApiDefinitionTool.prototype.saveSearchElement = function(target, key){

	this.getCurrentWindow().alert("saveSearchElement");

}


exports.getInstance = function(locale, ui) {
    return new SearchApiDefinitionTool(locale, ui);
}