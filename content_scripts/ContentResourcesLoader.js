class ContentResourcesLoader{
	static syncLoadScripts(filePaths, doc, callback) {

		var me=this, path = filePaths.splice(0, 1)[0];
		if(path){

			var script = doc.createElement('script');
			script.onload = function() {
			  me.syncLoadScripts(filePaths, doc, callback);
			};
			doc.getElementsByTagName('head')[0].appendChild(script);
			script.src = browser.extension.getURL(path);

		}else{
			if(callback) callback();
		}		
	}
}