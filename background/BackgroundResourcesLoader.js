function BackgroundResourcesLoader(){}
BackgroundResourcesLoader.syncLoadScripts = function(filePaths, tab, callback) {

	var me = this, path = filePaths.splice(0, 1)[0];
	if(path){
		browser.tabs.executeScript(tab.id, { file: path /*, allFrames: true*/ }).then(function(){
			me.syncLoadScripts(filePaths, tab, callback);
		});
	}else{
		if(callback) callback();
	}	
};
BackgroundResourcesLoader.syncLoadStyles = function(filePaths, tab, callback) {

	//TO MERGE 
};