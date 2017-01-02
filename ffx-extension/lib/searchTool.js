var UiManager = require("./UiManager").getClass();

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
	var latestTweetRequest = Request({
		url: require("sdk/self").data.url("./visualization.html"),
		onComplete: function (response) {

			iframe.contentWindow.document.open('text/html', 'replace');
			iframe.contentWindow.document.write(response.text);
			iframe.contentWindow.document.close();

			var cssLink = iframe.contentWindow.document.createElement("link") 
				cssLink.href = require("sdk/self").data.url("./src/css/visualization.css"); 
				cssLink.rel = "stylesheet"; 
				cssLink.type = "text/css"; 
			iframe.contentWindow.document.head.appendChild(cssLink);

			var jsScript = iframe.contentWindow.document.createElement("script") 
				jsScript.type = "text/javascript";
				jsScript.src = require("sdk/self").data.url("./src/js/visualization.js");
			iframe.contentWindow.document.head.appendChild(jsScript);
		}
	}).get();
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
	this.loadScript("https://code.jquery.com/jquery-1.12.4.min.js", doc, function(){console.log("loaded jq")});
	this.loadScript("https://code.jquery.com/ui/1.12.1/jquery-ui.min.js", doc, function(){console.log("loaded ui")});

	console.log(doc.defaultView);
	console.log("attaching files 2");
	//https://code.jquery.com/jquery-1.12.4.min.js
}
SearchTool.prototype.loadScript = function(url, document, callback){

    var script = document.createElement("script");
    script.type = "text/javascript";
    script.onload = function(){
    	console.log("loaded: " + url)
        callback();
    };

    script.src = url;
    document.getElementsByTagName("head")[0].appendChild(script);
}
SearchTool.prototype.loadJS = function(filename, document) {
    // DOM: Create the script element
    var jsElm = document.createElement("script");
    // set the type attribute
    jsElm.type = "application/javascript";
    // make the script element load file
    jsElm.src = filename;
    // finally insert the element to the body element in order to load the script
    document.body.appendChild(jsElm);
}
SearchTool.prototype.showContextMenu = function(selectedText){

	this.menu.style.visibility = "visible";
	this.menu.style.display = "";
	this.menu.setAttribute("label", this.locale("perform_search", selectedText));
}


exports.getInstance = function(localeBundle, nativeApi) {
    return new SearchTool(localeBundle, nativeApi);
}