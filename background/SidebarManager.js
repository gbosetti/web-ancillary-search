function SidebarManager(){
	this.status = {};
}
SidebarManager.prototype.onFrameReadyForLoadingUrl = function() { 

	this.loadChromeUrl("/content_scripts/sidebar/service-name.html", [
		"/content_scripts/sidebar/lib/js/ui-commons.js",
		"/content_scripts/sidebar/lib/js/service-name.js"
	]); 
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
SidebarManager.prototype.toggle = function() { //PUBLIC

	var me = this;
	this.getCurrentTab(function(tab){
		me.getStatusForTab(tab).toggle(tab);
	});
};
SidebarManager.prototype.adaptPlaceholder = function() {

	this.getCurrentTab(function(tab){
		browser.tabs.sendMessage(tab.id, {
			call: "adaptPlaceholderExample", 
			args: {domainName: tab.url.split(".")[1] }
		});
	});
};
SidebarManager.prototype.getStatusForTab = function(tab) {
	if (this.status[tab.id] == undefined)
		this.status[tab.id] = new NoLoadedSidebar(this);
	
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
	browser.tabs.sendMessage(tab.id, {call: "close"});
};

function SidebarManagerStatus(context){
	this.open = function(tab){
		this.sendOpenMessage(tab);
	};
	this.sendOpenMessage = function(tab){
		browser.tabs.sendMessage(tab.id, {call: "open"});
	};
	this.toggle = function(tab){};
}

function LoadedSidebar(context){
	SidebarManagerStatus.call(this, context);
	this.toggle = function(tab){
		browser.tabs.sendMessage(tab.id, {call: "toggle"});
	};
}

function NoLoadedSidebar(context){
	SidebarManagerStatus.call(this, context);

	var status = this;
	this.toggle = function(tab){
		this.open(tab);
	};
	this.open = function(tab){

		BackgroundResourcesLoader.syncLoadScripts([
	  		new BackgroundResource("/content_scripts/ContentResourcesLoader.js"),
	  		new BackgroundResource("/content_scripts/Sidebar.js")
	  	], tab, function () {
	        context.status[tab.id] = new LoadedSidebar(context);
	        status.sendOpenMessage(tab);
	    });
	};
}