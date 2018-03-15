function SidebarManager(defaultFile, defaultDependencies, listeners){

	console.log("**************\nINSTANCIATING THE SIDEBAR MANAGER\n**************");

	this.defaultFile = defaultFile;
	this.defaultDependencies = defaultDependencies;
	this.status = {};
	this.listeners = [];
	this.addListeners(listeners);
}
SidebarManager.prototype.addListeners = function(listeners) { 

	for (var i = listeners.length - 1; i >= 0; i--) {
		this.addListener(listeners[i]);
	}
}
SidebarManager.prototype.initializeStateForTab = function(tabId) { 

	this.status[tabId] = new NoLoadedSidebar(this); 
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

	console.log("***SidebarManager.prototype.onElementSelection");
	console.log(data);
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
		me.getStatusForTab(tab).toggleSidebar(tab, callback);
	});
};
SidebarManager.prototype.adaptPlaceholder = function(tab, data) {

	data.domainName = tab.url.split(".")[1];

	browser.tabs.sendMessage(tab.id, {
		call: data.callback, 
		args: data
	});
};
SidebarManager.prototype.getStatusForTab = function(tab) {

	//console.log("getting current tab's status", this.status[tab.id]);
	if (this.status[tab.id] == undefined)
		this.initializeStateForTab(tab.id);
	
	return this.status[tab.id];
};
SidebarManager.prototype.open = function() {

	var me = this;
	this.getCurrentTab(function(tab){
		me.getStatusForTab(tab).open(tab);
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
		me.getStatusForTab(tab).close(tab);
	});
};

//El estado sirve para diferenciar cuando se ha cargado los scripts necesarios en el contexto de la página y cuándo no. Hayq ue prevenir cargarlos dos veces.
function SidebarManagerStatus(context){
	this.open = function(tab){ console.log("---SC > open"); };
	this.close = function(tab){	console.log("---SC > close"); };
	this.toggleSidebar = function(tab, callback){ console.log("---SC > toggle"); };
}




function LoadedSidebar(context){ // SUPERCLASS
	SidebarManagerStatus.call(this, context);
	this.toggleSidebar = function(tab, callback){

		console.log("---LoadedSidebar > toggle");
		browser.tabs.sendMessage(tab.id, {call: "toggle"});
		if(callback) callback(tab);
	};
	this.open = function(tab){
		console.log("---LoadedSidebar > open");
		browser.tabs.sendMessage(tab.id, {call: "toggle"});
	};
	this.close = function(tab){
		console.log("---LoadedSidebar > close");
		browser.tabs.sendMessage(tab.id, {call: "close"});
	}
}




function NoLoadedSidebar(context){
	SidebarManagerStatus.call(this, context);

	var status = this;
	this.toggleSidebar = function(tab, callback){
		console.log("---NoLoadedSidebar > toggle");

		context.status[tab.id] = new LoadedSidebar(context);

	    browser.tabs.sendMessage(tab.id, {call: "toggle"});
		if(callback) callback(tab);
	};
}