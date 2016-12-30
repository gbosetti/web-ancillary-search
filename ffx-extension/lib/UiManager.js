var tabs = require("sdk/tabs");

function UiManager(){}
UiManager.prototype.initializeComponents = function(locale, ui){
	this.locale = locale; 
	this.ui = ui;
	this.definePopupListener();
	this.loadPopupEvents();
	this.selectedDomElement;
}
UiManager.prototype.getSelectedDomElement = function(){
	return this.selectedDomElement;
}
UiManager.prototype.getSelectedText = function(){
	return this.selectedText;
}
UiManager.prototype.definePopupListener = function(){

	var me = this;
	this.popupListener = function(e) {

		//just collect when the click menu is in the second level
		if(e.eventPhase != 2) return;

		//Get selection
		me.selectedText = me.getCurrentWindow().content.getSelection().toString();

		//Get Dom element
		if(e.shiftKey){
			me.selectedDomElement = e.target.triggerNode.parentElement;
		} 
		else{ 
			me.selectedDomElement = e.target.triggerNode; 
		}
	};
}
/*UiManager.prototype.getExtensionMenupopup = function(){

	var menuId = "waysAreaContextMenu";
	var document = this.getCurrentWindow().document;
	var extensionMenupopup = document.getElementById(menuId);

	console.log(extensionMenupopup)
	if(extensionMenupopup){
		console.log("returning");
		return extensionMenupopup;
	}

	var commonMenupopup = this.getCurrentWindow().document.getElementById("contentAreaContextMenu");
	
	extensionMenupopup = document.createElement("menupopup");
	extensionMenupopup.setAttribute("id", menuId);
	extensionMenupopup.id = menuId;

    commonMenupopup.appendChild(extensionMenupopup);
    
    return extensionMenupopup;
}*/
UiManager.prototype.getContentAreaContextMenu = function(){

	return this.getCurrentWindow().document.getElementById("contentAreaContextMenu");
}
UiManager.prototype.getCurrentWindow = function(){

	return this.ui.utils.getMostRecentBrowserWindow();
}
UiManager.prototype.loadPopupEvents = function(){

	this.unloadPopupEvents();
	this.getContentAreaContextMenu().addEventListener("popupshowing", this.popupListener, false);
}
UiManager.prototype.unloadPopupEvents = function(){

	this.getContentAreaContextMenu().removeEventListener("popupshowing", this.popupListener, false);
}
/*UiManager.prototype.createContextMenuSeparator = function(id, menupopup) { 
	var separator;
	var document = this.getCurrentWindow().document;

	console.log(menupopup);
	if(menupopup && menupopup != undefined && menupopup != null){ //If parent exists

		//Gets the element,if it already exists, and remove it (so if there is any change, it will be replaced)
		separator = document.getElementById(id);
		separator.remove();
		//Create it
		separator = document.createElement("menuseparator"); 
		menupopup.appendChild(separator);
		separator.setAttribute("id", id);
		separator.id = id;
	}
	return separator;
}*/
UiManager.prototype.createContextMenu = function(data) { 

	var newmenu;
	var document = this.getCurrentWindow().document;

	if(data.menupopup && data.menupopup != undefined && data.menupopup != null){ //If parent exists

		//Gets the element,if it already exists
		newmenu = document.getElementById(data.id);

		//If the menu doesn't exist,it's created
		if(!newmenu || newmenu == undefined || newmenu == null) {
			newmenu = document.createElement("menu"); 
			//data.menupopup.appendChild(newmenu);
			data.menupopup.insertBefore(newmenu, data.menupopup.firstChild);
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
UiManager.prototype.createContextSubMenu = function(data) {

    var item;
    var document = this.getCurrentWindow().document;

    //Gets the element,if it already exists
    item = document.getElementById(data.id);

    //If the menu doesn't exist,it's created
    if(item == undefined) {
        //Creates the element
        item = document.createElement("menuitem");
        item.setAttribute("id", data.id);

        var popup = this.getMenupopup(data.menu, document);
        popup.appendChild(item);
    }

    //No matter if the item already exists or it was just created, we clear it and update the data (also useful if the user changes the language)
    item.setAttribute("label", data.label);
    return item;
}
UiManager.prototype.getMenupopup = function(elem, document) {

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
UiManager.prototype.attachCssFiles = function(files) {
	
	var { attach } = require('sdk/content/mod');
	var { Style } = require('sdk/stylesheet/style');
	
	for (var i = 0; i < files.length; i++) {
		var style = Style({ uri: files[i] });
		attach(style, tabs.activeTab);
	};
};

exports.getClass = function() {
    return UiManager;
}