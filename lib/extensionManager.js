var utils = require('sdk/window/utils');
var { ActionButton } = require('sdk/ui/button/action');
var { ToggleButton } = require("sdk/ui/button/toggle");
var {Ci, Cu, Cc, CC} = require("chrome");
Cu.import("resource://gre/modules/Services.jsm");
Cu.import("resource://gre/modules/FileUtils.jsm");

function ExtensionManager(locale){

	this.locale = locale;
	this.searchDefinitionTool = require("./searchApiDefinitionTool").getInstance(locale, {utils: utils});

	this.addExtensionButtonInToolbar();
}
ExtensionManager.prototype.addExtensionButtonInToolbar = function(){
	var me = this;
	var toggleWays = ToggleButton({
		id: "toggle-ways-behaviour",
		label: "Enable/disable the WAYS extension",
		icon: "./src/img/icon-16.png",
		onChange: function changed(state) {
			if (state.checked) {
				toggleWays.badge = "✗";
				toggleWays.badgeColor = "gray";
				me.disableHarvestingMode();
			}
			else {
				toggleWays.badge = "✓";
				toggleWays.badgeColor = "#00AAAA";
				me.enableHarvestingMode();
			}
		},
		badge: "✓",
		badgeColor: "#00AAAA"
	});
}
ExtensionManager.prototype.enableHarvestingMode = function() {

	this.searchDefinitionTool.enable();
}
ExtensionManager.prototype.disableHarvestingMode = function() {

	this.searchDefinitionTool.disable();
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

