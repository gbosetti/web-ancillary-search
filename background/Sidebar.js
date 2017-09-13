function SidebarManager(){
	this.status = {};
	//this.status = 
}
SidebarManager.prototype.toggle = function(tab) { //PUBLIC
	//browser.tabs.sendMessage(tab.id, {call: "toggle"});
	//just trying new stuff
	this.open();
};
SidebarManager.prototype.getStatusForTab = function(tab) {
	if (this.status[tab.id] != undefined)
		return this.status[tab.id];

	this.status[tab.id] = new NoLoadedSidebar(this);
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
		}
	}catch(err){ console.log(err); }	
};
SidebarManager.prototype.close = function() {
	browser.tabs.sendMessage(tab.id, {call: "close"});
};
SidebarManager.prototype.loadInCurrentTab = function() {
	this.status.loadInCurrentTab();
}

function SidebarManagerStatus(context){
	this.open = function(tab){
		this.sendOpenMessage(tab);
	};
	this.sendOpenMessage = function(tab){
		browser.tabs.sendMessage(tab.id, {call: "open"});
	};
}

function LoadedSidebar(context){
	SidebarStatus.call(this, context);
}

function NoLoadedSidebar(context){
	SidebarStatus.call(this, context);

	var status = this;
	this.open = function(tab){
		browser.tabs.executeScript(tab.id, { file: "/content_scripts/sidebar.js"}).then(function () {
	        context.status = new LoadedSidebar(context);
	        status.sendOpenMessage(tab);
	    });
	};
}