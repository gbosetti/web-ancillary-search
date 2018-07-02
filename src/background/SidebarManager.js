function SidebarManager(defaultFile, defaultDependencies, listeners){

	console.log("**************\nINSTANCIATING THE SIDEBAR MANAGER\n**************");

	this.defaultFile = defaultFile;
	this.storage = new StorageManager();
	this.defaultDependencies = defaultDependencies;
	this.listeners = [];
	this.addListeners(listeners);
}

SidebarManager.prototype.getServices = function() {
	return this.storage.get();
}

SidebarManager.prototype.setServices = function({services}) {
	return this.storage.set(services);
}

SidebarManager.prototype.addListeners = function(listeners) {

	for (var i = listeners.length - 1; i >= 0; i--) {
		this.addListener(listeners[i]);
	}
}
SidebarManager.prototype.addListener = function(listener) {

	this.listeners.push(listener);
}
SidebarManager.prototype.notifyListeners = function() {

	var me = this;
	this.getCurrentTab(function(tab){
		for (var i = me.listeners.length - 1; i >= 0; i--) {
			me.listeners[i].onSidebarStatusChange(tab);
		}
	});
}
SidebarManager.prototype.onFrameReadyForLoadingUrl = function() {

	//salta a onSidebarStatusChange
	this.loadChromeUrl(this.defaultFile, this.defaultDependencies);
	this.notifyListeners();
}
SidebarManager.prototype.onSidebarClosed = function() {

	this.notifyListeners();
}
SidebarManager.prototype.loadChromeUrl = function(chromeUrl, filePaths) { //PUBLIC

	this.getCurrentTab(function(tab){
		browser.tabs.sendMessage(tab.id, {
			call: "loadUrl",
			args: {
				"url": browser.extension.getURL(chromeUrl),
				"filePaths": filePaths
			}
		});
	});
};
SidebarManager.prototype.onElementSelection = function(data) {

	this.getCurrentTab(function(tab){
		browser.tabs.sendMessage(tab.id, {
			call: "onElementSelection",
			args: data
		});
	});
}
SidebarManager.prototype.onTriggerSelection = function(data) {

  	this.getCurrentTab(function(tab){
		browser.tabs.sendMessage(tab.id, {
			call: "onTriggerSelection",
			args: data
		});
	});
};
SidebarManager.prototype.onResultsContainerSelection = function(data) {

  	this.getCurrentTab(function(tab){
		browser.tabs.sendMessage(tab.id, {
			call: "onResultsContainerSelection",
			args: data
		});
	});
};
SidebarManager.prototype.toggleSidebar = function(callback) { //PUBLIC

	var me = this;
	this.getCurrentTab(function(tab){
		browser.tabs.sendMessage(tab.id, {call: "toggle"});
		if(callback) callback(tab);
	});
};
SidebarManager.prototype.adaptPlaceholder = function(tab, data) {

	data.domainName = tab.url.split(".")[1];

	browser.tabs.sendMessage(tab.id, {
		call: data.callback,
		args: data
	});
};
SidebarManager.prototype.open = function() {

	var me = this;
	this.getCurrentTab(function(tab){
		browser.tabs.sendMessage(tab.id, {call: "open"});
	});
};
SidebarManager.prototype.getCurrentTab = function(callback) {

	try{
		browser.tabs.query({active: true, currentWindow: true}).then((tabs) => {
			callback(tabs[0]);
		});
	}catch(err){ console.log(err); }
};
SidebarManager.prototype.close = function() {
	var me = this;
	this.getCurrentTab(function(tab){
		browser.tabs.sendMessage(tab.id, {call: "close"});
	});
};
