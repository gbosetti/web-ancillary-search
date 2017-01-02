var UiManager = require("./UiManager").getClass();
var {Ci, Cu, Cc, CC} = require("chrome");

function SearchTool(locale, ui){

	this.initializeComponents(locale, ui);
	this.searchQuery;
	this.initContextMenus();
}
SearchTool.prototype = new UiManager();
SearchTool.prototype.definePopupListener = function(){

	var me = this;
	this.popupListener = function(e) {

		//Hide the menuitem and
		me.hideContextMenu();

		//just show it when some text is selected
		var selectedText = me.getCurrentWindow().content.getSelection().toString();
		if(selectedText) {
			me.showContextMenu(selectedText);
			me.selectedText = selectedText;
		}
	};
}
SearchTool.prototype.initContextMenus = function() { 

	this.menu = this.createMenu();
	this.createCustomSearchMenus();

	this.hideContextMenu();
}
SearchTool.prototype.createResultsBox = function(unwrappedWindow, title){

	//CONTAINER
	var resultsBox = unwrappedWindow.document.createElement("div");
		resultsBox.style.width = "500px";
		resultsBox.style.height = "400px";
		resultsBox.style.zIndex = "2147483647";
		resultsBox.style["box-sizing"] = "border-box";
		resultsBox.style["font-family"] = ",Arial,sans-serif";
		resultsBox.style["font-size"] = "16px";
		resultsBox.style["line-height"] = "24px";
		resultsBox.style["margin-bottom"] = "30px";
		resultsBox.style["margin-left"] = "0px";
		resultsBox.style["margin-right"] = "0px";
		resultsBox.style["margin-top"] = "30px";
		resultsBox.style["max-width"] = "600px";
		resultsBox.style["position"] = "relative";
		resultsBox.style["width"] = "456px";
		resultsBox.style.border = "1px solid rgba(0, 0, 0, 0.2)";
		resultsBox.style["border-radius"] = "5px 5px 0px 0px";
		resultsBox.style["position"] = "fixed";

		var w = Math.max(unwrappedWindow.document.documentElement.clientWidth, unwrappedWindow.innerWidth || 0);
		var h = Math.max(unwrappedWindow.document.documentElement.clientHeight, unwrappedWindow.innerHeight || 0);
		resultsBox.style["top"] = ((h/2) - 200) + "px";
		resultsBox.style["left"] = ((w/2) - 250) + "px";

		resultsBox.appendChild(this.createResultsBoxHeader(unwrappedWindow, title));
		resultsBox.appendChild(this.createResultsBoxBody(unwrappedWindow));
	return resultsBox;
}
SearchTool.prototype.createResultsBoxHeader = function(unwrappedWindow, title){

	var resultsHeader = unwrappedWindow.document.createElement("div");
		resultsHeader.innerHTML = title;
		resultsHeader.style["color"] = "white";
		resultsHeader.style.backgroundColor = "#337AB7";
		resultsHeader.style["border-bottom-color"] = "rgb(229, 229, 229)";
		resultsHeader.style["border-bottom-style"] = "solid";
		resultsHeader.style["border-bottom-width"] = "1px";
		resultsHeader.style["box-sizing"] = "border-box";
		resultsHeader.style["font-family"] = "Arial,sans-serif";
		resultsHeader.style["font-size"] = " 16px";
		resultsHeader.style["font-weight"] = "bold";
		resultsHeader.style["line-height"] = " 24px";
		resultsHeader.style["padding"] = "15px";
		resultsHeader.style["border-radius"] = "5px 5px 0px 0px";

	var closeButton = unwrappedWindow.document.createElement("span");
		closeButton.innerHTML = "✕";
		closeButton.style["background-color"] = "rgba(0, 0, 0, 0.15)";
		closeButton.style["border-radius"] = "4px";
		closeButton.style["box-sizing"] = "border-box";
		closeButton.style["color"] = "rgb(255, 255, 255)";
		closeButton.style["display"] = "block";
		closeButton.style["floatrightfont-family"] = "Helvetica,Arial,sans-serif";
		closeButton.style["font-size"] = "25px";
		closeButton.style["line-height"] = "21.4333px";
		closeButton.style["margin-right"] = "-12px";
		closeButton.style["margin-top"] = "-5px";
		closeButton.style["padding-bottom"] = "6px";
		closeButton.style["width"] = "22px";
		closeButton.style["float"] = "right";
		closeButton.onclick = function(){
			resultsHeader.parentElement.remove();
		}
		resultsHeader.appendChild(closeButton);
		
	return resultsHeader;
}
SearchTool.prototype.createResultsBoxBody = function(unwrappedWindow){
	var resultsBody = unwrappedWindow.document.createElement("div");
		resultsBody.style["background-color"] = "#337ab7";
		resultsBody.style["width"] = "100%"; 
    	resultsBody.style["text-align"] = "center"; 	
    	return resultsBody;
}
SearchTool.prototype.createSpecializedVisualizationBox = function(unwrappedWindow){

	var iframe = unwrappedWindow.document.createElement('iframe');
		iframe.style.width = "99%";
		iframe.style.height = "340px";
	
	return iframe;
}
SearchTool.prototype.loadSpecializedVisualization = function(iframe){

	var Request = require("sdk/request").Request;
	var me = this;
	var latestTweetRequest = Request({
		url: require("sdk/self").data.url("./visualization.html"),
		onComplete: function (response) {

			iframe.contentWindow.document.open('text/html', 'replace');
			iframe.contentWindow.document.write(response.text);
			iframe.contentWindow.document.close();

			me.loadCssLIntoFrame(iframe, require("sdk/self").data.url("./src/css/visualization.css")); 
			me.loadCssLIntoFrame(iframe, require("sdk/self").data.url("./lib/css/jquery.dataTables.min.css")); 
			me.loadCssLIntoFrame(iframe, require("sdk/self").data.url("./lib/css/responsive.dataTables.min.css"));
			me.loadCssLIntoFrame(iframe, require("sdk/self").data.url("./lib/css/bootstrap.min.css"));
			
			me.loadJsLIntoFrame(
				iframe, 
				require("sdk/self").data.url("./lib/js/jquery-1.12.4.min.js"),
				function(){
					me.loadJsLIntoFrame(
						iframe, 
						require("sdk/self").data.url("./lib/js/bootstrap.min.js")
					);
					me.loadJsLIntoFrame(
						iframe, 
						require("sdk/self").data.url("./lib/js/jquery.dataTables.min.js"),
						function(){
							me.loadJsLIntoFrame(
								iframe, 
								require("sdk/self").data.url("./lib/js/dataTables.responsive.min.js"),
								function(){ 
									me.loadJsLIntoFrame(
										iframe, 
										require("sdk/self").data.url("./src/js/visualization.js")
									);
								}
							);
						}
					);
				}
			);		
		}
	}).get();
}
SearchTool.prototype.loadJsLIntoFrame = function(iframe, url, callback){

	var jsScript = iframe.contentWindow.document.createElement("script") 
		jsScript.type = "text/javascript";
		jsScript.src = url;
		jsScript.onload = function(){
	    	console.log("already loaded: " + url);
	    	if(callback) callback();
	    };

	iframe.contentWindow.document.head.appendChild(jsScript);
}
SearchTool.prototype.loadCssLIntoFrame = function(iframe, url){

	var cssLink = iframe.contentWindow.document.createElement("link"); 
		cssLink.href = url; 
		cssLink.rel = "stylesheet"; 
		cssLink.type = "text/css"; 
	iframe.contentWindow.document.head.appendChild(cssLink);
}
SearchTool.prototype.createCustomSearchMenus = function(){

	var theMenu = this.menu;
	var me = this;
	return this.createContextSubMenu({
		id: "p-12-news", 
		label: "Página 12", 
		menu: theMenu,
		callback: function(){

			var win = require('sdk/window/utils').getMostRecentBrowserWindow();
			var unwrappedWindow = win.content.wrappedJSObject;
			
			var resultsBox = me.createResultsBox(unwrappedWindow, 
				"Results from «" + this.label + "» for «" + me.selectedText + "»");

			unwrappedWindow.document.body.appendChild(resultsBox);  
			unwrappedWindow["$"](resultsBox).draggable();

			//IFRAME
			var iframe = me.createSpecializedVisualizationBox(unwrappedWindow);
    		resultsBox.childNodes[1].appendChild(iframe);
    		me.loadSpecializedVisualization(iframe);
		}
	});
}
SearchTool.prototype.createMenu = function(){

	return this.createContextMenu({
		id: "ways-perform-search",
		label:this.locale("perform_search", " "), 
		menupopup: this.getContentAreaContextMenu()
	});
}
SearchTool.prototype.disable = function() {
	
	this.hideContextMenu();
	this.unloadPopupEvents();
};
SearchTool.prototype.hideContextMenu = function(childNodes){

	this.menu.style.visibility = "hidden";
	this.menu.style.display = "none";
};
SearchTool.prototype.enable = function() {
	
	this.loadPopupEvents();
	this.loadRequiredLibraries();
};
SearchTool.prototype.loadRequiredLibraries = function() {

	var win = require('sdk/window/utils').getMostRecentBrowserWindow();
	var doc = win.content.document.wrappedJSObject;

	//DO NOT USE CDN HERE!!!
	this.loadScript(
		require("sdk/self").data.url("./lib/js/jquery-1.12.4.min.js"), doc, 
		"$");
	this.loadScript(
		require("sdk/self").data.url("./lib/js/jquery-ui.min.js"), 
		doc);

	//https://code.jquery.com/jquery-1.12.4.min.js
}
SearchTool.prototype.loadScript = function(url, document, varToCheck){

	//ACÁ TENEMOS PROBLEMAS CONSITIOS COMOFACE, PERO PASA EN TWITTER
	//PODRÍA SOLUCIONARSE CAMBIANDO EL $ PARA JQUERY
	if(varToCheck != undefined && document.defaultView[varToCheck] != undefined){
	    return;
	}
	var script = document.createElement("script");
	    script.type = "text/javascript";
	    script.onload = function(){
	    	console.log("ok: " + url);
	    };
	    script.src = url;
	    document.head.appendChild(script);
}
SearchTool.prototype.showContextMenu = function(selectedText){

	this.menu.style.visibility = "visible";
	this.menu.style.display = "";
	this.menu.setAttribute("label", this.locale("perform_search", selectedText));
}


exports.getInstance = function(localeBundle, nativeApi) {
    return new SearchTool(localeBundle, nativeApi);
}