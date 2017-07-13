// remember: document in this context is the one in the popup!!

function TemplatesCreator(){}
TemplatesCreator.prototype.loadRequiredScripts = function(activeTab) {

	this.loadPageSideActions(activeTab);
};
TemplatesCreator.prototype.loadPageSideActions = function(activeTab) {

	browser.tabs.executeScript(activeTab.id, { file: "/content_scripts/DomUiManager.js"});
	browser.tabs.executeScript(activeTab.id, { file: "/content_scripts/enable_harvesting.js"});
 	browser.tabs.sendMessage(activeTab.id, {}); 
};
TemplatesCreator.prototype.enableHarvesting = function(tab) {

	this.createContextMenus();
	this.enableDomHighlighting(tab);
	this.loadRequiredScripts(tab);
}
TemplatesCreator.prototype.enableDomHighlighting = function(tab) {

 	browser.tabs.insertCSS(tab.id, { file: "/content_scripts/highlighting-dom-elements.css"});


}
TemplatesCreator.prototype.createContextMenus = function(){

	this.createContextMenuForAnnotatingConcept();
	this.createContextMenuForAnnotatingProperties();
}
TemplatesCreator.prototype.createContextMenuForAnnotatingConcept = function(){

	//The menu is created
	browser.contextMenus.create({
	    id: "define-template",
	    title: browser.i18n.getMessage("annotateAsConcept"),
	    contexts: ["all"],
	    command: "_execute_sidebar_action"
	});

	browser.contextMenus.onClicked.addListener(function(info, tab) {
		document.body.style.background = "yellow";
		if (info.menuItemId == "define-template") { //Unfortunately, this is the only way right now
			console.log(info.selectionText);
		}
	});
}
TemplatesCreator.prototype.createSidebar = function(){

	browser.windows.getCurrent({populate: true}).then((windowInfo) => {
	  myWindowId = windowInfo.id;
	});
}
TemplatesCreator.prototype.createContextMenuForAnnotatingProperties = function(){

	browser.contextMenus.create({
	    id: "define-template-property2",
	    title: browser.i18n.getMessage("annotateAsProperty"),
	    contexts: ["all"],
	    command: "_execute_sidebar_action"
	});

	
	browser.contextMenus.onClicked.addListener(function(info, tab) {
		document.body.style.background = "green";
		if (info.menuItemId == "define-template-property2") { //Unfortunately, this is the only way right now
			console.log(info.selectionText);
		}
	});
}
TemplatesCreator.prototype.highlightInDom = function(xpath) {

	var elems = document.getElementsByClassName('woa-highlighted-element');
	for (i in elems) elems[i].classList.remove('woa-highlighted-element');

	elems = new XPathInterpreter().getElementsByXpath(xpath, document);
	if(elems) for (i in elems) elems[i].classList.add('woa-highlighted-element');
}
	
document.querySelector("#defineTemplate").onclick = function(){

	try{
	  	var activeTabPromise = browser.tabs.query({active: true, currentWindow: true});
			activeTabPromise.then((tabs) => {

			var templatesMan = new TemplatesCreator();
				templatesMan.enableHarvesting(tabs[0]);
				window.close();
			});
	}catch(err){
		console.log(err);
	}
}