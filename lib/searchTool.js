var UiManager = require("./UiManager").getClass();
var {Ci, Cu, Cc, CC} = require("chrome");
var SDK = {
	data: require("sdk/self").data,
	utils: require('sdk/window/utils'),
	pworker: require("sdk/page-worker"),
	Request: require("sdk/request").Request,
	NsIDomParser: Cc["@mozilla.org/xmlextras/domparser;1"].createInstance(Ci.nsIDOMParser)
};

function SearchTool(locale, ui){

	this.initializeComponents(locale, ui);
	this.searchQuery;
	this.initContextMenus();
	this.logs = [];
}
SearchTool.prototype = new UiManager();
SearchTool.prototype.definePopupListener = function(){

	var me = this;
	this.popupListener = function(e) {

		//var selectedText = e.target.triggerNode.ownerDocument.defaultView.content.wrappedJSObject.getSelection().toString();
		
		if(e.target.triggerNode.ownerDocument.defaultView.frameElement){
			me.selectedText = e.target.triggerNode.ownerDocument.defaultView.frameElement.contentWindow.wrappedJSObject.getSelection().toString();
		}
		else{
			me.selectedText = me.getCurrentWindow().content.getSelection().toString();
		}
		//Hide the menuitem and
		me.hideContextMenu();

		//just show it when some text is selected
		
		if(me.selectedText) {
			me.showContextMenu(me.selectedText);
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
		resultsBox.style.width = "490px";
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
		resultsBox.style["position"] = "relative";
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

	var me = this;
	var latestTweetRequest = SDK.Request({
		url: SDK.data.url("./visualization.html"),
		onComplete: function (response) {

			iframe.contentWindow.document.open('text/html', 'replace');
			iframe.contentWindow.document.write(response.text);
			iframe.contentWindow.document.close();

			me.loadCssLIntoFrame(iframe, SDK.data.url("./src/css/visualization.css")); 
			me.loadCssLIntoFrame(iframe, SDK.data.url("./lib/css/jquery.dataTables.min.css")); 
			me.loadCssLIntoFrame(iframe, SDK.data.url("./lib/css/responsive.dataTables.min.css"));
			me.loadCssLIntoFrame(iframe, SDK.data.url("./lib/css/bootstrap.min.css"));
			
			//Files are loaded as callback for ensurig their order and loading
			me.loadJsLIntoFrame(
				iframe, 
				SDK.data.url("./lib/js/jquery-1.12.4.min.js"),
				function(){
					me.loadJsLIntoFrame(
						iframe, 
						SDK.data.url("./lib/js/bootstrap.min.js")
					);
					me.loadJsLIntoFrame(
						iframe, 
						SDK.data.url("./lib/js/jquery.dataTables.min.js"),
						function(){
							me.loadJsLIntoFrame(
								iframe, 
								SDK.data.url("./lib/js/dataTables.responsive.min.js"),
								function(){ 

									//Set the data into the window
									me.getDataForVisualization(iframe, function(data){
										//WE LOAD THE REMAINING AS CALLBACK
										iframe.contentWindow["ancillaryDataSet"] = Cu.cloneInto( 
											data.results, 
											iframe.contentWindow, 
											{ cloneFunctions: true }
								        );

								        iframe.contentWindow["ancillaryColDefs"] = Cu.cloneInto( 
											data.colsDef, 
											iframe.contentWindow, 
											{ cloneFunctions: true }
								        );

										//call visualization script
										me.loadJsLIntoFrame(
											iframe, 
											SDK.data.url("./src/js/visualization.js")
										);
									});
								}
							);
						}
					);
				}
			);		
		}
	}).get();
}
SearchTool.prototype.showLoadingMessage = function(msg, iframe){

	var msgElem = iframe.contentWindow.document.getElementById("loading-message");
	msgElem.innerHTML = msg;
}
SearchTool.prototype.hideLoadingMessage = function(iframe){

	iframe.contentWindow.document.getElementById("loading").remove();
}
SearchTool.prototype.logAction = function(msg){
	//This format is easy to copy-pastein in a spreadsheet
	this.logs.push(new Date().toTimeString().substring(0,8) + "; " + msg);
	/*{
		"time": new Date().toTimeString().substring(0,8),
		"desc": msg
	}*/
}
SearchTool.prototype.saveIntoFile = function(filename, textContent) {

	var win = SDK.utils.getMostRecentBrowserWindow();
	var pom = win.content.document.createElement('a');
        pom.setAttribute('href', 'data:text/xml;charset=utf-8,' + 
        	win.encodeURIComponent(textContent));
        pom.setAttribute('download', filename);

    var event = win.content.document.createEvent('MouseEvents');
    event.initEvent('click', true, true);
    pom.dispatchEvent(event);
}
SearchTool.prototype.getDataForVisualization = function(iframe, callback){

	//01 Loading the page
	var me = this;
	me.logAction("[02][end] loading the popup");
	me.logAction("[03][start] loading the search form");
	this.pageWorker = SDK.pworker.Page({
		contentScriptFile: SDK.data.url("./src/js/externalPageForSearchEngine.js"),
		contentURL: this.currentApiCog.url,
		contentScriptWhen: this.currentApiCog.contentScriptWhen 
	});

	//LASTTTTT
	me.pageWorker.port.on("notifyDomForResultsExtraction", function(res){
		
		me.logAction("[08][end] Retrieving the DOM with results");
		me.logAction("[09][start] Parsing the DOM");

		me.showLoadingMessage("Extracting results...", iframe);
		var domForResults = SDK.NsIDomParser.parseFromString(res.textContent, "text/html"); //.wrappedJSObject;
		//console.log(domForResults);
		me.logAction("[10][end] Parsing the DOM");
		me.logAction("[11][start] Extracting results");
		var data = {
			results: new IOExtractor(domForResults).extractDataForDatatable(me.currentApiCog.results),
			colsDef: me.currentApiCog.visualization.colsDef
		}
		me.logAction("[12][end] Extracting results");
		me.logAction("[13][start] Visualizing results");
		callback(data);
		me.hideLoadingMessage(iframe);
		me.logAction("[14][end] Visualizing results");
		me.logAction(me.currentApiCog.loadingResStrategy);

		console.log(me.currentApiCog.name); 
		console.log(JSON.stringify(me.logs, null, 2));
		//me.saveIntoFile(me.currentApiCog.name + "_log.json", JSON.stringify(me.logs, null, 2));
	});
	me.pageWorker.port.on("resultsAreAvailable", function(data){
		
		me.logAction("[06][end] Detecting UI cmponents & executing the query");
		me.logAction("[07][start] Retrieving the DOM with results");
		//me.logAction("Retrieving the new DOM");
		me.showLoadingMessage("Retrieving the new DOM...", iframe);
		//Se extraen los resultados
		me.pageWorker.port.emit("getDomForResultsExtraction");
	});

	//02 executing search (first time an url is loaded)
	var executingSearch = function(){

		me.pageWorker.port.removeListener("externalPageIsLoaded", executingSearch);

		me.logAction("[04][end] loading the search form");
		me.logAction("[05][start] Detecting UI cmponents & executing the query");

		me.showLoadingMessage("Detecting UI cmponents...", iframe);
		//Se tiene acceso a los controles y se hace la búsqueda

		//Se suscbrine a otro
		//HERE we can have probles if thre is somefunction, it will be prevented. So you need to clone it or remove functions in the json
		me.pageWorker.port.emit("searchNewInstances", me.currentApiCog);

		me.showLoadingMessage("Executing the query...", iframe);
		//Se desvincula el listener
	};

	me.showLoadingMessage("Loading search engine...", iframe);
	this.pageWorker.port.on("externalPageIsLoaded", executingSearch);
}
SearchTool.prototype.loadJsLIntoFrame = function(iframe, url, callback){

	var jsScript = iframe.contentWindow.document.createElement("script") 
		jsScript.type = "text/javascript";
		jsScript.src = url;
		jsScript.onload = function(){
	    	//console.log("already loaded: " + url);
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
SearchTool.prototype.getServiceSpecsFromFiles = function(){

	var files = new FilesManager().readFilesFromDir("WebAncillarySearchServices");
	var specs = new Array();
	console.log(files);

	if(files){
		for (var i = 0; i < files.length; i++) {
			//specs.push(files[i].getName()));
		};
	}

	return specs;
}
SearchTool.prototype.getGoogleApi = function() {

	return {
		name:'Google',
		url:'https://www.google.com.ar/#q=x',
		keywords:'',
		loadingResStrategy: "WriteAndClickForAjaxCall", 
		contentScriptWhen: "ready",
		entry:'//form[@action="/search"]/div[2]//input',
		trigger:'//form[@action="/search"]//div/button[@type="submit"]',
		results: {
			name: 'Generics',
			xpath:'//div[@id="search"]/div/div/div/div/div/div',
			properties:[
				{
					name:'Name',
					xpath:'//h3',
					extractor: new SingleNodeExtractor()
				},
				{
					name:'Description', 
					xpath:'/div/div/div/span',
					extractor: new SingleNodeExtractor()
				}
			]
		},
		visualization:{
			colsDef: [{
					title: "Name",
					responsivePriority: 1
				}, {
					title: "Description",
					responsivePriority: 2
				}]
		}
	};
};
SearchTool.prototype.getApiSpecifications = function(){

	//this.getServiceSpecsFromFiles();
	//TODO: load fromfiles ^
		var apiDefinitions = [];
		
		apiDefinitions.push(this.getYoutubeService());
		apiDefinitions.push(this.getYahooService());
		apiDefinitions.push(this.getWordpressService());
		apiDefinitions.push(this.getWikipediaService());
		apiDefinitions.push(this.getVKService());
		apiDefinitions.push(this.getTwitterService());
		apiDefinitions.push(this.getTumblrService());
		apiDefinitions.push(this.getRedditService());
		apiDefinitions.push(this.getNetflixService());
		apiDefinitions.push(this.getMicrosoftService());
		apiDefinitions.push(this.getLiveService());
		apiDefinitions.push(this.getLinkedInService());
		apiDefinitions.push(this.getFacebookService());	
		apiDefinitions.push(this.getInstagramService());	
		apiDefinitions.push(this.getGoogleApi());
		//apiDefinitions.push(this.getGoodreadsApi());
		apiDefinitions.push(this.getEBayService());
		//apiDefinitions.push(this.getDBLPApi());
		apiDefinitions.push(this.getBloggerService());
		apiDefinitions.push(this.getBingService());
		apiDefinitions.push(this.getAmazonBooksService());
		apiDefinitions.push(this.getAliexpressService());
		
	return apiDefinitions;
}
SearchTool.prototype.getInstagramService = function() {

	return {
		name:'Instagram',
		url:'https://www.instagram.com/explore/tags/x/',
		keywords:'',
		loadingResStrategy: "WriteForAjaxCall", 
		contentScriptWhen: "ready",
		entry:'//nav//input',
		results: {
			name: 'Pictures',
			xpath:'//span/section/main/article/div/div/div',
			properties:[
				{
					name:'Name',
					xpath:'/a[1]//img', 
					extractor: new SingleNodeExtractor(),
					wrapper: ElemIdWrapper
				},
				{
					name: 'Description',
					xpath: '/a[1]//img',
					extractor: new SingleNodeExtractor(),
					wrapper: ElemAltWrapper
				}
			]
		},
		visualization:{
			colsDef: [{
					title: "Name",
					responsivePriority: 1
				},{
					title: "Description",
					responsivePriority: 1
				}]
		}
	};
};
SearchTool.prototype.getBloggerService = function() {

	return {
		name:'Blogger',
		url:'https://www.blogger.com/blogger.g?blogID=1392705246275834184#allposts',
		keywords:'',
		loadingResStrategy: "WriteForAjaxCall", 
		contentScriptWhen: "end",
		entry:'//input',
		results: {
			name: 'Blog entries',
			xpath:'//div[@class="editPosts"]/table/tbody/tr',
			properties:[
				{
					name:'Name',
					xpath:'/td[2]/div', 
					extractor: new SingleNodeExtractor()
				},
				{
					name: 'Description',
					xpath: '/td[4]/div',
					extractor: new SingleNodeExtractor()
				}
			]
		},
		visualization:{
			colsDef: [{
					title: "Name",
					responsivePriority: 1
				},{
					title: "Description",
					responsivePriority: 1
				}]
		}
	};
};
SearchTool.prototype.getAliexpressService = function() {

	return {
		name:'Aliexpress',
		url:'https://www.aliexpress.com/wholesale?catId=0&initiative_id=SB_20170108211114&SearchText=x',
		keywords:'',
		loadingResStrategy: "WriteAndClickToReload", 
		contentScriptWhen: "ready",
		entry:'//div[@class="search-key-box"]/input',
		trigger:'//div[@class="searchbar-operate-box"]/input',
		results: {
			name: 'Generics',
			xpath:'//div[@id="main-wrap"]//div[@class="item"]',
			properties:[
				{
					name:'Name',
					xpath:'//h3', 
					extractor: new SingleNodeExtractor()
				},
				{
					name: 'Description',
					xpath: '//span',
					extractor: new SingleNodeExtractor()
				}
			]
		},
		visualization:{
			colsDef: [{
					title: "Name",
					responsivePriority: 1
				},{
					title: "Description",
					responsivePriority: 1
				}]
		}
	};
};
SearchTool.prototype.getMicrosoftService = function() {

	return {
		name:'Microsoft',
		url:'https://www.microsoft.com/es-ar/search/result.aspx?q=X&form=MSHOME',
		keywords:'',
		loadingResStrategy: "WriteAndClickForAjaxCall", 
		contentScriptWhen: "ready",
		entry:'//form[@id="srv_shellHeaderSearchForm"]/div/input',
		trigger:'//form[@id="srv_shellHeaderSearchForm"]/div/button',
		results: {
			name: 'Downloads',
			xpath:'//div[@id="nav-downloads"]/div/div[2]/div',
			properties:[
				{
					name:'Name',
					xpath:'/h3', 
					extractor: new SingleNodeExtractor()
				},
				{
					name: 'Description',
					xpath: '/p',
					extractor: new SingleNodeExtractor()
				}
			]
		},
		visualization:{
			colsDef: [{
					title: "Name",
					responsivePriority: 1
				},{
					title: "Description",
					responsivePriority: 1
				}]
		}
	};
};
SearchTool.prototype.getWordpressService = function() {

	return {
		name:'Wordpress',
		url:'https://en.search.wordpress.com/?src=organic&q=x',
		keywords:'',
		loadingResStrategy: "WriteAndClickToReload", 
		contentScriptWhen: "ready",
		entry:'//form[@id="search_form"]/input[@id="search_box"]',
		trigger:'//form[@id="search_form"]/input[contains(@class,"search-submit")]',
		results: {
			name: 'Blog entry',
			xpath:'//div[@id="search-results-container"]/div[@class="result "]',
			properties:[
				{
					name:'Name',
					xpath:'//div[contains(@class, "result-title ")]', 
					extractor: new SingleNodeExtractor()
				},
				{
					name: 'Description',
					xpath: '//div[contains(@class, "result-post")]',
					extractor: new SingleNodeExtractor()
				}
			]
		},
		visualization:{
			colsDef: [{
					title: "Name",
					responsivePriority: 1
				},{
					title: "Description",
					responsivePriority: 1
				}]
		}
	};
};
SearchTool.prototype.getNetflixService = function() {

	return {
		name:'Netflix',
		url:'https://dvd.netflix.com/Search?oq=&ac_posn=&v1=x',
		keywords:'',
		loadingResStrategy: "WriteAndClickToReload", 
		contentScriptWhen: "end",
		entry:'//form/input[@id="searchField"]',
		trigger:'//form/button[@name="search_submit"]',
		results: {
			name: 'Generics',
			xpath:'//div[@class="searchResultContainer"]/div[2]/ul/li',
			properties:[
				{
					name:'Name',
					xpath:'/div[2]/h2', 
					extractor: new SingleNodeExtractor()
				},
				{
					name: 'Description',
					xpath: '/div[2]/div[2]',
					extractor: new SingleNodeExtractor()
				}
			]
		},
		visualization:{
			colsDef: [{
					title: "Name",
					responsivePriority: 1
				},{
					title: "Description",
					responsivePriority: 1
				}]
		}
	};
};
SearchTool.prototype.getBingService = function() {

	return {
		name:'Bing',
		url:'http://www.bing.com/search?q=x&go=Rechercher&qs=ds&form=QBRE',
		keywords:'',
		loadingResStrategy: "WriteAndClickToReload", 
		contentScriptWhen: "ready",
		entry:'//form/div/input',
		trigger:'//form/div/input[2]',
		results: {
			name: 'Generics',
			xpath:'//div[@id="b_content"]/ol/li',
			properties:[
				{
					name:'Name',
					xpath:'/div', 
					extractor: new SingleNodeExtractor()
				},
				{
					name: 'Description',
					xpath: '//div[2]/div',
					extractor: new SingleNodeExtractor()
				}
			]
		},
		visualization:{
			colsDef: [{
					title: "Name",
					responsivePriority: 1
				},{
					title: "Description",
					responsivePriority: 1
				}]
		}
	};
};
SearchTool.prototype.getTumblrService = function() {

	return {
		name:'Tumblr',
		url:'https://www.tumblr.com/search/x',
		keywords:'',
		loadingResStrategy: "WriteAndClickForAjaxCall", 
		contentScriptWhen: "end",
		entry:'//form/div/div/input',
		trigger:'//a[contains(@class,"result_link")]',
		results: {
			name: 'Posts',
			xpath:'//div[@id="search_posts"]/article',
			properties:[
				{
					name:'Name',
					xpath:'/header', 
					extractor: new SingleNodeExtractor()
				},
				{
					name: 'Description',
					xpath: '/section',
					extractor: new SingleNodeExtractor()
				}
			]
		},
		visualization:{
			colsDef: [{
					title: "Name",
					responsivePriority: 1
				},{
					title: "Description",
					responsivePriority: 1
				}]
		}
	};
};
SearchTool.prototype.getEBayService = function() {

	return {
		name:'ebay',
		url:'http://www.ebay.com/sch/i.html?_odkw=xm&LH_PrefLoc=3&_sop=15&_osacat=0&_from=R40&_trksid=p2045573.m570.l1313.TR11.TRC2.A0.H0.Xxx.TRS1&_nkw=xx&_sacat=0',
		keywords:'',
		loadingResStrategy: "WriteAndClickToReload", 
		contentScriptWhen: "ready",
		entry:'//form//table//input',
		trigger:'//form//table/tbody/tr/td[3]/input',
		results: {
			name: 'Generics',
			xpath:'//div[@id="ResultSetItems"]/ul/li',
			properties:[
				{
					name:'Name',
					xpath:'//h3', 
					extractor: new SingleNodeExtractor()
				},
				{
					name: 'Description',
					xpath: '//ul',
					extractor: new SingleNodeExtractor()
				}
			]
		},
		visualization:{
			colsDef: [{
					title: "Name",
					responsivePriority: 1
				},{
					title: "Description",
					responsivePriority: 1
				}]
		}
	};
};
SearchTool.prototype.getLinkedInService = function() {

	return {
		name:'LinkedIn',
		url:'https://www.linkedin.com/vsearch/c?type=companies&keywords=X&orig=GLHD&rsid=546073401483899785431&pageKey=voltron_company_search_internal_jsp&trkInfo=&trk=global_header&search=Rechercher',
		keywords:'',
		loadingResStrategy: "WriteAndClickToReload", 
		contentScriptWhen: "ready",
		entry:'//form[@id="global-search"]//input',
		trigger:'//form[@id="global-search"]//button[@class="search-button"]',
		results: {
			name: 'Companies',
			xpath:'//div[@id="results-container"]/ol/li',
			properties:[
				{
					name:'Name',
					xpath:'/div/h3', 
					extractor: new SingleNodeExtractor()
				},
				{
					name: 'Description',
					xpath: '/div/div',
					extractor: new SingleNodeExtractor()
				}
			]
		},
		visualization:{
			colsDef: [{
					title: "Name",
					responsivePriority: 1
				},{
					title: "Description",
					responsivePriority: 1
				}]
		}
	};
};
SearchTool.prototype.getRedditService = function() {

	return {
		name:'Reddit',
		url:'https://www.reddit.com/search?q=x',
		keywords:'',
		loadingResStrategy: "WriteAndClickToReload", 
		contentScriptWhen: "end",
		entry:'//div[@class="content"]//input',
		trigger:'//div[@class="content"]//button',
		results: {
			name: 'Posts',
			xpath:'//div[contains(@class, "listing")][2]/div/div/div',
			properties:[
				{
					name:'Name',
					xpath:'/div/header', 
					extractor: new SingleNodeExtractor()
				},
				{
					name: 'Description',
					xpath: 'div/div[2]',
					extractor: new SingleNodeExtractor()
				}
			]
		},
		visualization:{
			colsDef: [{
					title: "Name",
					responsivePriority: 1
				},{
					title: "Description",
					responsivePriority: 1
				}]
		}
	};
};
SearchTool.prototype.getDBLPApi = function() {
	
	var me = this;

	var renderImage = function(data, type, row) {
	    if(data != null)
	      return "<img src='"+data+"'/>";
	    return "<img src='data:image/png;base64,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'/>";
	}

	return {
		name:'DBLP',
		url:'http://dblp.uni-trier.de/search/publ?q=',
		keywords:'',
		loadingResStrategy: "WriteForAjaxCall", 
		contentScriptWhen: "ready",
		entry:'//form[@id="completesearch-form"]/input',
		results: {
		name: 'Papers',
		xpath:'//ul[@class="publ-list"]//*[contains(@class, "entry")]',
		properties:[
			{
				name:'title',
				xpath:'//span[@class="title"]',
				extractor: new SingleNodeExtractor()
			},
			{
				name:'authors', 
				xpath:'//span[@itemprop="author"]',
				extractor: new MultipleNodesExtractor()
			},
			{
				name: 'year',
				xpath: '//span[@itemprop="datePublished"]',
				extractor: new SingleNodeExtractor()
			},
			{
				name: 'export',
				xpath: '//nav[@class="publ"]/ul/li[2]//img',
				extractor: new SingleNodeExtractor()
			},
			{
				name: 'share',
				xpath: '//nav[@class="publ"]/ul/li[4]//img',
				extractor: new SingleNodeExtractor()
			}
		]
	},
		visualization:{
			colsDef: [{
					title: "Title",
					responsivePriority: 1
				}, {
					title: "Authors",
					responsivePriority: 2
				}, 
				{
					title: "Year",
					responsivePriority: 3,
					className: "tablet-l desktop"
				},
				{
					title: "Export",
					render: renderImage,
					responsivePriority: 4,
					className: "tablet-l desktop"
				},{
					title: "Share",
					orderable: false,
					render: renderImage,
					responsivePriority: 4,
					className: "tablet-l desktop"
				}]
		}
	};
};
SearchTool.prototype.getWikipediaService = function() {

	return {
		name:'Wikipedia',
		url:'https://en.wikipedia.org/w/index.php?title=Special%3ASearch&profile=default&fulltext=Search&search=X',
		keywords:'',
		loadingResStrategy: "WriteAndClickToReload", 
		contentScriptWhen: "ready",
		entry:'//div[@id="searchText"]/input',
		trigger:'//form[@id="search"]//button',
		results: {
			name: 'Articles',
			xpath:'//div[@class="searchresults"]//li',
			properties:[
				{
					name:'Name',
					xpath:'/div/a', 
					extractor: new SingleNodeExtractor()
				},
				{
					name: 'Description',
					xpath: '/div[2]',
					extractor: new SingleNodeExtractor()
				}
			]
		},
		visualization:{
			colsDef: [{
					title: "Name",
					responsivePriority: 1
				},{
					title: "Description",
					responsivePriority: 1
				}]
		}
	};
};
SearchTool.prototype.getFacebookService = function() {

	return {
		name:'Facebook',
		url:'https://web.facebook.com/search/top/?q=Cristina&init=mag_glass&tas=0.33033966632242984&search_first_focus=1483667394129',
		keywords:'',
		loadingResStrategy: "WriteAndClickForAjaxCall", 
		contentScriptWhen: "end",
		entry:'//form//input[@class="inputtext"]',
		trigger:'//form//button[@type="submit"]',
		results: {
			name: 'Generics',
			xpath:'//div[@id="contentArea"]/div/div/div/div/div/div',
			properties:[
				{
					name:'Name',
					xpath:'/div/div/div/div/div/div[2]', 
					extractor: new SingleNodeExtractor()
				},
				{
					name: 'Description',
					xpath: '/div/div/div/div/div[2]',
					extractor: new SingleNodeExtractor()
				}
			]
		},
		visualization:{
			colsDef: [{
					title: "Name",
					responsivePriority: 1
				},{
					title: "Description",
					responsivePriority: 1
				}]
		}
	};
};
SearchTool.prototype.getYahooService = function() {

	return {
		name:'Yahoo',
		url:'https://ar.search.yahoo.com/search;_ylt=AwrSblz0_m5Yg3UA_mur9Qt.;_ylc=X1MDMjExNDcxMzAwMwRfcgMyBGZyA3lmcC10LTcyNgRncHJpZANDM3NZMUVGaVRReWNaVXN1bGZyVEhBBG5fcnNsdAMwBG5fc3VnZwMxMARvcmlnaW4DYXIuc2VhcmNoLnlhaG9vLmNvbQRwb3MDMARwcXN0cgMEcHFzdHJsAwRxc3RybAMzBHF1ZXJ5A3phegR0X3N0bXADMTQ4MzY2OTI0Nw--?p=zaz&fr2=sb-top-ar.search&fr=yfp-t-726',
		keywords:'',
		loadingResStrategy: "WriteAndClickToReload", 
		contentScriptWhen: "ready",
		entry:'//input[@id="yschsp"]',
		trigger:'//form/input[@type="submit"]',
		results: {
			name: 'Generics',
			xpath:'//div[@id="results"]//li',
			properties:[
				{
					name:'Name',
					xpath:'//h3',
					extractor: new SingleNodeExtractor()
				},
				{
					name: 'Description',
					xpath: '/div/div[2]',
					extractor: new SingleNodeExtractor()
				}
			]
		},
		visualization:{
			colsDef: [{
					title: "Name",
					responsivePriority: 1
				},{
					title: "Description",
					responsivePriority: 1
				}]
		}
	};
};
SearchTool.prototype.getGoodreadsApi = function() {

	return {
		name:'GoodReads',
		url:'https://www.goodreads.com/search?q=F',
		keywords:'Ficciones',
		loadingResStrategy: "WriteAndClickToReload", 
		contentScriptWhen: "ready",
		entry:'//input[@id="search_query_main"]',
		trigger:'//input[contains(@class, "searchBox__button")]',
		results: {
			name: 'Books',
			xpath:'//table[contains(@class, "tableList")]/tbody/tr',
			properties:[
				{
					name:'Name',
					xpath:'/td[2]//span',
					extractor: new SingleNodeExtractor()
				},
				{
					name: 'Description',
					xpath: '/td[2]//span[2]',
					extractor: new SingleNodeExtractor()
				}
			]
		},
		visualization:{
			colsDef: [{
					title: "Name",
					responsivePriority: 1
				},{
					title: "Description",
					responsivePriority: 1
				}]
		}
	};
};
SearchTool.prototype.getYoutubeService = function() {

	return {
		name:'Youtube',
		url:'https://www.youtube.com/results?search_query=X',
		keywords:'',
		loadingResStrategy: "WriteAndClickForAjaxCall", 
		contentScriptWhen: "ready",
		entry:'//input[@id="masthead-search-term"]',
		trigger:'//button[@id="search-btn"]',
		results: {
			name: 'Videos',
			xpath:'//div[@id="results"]/ol/li[2]/ol/li',
			properties:[
				{
					name:'Title',
					xpath:'//h3',
					extractor: new SingleNodeExtractor()
				},
				{
					name:'Authors', 
					xpath:'//div[contains(@class, "yt-lockup-description")]',
					extractor: new SingleNodeExtractor()
				}
			]
		},
		visualization:{
			colsDef: [{
					title: "Title",
					responsivePriority: 1
				}, {
					title: "Authors",
					responsivePriority: 2
				}]
		}
	};
};
SearchTool.prototype.getLiveService = function() {

	return {
		name:'Live',
		url:'https://outlook.live.com/owa/?path=/mail/search',
		keywords:'',
		loadingResStrategy: "WriteForAjaxCall", 
		contentScriptWhen: "end",
		entry:'//form/div/input]',
		trigger:'//div[@class="conductorContent"]/div/div/div/div/div/div/div[2]',
		results: {
			name: 'Videos',
			xpath:'//div[@class="conductorContent"]/div/div[3]/div/div/div/div[2]/div',
			properties:[
				{
					name:'Title',
					xpath:'//span[contains(@class,"lvHighlightAllClass")]',
					extractor: new SingleNodeExtractor()
				},
				{
					name:'Authors', 
					xpath:'/div[2]/div[5]',
					extractor: new SingleNodeExtractor()
				}
			]
		},
		visualization:{
			colsDef: [{
					title: "Title",
					responsivePriority: 1
				}, {
					title: "Authors",
					responsivePriority: 2
				}]
		}
	};
};
SearchTool.prototype.getVKService = function() {

	return {
		name:'VK',
		url:'https://vk.com/search?c%5Bq%5D=x&c%5Bsection%5D=audio',
		keywords:'',
		loadingResStrategy: "WriteForAjaxCall", 
		contentScriptWhen: "end",
		entry:'//input[@id="search_query"]',
		/*trigger: '//div[@class="result_list"]/ul/li',*/
		results: {
			name: 'Music',
			xpath:'//div[contains(@class,"search_audio_results")]/div',
			properties:[
				{
					name:'Title',
					xpath:'/div/div[2]/a',
					extractor: new SingleNodeExtractor()
				},
				{
					name:'Authors', 
					xpath:'/div/div[2]/span[2]',
					extractor: new SingleNodeExtractor()
				}
			]
		},
		visualization:{
			colsDef: [{
					title: "Title",
					responsivePriority: 1
				}, {
					title: "Authors",
					responsivePriority: 2
				}]
		}
	};
};
SearchTool.prototype.getTwitterService = function() {

	return {
		name:'Twitter',
		url:'https://twitter.com/search?q=k&src=typd',
		keywords:'',
		loadingResStrategy: "WriteAndClickForAjaxCall", 
		contentScriptWhen: "end",
		entry:'//input[@id="search-query"]',
		trigger:'//form/span',
		results: {
			name: 'Generics',
			xpath:'//div[@class="stream"]/ol/li',
			properties:[
				{
					name:'Title',
					xpath:'//div[@class="content"]/div',
					extractor: new SingleNodeExtractor()
				},
				{
					name:'Description', 
					xpath:'//div[@class="content"]/div[2]',
					extractor: new SingleNodeExtractor()
				}
			]
		},
		visualization:{
			colsDef: [{
					title: "Title",
					responsivePriority: 1
				}, {
					title: "Description",
					responsivePriority: 2
				}]
		}
	};
};
SearchTool.prototype.getAmazonBooksService = function() {
	
	return {
		name:'Amazon',
		url:'https://www.amazon.com/s/ref=nb_sb_noss_2?url=search-alias%3Dstripbooks&field-keywords=x&rh=n%3A283155%2Ck%3Ax',
		keywords:'',
		loadingResStrategy: "WriteAndClickToReload", 
		contentScriptWhen: "ready",
		entry:'//div[@id="nav-search"]//div[@class="nav-search-field"]/input',
		trigger:'//div[@id="nav-search"]//div[contains(@class,"nav-search-submit")]/input',
		results: {
			name: 'Generics',
			xpath:'//div[@id="resultsCol"]//li',
			properties:[
				{
					name:'Title',
					xpath:'//h2',
					extractor: new SingleNodeExtractor()
				},
				{
					name:'Description', 
					xpath:'/div/div/div/div/div[2]',
					extractor: new SingleNodeExtractor()
				}
			]
		},
		visualization:{
			colsDef: [{
					title: "Title",
					responsivePriority: 1
				}, {
					title: "Description",
					responsivePriority: 2
				}]
		}
	};
};
SearchTool.prototype.createCustomSearchMenus = function(){

	var apis = this.getApiSpecifications();

	var theMenu = this.menu;
	var me = this;

	for (var i = apis.length - 1; i >= 0; i--) {
		this.createContextSubMenu({
			id: "concrete-results-" + apis[i].name.replace(/\s/g, ''), 
			label: apis[i].name, 
			specification: apis[i],
			menu: theMenu,
			callback: function(){

				me.logs = [];
				me.logAction("[01][start] loading the popup");
				this.specification.keywords = me.selectedText;
				me.currentApiCog = this.specification;

				var win = SDK.utils.getMostRecentBrowserWindow();
				var unwrappedWindow = win.content.wrappedJSObject;
				
				var resultsBox = me.createResultsBox(unwrappedWindow, 
					"«"+this.specification.results.name+"» from «" + 
					this.label + "» matching «" + me.selectedText + "»");

				unwrappedWindow.document.body.appendChild(resultsBox);  
				unwrappedWindow["$"](resultsBox).draggable();

				//IFRAME
				var iframe = me.createSpecializedVisualizationBox(unwrappedWindow);
	    		resultsBox.childNodes[1].appendChild(iframe);
	    		me.loadSpecializedVisualization(iframe);
			}
		});
	}
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

	var win = SDK.utils.getMostRecentBrowserWindow();
	var doc = win.content.document.wrappedJSObject;

	//DO NOT USE CDN HERE!!!
	this.loadScript(
		SDK.data.url("./lib/js/jquery-1.12.4.min.js"), doc, 
		"$");
	this.loadScript(
		SDK.data.url("./lib/js/jquery-ui.min.js"), 
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
	    /*script.onload = function(){
	    	onsole.log("ok: " + url);
	    };*/
	    script.src = url;
	    document.head.appendChild(script);
}
SearchTool.prototype.showContextMenu = function(selectedText){

	this.menu.style.visibility = "visible";
	this.menu.style.display = "";
	this.menu.setAttribute("label", this.locale("perform_search", selectedText));
}




































//EXTRACTOR OF RESULTS

class DomElemWrapper{ 
	constructor(elem) {
		this.initialize(elem);
	}
	initialize(elem){
		this.domElem = elem;
	};
	static getTags(){};
	static properForTagName(tagName) { 
		//console.log(this.getTags().toString() + " vs " + tagName + " = " + (this.getTags().indexOf(tagName.toLowerCase()) != -1));
		return (this.getTags().indexOf(tagName.toLowerCase()) != -1) 
	};
}
class ImgWrapper extends DomElemWrapper { 

	static getTags(){ return ["img"] };
	/*initialize(elem){
		this.domElem = new Image();
		this.domElem.crossOrigin = "anonymous"; // This enables CORS
		this.domElem.src = elem.src;
		document.body.appendChild(this.domElem);
	}*/
	getValue() {
		return (this.domElem)? this.domElem.src: ""; //this.getBase64Image(this.domElem);
	}
	getBase64Image(img) {
		try{
			//var img = unprivilegedImage.wrappedJSObject || img;

			var chromeWindow = SDK.utils.getMostRecentBrowserWindow().content;
		    var canvas = chromeWindow.document.createElement("canvas");
			    canvas.width = img.width;
			    canvas.height = img.height;
		    var ctx = canvas.getContext("2d");
		    ctx.drawImage(img, 0, 0);
		    return canvas.toDataURL("image/png");

		}catch(err){
			console.log(err);
			return undefined;
		}
	}
}
class TextBasedWrapper extends DomElemWrapper{ 
	static getTags(){ return ["span", "label", "p"] };
	getValue() {
		return (this.domElem)? this.domElem.textContent : "";
	}
}
class ElemIdWrapper extends DomElemWrapper { 

	static getTags(){ return [""] };
	getValue() {
		return (this.domElem)? this.domElem.getAttribute("id") : ""; //this.getBase64Image(this.domElem);
	}
}
class ElemAltWrapper extends DomElemWrapper { 

	static getTags(){ return [""] };
	getValue() {
		return (this.domElem)? this.domElem.getAttribute("alt") : ""; //this.getBase64Image(this.domElem);
	}
}

//XPATH MANAGER
function XPathInterpreter() {
    this.currentElement;
    this.xPaths;
    this.engine = [new BasicIdEngine(), new IdTreeXPathEngine(), 
    new FullXPathEngine(), new ClassXPathEngine() ];
}
XPathInterpreter.prototype.setEngine = function(engine) {
    this.engine = engine;
};
XPathInterpreter.prototype.addEngine = function(engine) {
    this.engines.add(engine);
};
XPathInterpreter.prototype.removeEngine = function(engine) {
    if (this.engines.inlude(engine)){
        this.engines.remove(this.engines.indexOf(engine));
    }
};
XPathInterpreter.prototype.removeEngines = function() {
    this.engines = new array();
};
XPathInterpreter.prototype.getMultipleXPaths = function(element, parent, removeBase) {
    var xPathArray = [];
    if(element == undefined)
        return;
    if(parent == undefined)
        parent = element.parentNode;

    for (var i = 0; i < this.engine.length; i++) {
        try{
            var path = this.engine[i].getPath(element, parent);
            if (path !== undefined && path !== null && path.length && path.length > 0){

                for (var j = 0; j < path.length; j++) {
                    
                    if(removeBase && path[j] != null && path[j].indexOf('.//')>-1)
                        path[j] = path[j].slice(3,path[j].length);

                    xPathArray.push(path[j]);
                    if(!removeBase)
                        xPathArray.push(path[j].slice(0,path[j].lastIndexOf("[")));
                } 
            }
        }catch(err){ 
            console.log(err);
        }
    };
    return xPathArray;
};
XPathInterpreter.prototype.getPath = function(element, parent) {
    return this.engine.getPath(element, parent);
    // return xPathArray;    
};
XPathInterpreter.prototype.getBetterPath = function(element) {
    var xPaths = this.getMultipleXPaths(element); 
    return xPaths[0];        
};
XPathInterpreter.prototype.getElementByXPath = function(xpath, node){

    var doc = (node && node.ownerDocument)? node.ownerDocument : node;
    return doc.evaluate( xpath, doc, null, 9, null).singleNodeValue;
}
XPathInterpreter.prototype.getElementsByXpath = function(xpath, node) {
    
    var doc = (node && node.ownerDocument)? node.ownerDocument : node;

    //TODO: ERROR ACÁ EN ALGUNOS SITIOS AL HACER  HARVESTING DE LAS PROPS, EJ: DBLP
    var results = doc.evaluate( xpath, doc, null, 4, null ); //4 = UNORDERED_NODE_ITERATOR_TYPE

    var nodes = [], res = results.iterateNext(), i=0;
    while (res) {
        nodes.push(res);
        res = results.iterateNext();
    }
    return nodes;
};
/* 
 * Clase strategy
 */
function XPathSelectorEngine() {}
XPathSelectorEngine.prototype.getElement = function(aNode, aExpr) {
   
    var win = SDK.utils.getMostRecentBrowserWindow();
    var xpe = new win.XPathEvaluator();
    var nsResolver = xpe.createNSResolver(aNode.ownerDocument === null ?
        aNode.documentElement : aNode.ownerDocument.documentElement);
    var result = xpe.evaluate(aExpr, aNode, nsResolver, 0, null);
    var found = [];
    var res;
    while (res = result.iterateNext())
        found.push(res);
    return found;
};
function BasicIdEngine() {
    if ( arguments.callee.instance )    //Singleton pattern
        return arguments.callee.instance;
    arguments.callee.instance = this;
}

BasicIdEngine.prototype = new XPathSelectorEngine();
BasicIdEngine.prototype.constructor = BasicIdEngine;
BasicIdEngine.prototype.getPath = function(element, parent){
    if (element && element.id){
        return ['.//'+ element.nodeName.toLowerCase() +'[@id="' + element.id + '"]']; 
    }else{
        return; 
    }
};

function IdTreeXPathEngine() {
    if ( arguments.callee.instance )    //Singleton pattern
        return arguments.callee.instance;
    arguments.callee.instance = this;
}
IdTreeXPathEngine.prototype = new XPathSelectorEngine();
IdTreeXPathEngine.prototype.constructor = IdTreeXPathEngine;
IdTreeXPathEngine.prototype.getPath = function(element, parent){

    if(element == undefined)
        return null;
    var oldElem = element;
    var oldTag = oldElem.nodeName.toLowerCase();
    //element = element.parentNode;
    var paths = [];
    var parentNode = parent || element.ownerDocument;
    //paths.splice(0, 0, oldTag);
    // Use nodeName (instead of localName) so namespace prefix is included (if any).
    var siblingId = false;    
    for (; element && element.nodeType == 1 && element.innerHTML != parentNode.innerHTML; element = element.parentNode) {
        var index = 1;
        if (element.id){
            siblingId = true;
        }
        else {
        for (var sibling = element.previousSibling; sibling; sibling = sibling.previousSibling) {
            // Ignore document type declaration.
            if (sibling.nodeType == 10){ 
                continue;
            }

            if (sibling.nodeName == element.nodeName){
                index++;
            }
        }
        }
        
        var tagName = element.nodeName.toLowerCase();
        var pathIndex;
        if (!siblingId){
            pathIndex = (index ? "[" + (index) + "]" : ""); 
            paths.splice(0, 0, tagName + pathIndex);            
        }else{
            var result = this.getElementIdXPath(element) + (paths.length ? "/" + paths.join("/") : "");
            var oldElem2 = (new BasicIdEngine()).getPath(oldElem);
            if (oldElem2 && oldElem2.length && oldElem2.length > 0 && result == oldElem2[0]){
                return null;
            }
            else return [result];
        }        
    }
    var result =  paths.length ? ".//" + paths.join("/") : null;
    var oldElem2 = (new BasicIdEngine()).getPath(oldElem);
    if (oldElem2 && oldElem2.length && oldElem2.length > 0 && result == oldElem2[0]){
        return;
    }
    else return [result];
};
IdTreeXPathEngine.prototype.getElementIdXPath = function(element){
    if (element && element.id){
        return './/'+ element.nodeName.toLowerCase() +'[@id="' + element.id + '"]'; 
    }else{
        return null; //Siempre que no encontremos el Xpath devolvamos null.
    }
};

function ClassXPathEngine() {
    if ( arguments.callee.instance )    //Singleton pattern
        return arguments.callee.instance;
    arguments.callee.instance = this;
}
ClassXPathEngine.prototype = new XPathSelectorEngine();
ClassXPathEngine.prototype.constructor = ClassXPathEngine;
ClassXPathEngine.prototype.getPath = function(element, parent){
    if (!element) return;
    var elemClass = element.className;
    if (!elemClass) return;
    var tagName = element.nodeName.toLowerCase();
    
    // ESTO ES LO QUE DETERMINA COMO SERA EL XPATH -> VER VARIANTES
    //var elemPath = "//"+tagName+"[@class='"+elemClass+"']";
    var xpaths = [], elemClasses = elemClass.split(/[ ]+/);

    for (var i = 0; i < elemClasses.length; i++) {

        var elemPath = ".//"+tagName+"[contains(@class, '"+ elemClasses[i] +"')]";
        var res = this.getElement(element.ownerDocument, elemPath);
        for (var e in res){
            if (res[e]==element){
                xpaths.push(elemPath);
                break;
            }
        }
    }
    return (xpaths.length && xpaths.length > 0)? xpaths:undefined;
};

/* 
 * Estrategia xpath absoluto o full.
 * Funciona como el de firebug
 */
function FullXPathEngine() {
    if ( arguments.callee.instance )    //Singleton pattern
        return arguments.callee.instance;
    arguments.callee.instance = this;
}

FullXPathEngine.prototype = new XPathSelectorEngine();
FullXPathEngine.prototype.constructor = FullXPathEngine;
FullXPathEngine.prototype.getPath = function(element, parent) {

    if(element == undefined)
        return null;
    var paths = [];
    var parentNode = parent || element.ownerDocument;
    // Arma el path hasta llegar al parent node, que puede ser el parametro o "document"
    for (; element && element.nodeType == 1 && element.innerHTML != parentNode.innerHTML; element = element.parentNode) {
        var index = 1;
        // aumenta el indice para comparar con los hermanos superiores del elemento actual (del mismo tipo)
        for (var sibling = element.previousSibling; sibling; sibling = sibling.previousSibling) {
            if (sibling.nodeType == 10) 
                continue;
            if (sibling.nodeName == element.nodeName)
                index++;
        }

        var tagName = element.nodeName.toLowerCase();
        var pathIndex = "[" + (index) + "]";
        paths.splice(0, 0, tagName + pathIndex);
    }
    if(paths.length)
        return [".//" + paths.join("/")];
    else return;
};

function CssPathEngine() {
    if ( arguments.callee.instance )    //Singleton pattern
        return arguments.callee.instance;
    arguments.callee.instance = this;
}
CssPathEngine.prototype = new XPathSelectorEngine();
CssPathEngine.prototype.constructor = CssPathEngine;
CssPathEngine.prototype.getPath = function(element, parent){
    var paths = [];

    for (; element && element.nodeType == 1; element = element.parentNode)
    {
        var selector = this.getElementCSSSelector(element);
        paths.splice(0, 0, selector);
    }

    if(paths.length)
        return paths.join(" ");
    else return;
};
CssPathEngine.prototype.getElementCSSSelector = function(element){
    if (!element || !element.localName)
        return null;

    var label = element.localName.toLowerCase();
    if (element.id)
    label += "#" + element.id;

    if (element.classList && element.classList.length > 0)
    label += "." + element.classList.item(0);

    return label;
};
CssPathEngine.prototype.getElement = function(aNode, aExpr) {    
    if (aNode){
        return aNode.querySelector(aExpr);
    }else{
        return document.querySelector(aExpr);
    }

};


//EXTRACTION CLASSES

//EXTRACTOR-----------------------------------------------------------------
//--------------------------------------------------------------------------

function IOExtractor(domForResults){

	this.domElementWrappers = [ ImgWrapper, TextBasedWrapper ];
	this.xpathManager = new XPathInterpreter();
	this.domForResults = domForResults;
}
IOExtractor.prototype.extractAsString = function(spec) {
	return JSON.stringify(this.extract(spec),null, 2);
}
IOExtractor.prototype.extract = function(spec) {

	var ios=[], domElems = this.xpathManager.getElementsByXpath(spec.xpath, this.domForResults);
	for (var i = domElems.length - 1; i >= 0; i--) {
		ios.push({
			name: spec.name,
			domElem: domElems[i],
			properties: this.getProperties(spec.properties, domElems[i])
		});		
	}
	return ios;
}
IOExtractor.prototype.getMatchingWrapper = function(tagName) {

	for (var i = this.domElementWrappers.length - 1; i >= 0; i--) {

		if(this.domElementWrappers[i].properForTagName(tagName)){	
			return this.domElementWrappers[i];
		}
	}
	return TextBasedWrapper;
}
IOExtractor.prototype.applyProperWrapper = function(data) {

	var wrapperClass;
	if(data.wrapper){
		wrapperClass = data.wrapper;
	}
	else{
		var tagName = (data.elem)? data.elem.tagName: "";
		wrapperClass = this.getMatchingWrapper(tagName);
	}
	
	var wrapped = new wrapperClass(data.elem);
	return wrapped;
}
IOExtractor.prototype.getProperties = function(specs, parentDomElem) {

	var properties = [];
	var parentXpath = this.xpathManager.getBetterPath(parentDomElem);

	for (var i = specs.length - 1; i >= 0; i--) {
		
		//var extractorname = specs[i].extractor;
		//var domExtractor = new window[extractorname]();
		var propDomElem = specs[i].extractor.extract(parentXpath + specs[i].xpath, this.domForResults);
		specs[i].elem = propDomElem;
		var wrapped = this.applyProperWrapper(specs[i]);

		properties.push({
			name: specs[i].name,
			value: wrapped.getValue()
		});
	}
	return properties;
}
IOExtractor.prototype.extractDataForDatatable = function(spec) {

	var ios = this.extract(spec);
	var orderedProperties = this.getPropertiesNames(spec);
	var dataset = [];

	for (var i = ios.length - 1; i >= 0; i--) {
		var row = [];

		for (var j = ios[i].properties.length - 1; j >= 0; j--) {
			row.push(ios[i].properties[j].value); 
		}
		dataset.push(row);
	}
	return dataset;
} 
IOExtractor.prototype.getPropertiesNames = function(spec) {
	var props = [];
	for (var i = spec.properties.length - 1; i >= 0; i--) {
		props.push(spec.properties[i].name);
	}
	return props;
}

// EXTRACTORS


class DomElemExtractor{ 
	constructor(data) {
		this.xpathManager = new XPathInterpreter();
		this.initialize(data);
	}
	initialize(data){};
	extract(xpath, document){};
}
class SingleNodeExtractor extends DomElemExtractor { 
	extract(xpath, document) {
		return this.xpathManager.getElementByXPath(xpath,document);
	};
}

class MultipleNodesExtractor extends DomElemExtractor { 
	extract(xpath, document) {
		var elems = this.xpathManager.getElementsByXpath(xpath,document);
		var container = document.createElement("div");
		for (var i = elems.length - 1; i >= 0; i--) {
			container.appendChild(elems[i]);
			if(i > 0) container.appendChild(document.createTextNode(", "));
		}
		return container;
	};
}











function WASFile(nsiFile,charset){

	this.nsiFile = nsiFile;
	this.charset = charset || "ISO-8859-1";
}
WASFile.prototype.getName = function(){

	return (this.nsiFile.leafName.lastIndexOf('.') != "-1")? 
		(this.nsiFile.leafName.substr(0, this.nsiFile.leafName.lastIndexOf('.')))
		:this.nsiFile.leafName;
}
WASFile.prototype.getExtension = function(){

	return (this.nsiFile.leafName.lastIndexOf('.') != "-1")? 
		this.nsiFile.leafName.substr(this.nsiFile.leafName.lastIndexOf('.') + 1)
		: "";
}
WASFile.prototype.readContent = function(){

	var data = "";
	Cu.import("resource://gre/modules/FileUtils.jsm"); 
	Cu.import("resource://gre/modules/NetUtil.jsm"); 

	if(this.nsiFile.exists())
	{
		var data = "";
		var fstream = Cc["@mozilla.org/network/file-input-stream;1"].createInstance(Ci.nsIFileInputStream);
		var cstream = Cc["@mozilla.org/intl/converter-input-stream;1"].createInstance(Ci.nsIConverterInputStream);
		fstream.init(this.nsiFile, -1, 0, 0);
		cstream.init(fstream, "ISO-8859-1", 0, 0);
		 
		var str = {}; 
		var read = 0;
		do {
			read = cstream.readString(0xffffffff, str); // read as much as we can and put it in str.value
			data += str.value;
		} while (read != 0);

		cstream.close(); 
	}
	return data;
}

function FilesManager(dir){}
FilesManager.prototype.readFilesFromDir = function(dirName){
	
	var files = new Array();
	try {
		Cu.import("resource://gre/modules/FileUtils.jsm"); //to load, read and create files/folders.
		Cu.import("resource://gre/modules/NetUtil.jsm"); //To copy string to file, to read from a file		
		
		var nsiFile = new FileUtils.getDir("ProfD", [dirName], true);
		//let nsiFile = new FileUtils.File("/home/"+dirName);

		//if (nsiFile.exists())
			return nsiFile.QueryInterface(Ci.nsIFile);
	}
	catch(err){	console.log(err.message); }
	return;
}




exports.getInstance = function(localeBundle, nativeApi) {
    return new SearchTool(localeBundle, nativeApi);
}