//This class should be clonnable (do not use prototype). 
//Moreover, you shoult not implement it using the "class" way, otherwise you will have to implement 
//the behaviour for controlling what's have been loaded on each tab, the listeners for reloading, and 
//all the stuff mentioned in the BackgroundResourcesLoader.js file

function ContentResourcesLoader(){
	this.syncLoadScripts = function(filePaths, doc, callback) {

		var me=this, path = filePaths.splice(0, 1)[0];
		if(path){

			var script = doc.createElement('script');
			script.onload = function() {

			  me.syncLoadScripts(filePaths, doc, callback);
			};
			doc.getElementsByTagName('head')[0].appendChild(script);
			console.log("loading ", path);
			script.src = browser.extension.getURL(path);

		}else{
			if(callback) callback();
		}		
	};
	this.syncLoadStyles = function(filePaths, doc, callback){
		for (var i = filePaths.length - 1; i >= 0; i--) {

			var link = doc.createElement('link');	
			link.href = browser.extension.getURL(filePaths[i]);
			link.rel="stylesheet";
			link.type="text/css";
			doc.getElementsByTagName('head')[0].appendChild(link);
		}

		if(callback) callback();
	};
}