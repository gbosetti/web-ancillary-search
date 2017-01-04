var utils = require('sdk/window/utils');
var { ActionButton } = require('sdk/ui/button/action');
var { ToggleButton } = require("sdk/ui/button/toggle");
var {Ci, Cu, Cc, CC} = require("chrome");
Cu.import("resource://gre/modules/Services.jsm");
Cu.import("resource://gre/modules/FileUtils.jsm");

var UiManager = require("./UiManager").getClass();

function ExtensionManager(locale){

	this.initializeComponents(locale, {utils: utils});

	//var menupopup = this.getContentAreaContextMenu();
	//this.initExtensionMenupopup();
	//this.createContextMenuSeparator('ways-cm-top-separator', menupopup);
	this.searchTool = require("./searchTool").getInstance(locale, {utils: utils});
	this.searchApiDefinitionTool = require("./searchApiDefinitionTool").getInstance(locale, {utils: utils});
	
	//this.createContextMenuSeparator('ways-cm-bottom-separator', menupopup);

	this.addExtensionButtonInToolbar();
}
ExtensionManager.prototype = new UiManager();
ExtensionManager.prototype.addExtensionButtonInToolbar = function(){
	var me = this;
	var toggleWays = ToggleButton({
		id: "toggle-ways-behaviour",
		label: "Enable/disable the Web Ancillary Search",
		icon: "./src/img/icon-16.png",
		onChange: function changed(state) {
			if (state.checked) {
				toggleWays.badge = "✗";
				toggleWays.badgeColor = "gray";
				me.disableExtensionBehaviour();
			}
			else {
				toggleWays.badge = "✓";
				toggleWays.badgeColor = "#00AAAA";
				me.enableExtensionBehaviour();
			}
		},
		badge: "✓",
		badgeColor: "#00AAAA"
	});
}
ExtensionManager.prototype.enableExtensionBehaviour = function() {

	this.searchApiDefinitionTool.enable();
	this.searchTool.enable();
}
ExtensionManager.prototype.disableExtensionBehaviour = function() {

	this.searchApiDefinitionTool.disable();
	this.searchTool.disable();
}
ExtensionManager.prototype.askUserToKeepDatabase = function(){

	let file = FileUtils.getFile("ProfD", [
		"jetpack", "ways@lifia.info.unlp.edu.ar", "ways.sqlite"]);

	if(file.exists()){
		if(!utils.getMostRecentBrowserWindow().confirm(this.locale('keep_extension_database'))){
			file.remove(0);
		} else console.log("You didn't remove the database");
	}
}
ExtensionManager.prototype.devMode = function(){
	var button = ActionButton({
        id: 'woa-console',
        label: 'Open console',
        badge: 'dev',
        badgeColor: 'black',
        icon:'./src/img/icon-16.png',
        onClick: function(){
        	utils.getMostRecentBrowserWindow().document.getElementById('menu_browserConsole').doCommand();
        }
    });
}

exports.getInstance = function(localeBundle) {
    return new ExtensionManager(localeBundle);
}

