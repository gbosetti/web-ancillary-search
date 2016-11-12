var UiManager = require("./UiManager").getClass();

function SearchApiDefinitionTool(locale, ui){

	this.initializeComponents(locale, ui);
	this.searchDefListener;
	this.locale = locale;
	this.ui = ui;
	this.persistence = require("./persistence").getInstance(locale);
	this.initContextMenus();
}
SearchApiDefinitionTool.prototype = new UiManager();
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
		id: 'ways-extract-search-next', 
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
	item.onclick = function(evt){
		console.log("result");
	};
}
SearchApiDefinitionTool.prototype.createResultPropertyMenu = function() { 

	var item = this.createSearchEngineSubMenu({
		id: 'ways-extract-search-result-prop', 
		label: this.locale('result_property')
	});
	item.onclick = function(evt){
		console.log("result_property");
	};
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

	return this.createContextMenu({
		id: 'ways-search-engine-definition',
		label:this.locale('collect_as_search_engine'), 
		menupopup: this.getContentAreaContextMenu()
	});
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
SearchApiDefinitionTool.prototype.getMenupopup = function(elem, document) {

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
}
SearchApiDefinitionTool.prototype.createSearchEngineSubMenu = function(data) {

    data.menu = this.menu;
    return this.createContextSubMenu(data);
}
SearchApiDefinitionTool.prototype.saveSearchElement = function(target, key){

	this.getCurrentWindow().alert("saveSearchElement");
	//this.persistence.saveSearchElement();
	//FROM THE CURRENT WEBPAGE CONTEXT
	/*var me = this;
	this.onceInSidebar(function(){

		me.loadSidebar();
		var xpaths = me.getDomElementSimpleXPath(target); //TODO: remove all the complex part for obtaining the labeled xpath. It's not useful anymore
		if(xpaths && xpaths.length && xpaths.length > 0){

			//getting the stored data of the last configured search engine
			var storedData; = persistence.getSearchEngineData(man.lastSearchEngineId);
			if(storedData == undefined || !storedData)
				storedData = {};

			man.temp[key] = xpaths[0].value;
			for(var xxx in man.temp){
		      	storedData[xxx] = man.temp[xxx];
		   	}
			
			//man.sidebarWorker.port.emit("editSearchEngine", storedData);
		}
		
	});*/
}
SearchApiDefinitionTool.prototype.loadEditionForm = function(target, key){

	let sidebarId = this.getSidebarId(where);

    if(this.sidebars[sidebarId]){
    	if(this.sidebars[sidebarId][1].clientHeight == 0)
    		delete this.sidebars[sidebarId];
    	else return;
    }

    this.sidebars[sidebarId] = this.sidebarManager.createInterfacePanelIframe({
    	position: where,
        url:url,
        byWindow:false,
        width:size,
        useBrowser: true
    });

	for (var prop in listeners) {
		this.sidebars[sidebarId][1].addEventListener(prop, listeners[prop], true);
	}

	return this.sidebars[sidebarId][1];
}


exports.getInstance = function(locale, ui) {
    return new SearchApiDefinitionTool(locale, ui);
}