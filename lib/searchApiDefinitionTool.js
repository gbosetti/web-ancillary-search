function SearchApiDefinitionTool(localeBundle, nativeApi){

	this.checkRequiredParams(localeBundle);
	
	this.selectedDomElement;
	this.searchDefListener;
	this.locale = localeBundle;
	this.nativeApi = nativeApi;
	this.persistence = require("./persistence").getInstance(localeBundle);
	this.initContextMenus();
}
SearchApiDefinitionTool.prototype.initContextMenus = function() { 

	this.menu = this.createMenu();
	this.loadSearchEngineSubMenus();
	this.loadPopupEvents();
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

	var me = this;
	return function(){
		var target = me.getElementByType(expectedTypes, me.selectedDomElement);
		if(target) {
			me.saveSearchElement(target, id); 
		}
		else me.getCurrentWindow().alert(me.locale(errorMessage)) 
	};
}
SearchApiDefinitionTool.prototype.createInputMenu = function() { 

	this.createSearchEngineSubMenu({
		id: 'ways-extract-search-input', 
		label: this.locale('input'),
		callback: me.buildStoreSearchElementMessage({
			expectedTypes: ["input"],
			storeAs: "entry",
			errorMessage: "no_input_element"
		})
	});
}
SearchApiDefinitionTool.prototype.createTriggerMenu = function() { 

	var me = this;
	this.createSearchEngineSubMenu({
		id: 'ways-extract-search-trigger', 
		label: this.locale('trigger'),
		callback: me.buildStoreSearchElementMessage({
			expectedTypes: ["a", "button"],
			storeAs: "trigger",
			errorMessage: "no_trigger_element"
		})
	});
}
SearchApiDefinitionTool.prototype.createNavNextMenu = function() { 

	var me = this;
	this.createSearchEngineSubMenu({
		id: 'ways-extract-next-page', 
		label: this.locale('next_page'),
		callback: me.buildStoreSearchElementMessage({
			expectedTypes: ["a", "button"],
			storeAs: "next",
			errorMessage: "no_trigger_element"
		})
	});
}
SearchApiDefinitionTool.prototype.createNavPrevMenu = function() { 

	var me = this;
	this.createSearchEngineSubMenu({
		id: 'ways-extract-prev-page', 
		label: this.locale('prev_page'),
		callback: me.buildStoreSearchElementMessage({
			expectedTypes: ["a", "button"],
			storeAs: "prev",
			errorMessage: "no_trigger_element"
		})
	});
}
SearchApiDefinitionTool.prototype.createResultMenu = function() { 

	var me = this;
	this.createSearchEngineSubMenu({
		id: 'ways-extract-search-result', 
		label: this.locale('result'),
		expectedTypes: ["input"],
		callback: function(){
			console.log("lala");
		}
	});
}
SearchApiDefinitionTool.prototype.createResultPropertyMenu = function() { 

	var me = this;
	this.createSearchEngineSubMenu({
		id: 'ways-extract-search-result', 
		label: this.locale('result_property'),
		expectedTypes: ["input"],
		callback: function(){
			console.log("lala");
		}
	});
}
SearchApiDefinitionTool.prototype.getElementByType = function(types, element) { 
	//Returns the element matching the type passed as parameter. This is because the user may 
	//have selected the container of, for example, an anchor, and not the anchor itself 

	console.log(types);
	console.log(element.tagName.toLowerCase());
	if(element.tagName && types.indexOf(element.tagName.toLowerCase()) != -1){
		console.log("01");
		return element;
	} 
	else {
		console.log("02");
		for (var i = types.length - 1; i >= 0; i--) {
			var possibleElems = element.getElementsByTagName(types[i]);
			if(possibleElems && possibleElems.length && possibleElems.length > 0)
				return possibleElems[0];
		}
		console.log("03");
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
SearchApiDefinitionTool.prototype.getCurrentWindow = function(){

	return this.nativeApi.utils.getMostRecentBrowserWindow();
}
SearchApiDefinitionTool.prototype.createMenu = function(){

	return this.createContextMenu({
		id: 'ways-search-engine-definition',
		label:this.locale('collect_as_search_engine'), 
		menupopup: this.getCurrentWindow().document.getElementById("contentAreaContextMenu")
	});
}
SearchApiDefinitionTool.prototype.createContextMenu = function(data) { 

	var newmenu;
	var document = this.getCurrentWindow().document;

	if(data.menupopup && data.menupopup != undefined && data.menupopup != null){ //If parent exists

		//Gets the element,if it already exists
		newmenu = document.getElementById(data.id);

		//If the menu doesn't exist,it's created
		if(!newmenu || newmenu == undefined || newmenu == null) {
			newmenu = document.createElement("menu"); 
			data.menupopup.appendChild(newmenu);
		}
		//Removes previous data and load the new one
		newmenu.innerHTML = "";
		newmenu.setAttribute("id", data.id);
		newmenu.id = data.id;
		newmenu.setAttribute("label", data.label);
		if(data.callback) newmenu.onclick = data.callback;	
	}
	return newmenu;
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

    var item;
    var document = this.getCurrentWindow().document;

    //Gets the element,if it already exists
    item = document.getElementById(data.id);

    //If the menu doesn't exist,it's created
    if(item == undefined) {
        //Creates the element
        item = document.createElement("menuitem");
        item.setAttribute("id", data.id);

        var popup = this.getMenupopup(this.menu, document);
        popup.appendChild(item);
    }

    //No matter if the item already exists or it was just created, we clear it and update the data (also useful if the user changes the language)
    item.setAttribute("label", data.label);
    if(data.callback) item.onclick = data.callback;

    return item;
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
SearchApiDefinitionTool.prototype.getContentAreaContextMenu = function(){

	return this.getCurrentWindow().document.getElementById("contentAreaContextMenu");
}
SearchApiDefinitionTool.prototype.loadPopupEvents = function(){

	this.unloadPopupEvents();
	var man = this;
	this.searchDefListener = function(e) {

		//just collect when the click menu is in the second level
		if(e.eventPhase != 2) return;

		if(e.shiftKey){
			man.selectedDomElement = e.target.triggerNode.parentElement;
		} 
		else{ 
			man.selectedDomElement = e.target.triggerNode; 
		}

	};
	this.getContentAreaContextMenu().addEventListener("popupshowing", this.searchDefListener, false);
}
SearchApiDefinitionTool.prototype.unloadPopupEvents = function(){

	this.getContentAreaContextMenu().removeEventListener("popupshowing", this.searchDefListener, false);
}

exports.getInstance = function(localeBundle, nativeApi) {
    return new SearchApiDefinitionTool(localeBundle, nativeApi);
}