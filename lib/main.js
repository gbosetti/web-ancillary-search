var locale = require("sdk/l10n").get;
var extension = require("./extensionManager").getInstance(locale);
	//extension.devMode();

exports.onUnload = function (reason) {
	if(reason == 'uninstall' || reason == 'upgrade' || reason == 'downgrade'){
		extension.askUserToKeepDatabase();
	}
};