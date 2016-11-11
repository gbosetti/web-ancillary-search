// +++++++++++++++++++++++++++++++++++
// ++++++ ABSTRACT COLLECTOR  ++++++++
// +++++++++++++++++++++++++++++++++++
var utils = require('sdk/window/utils');
function InstanceObjectTemplate(){};
function IOPropertyTemplate(){};


function AbstractCollector (lang, ui){
	this.lang = lang;
	this.locale = {
		'en': {
			'single_match': 'match',
			'matches': 'matches',
			'define_a_concept':"Define a concept's template",
			'define_a_property':'Define a property'
		},
		'es': {
			'single_match': 'coincidencia',
			'matches': 'coincidencias',
			'define_a_concept':'Define un concepto',
			'define_a_property':'Define una propiedad'
		},
		'fr': {
			'single_match': 'correspondance',
			'matches': 'correspondances',
			'define_a_concept':'Définissez un concept',
			'define_a_property':'Définissez une propriété'
		}
	};
	this.target; //text,dom,img
	this.xpathEngine = this.getXpathEngine();
}
AbstractCollector.prototype.getXpathEngine = function(key){

	const { sandbox, evaluate, load } = require("sdk/loader/sandbox");
	let scope = sandbox(utils.getMostRecentBrowserWindow());
	load(scope, 'resource://woa-at-lifia-dot-info-dot-unlp-dot-edu-dot-ar/data/src/js/xpathManagement.js');    
	return new scope.XPathInterpreter();
}
AbstractCollector.prototype.getLocale = function(key){

	return (this.locale[this.lang])? this.locale[this.lang][key]: undefined;
}
AbstractCollector.prototype.setTarget = function(target){
	this.target = target;
}
AbstractCollector.prototype.getTargetXPaths = function(){
	//console.log('this.target.dom');
	//console.log(this.target.dom);
	if(this.target.dom.classList.contains("woa-highlighted-element")) 
		this.target.dom.classList.remove("woa-highlighted-element");
	var xpaths = this.xpathEngine.getMultipleXPaths(this.target.dom, this.target.dom.ownerDocument);
	this.target.dom.classList.add("woa-highlighted-element");
	console.log(xpaths);
	return xpaths;
};
AbstractCollector.prototype.getRelativeTargetXPaths = function(xpath){
	//dado un xpath de concepto y eltarget seleccionado, devuelve posibles xpath de las propiedades.
	//Esta verificación tiene que hacerse acá y no del sidebar, porque es desde donde setiene acceso al current DOM doc
	//Se obtiene las instancias, para luego tener un xpath de instancia y usarlo de base
    var baseNode = this.xpathEngine.getElementByXPath( xpath, this.target.dom.ownerDocument);
	var xpaths = this.xpathEngine.getMultipleXPaths(this.target.dom, baseNode, true);
	return xpaths;
};
AbstractCollector.prototype.getLabeledXPaths = function(xpaths, baseXpath){

	var labeledXpaths = [];
	for (var i = 0; i < xpaths.length; i++) {
		var matches;
		if(baseXpath) 
			matches = this.getMatchedElementsQuantity(baseXpath + "/" + xpaths[i]);
		else matches = this.getMatchedElementsQuantity(xpaths[i]);
		if(matches >= 1){
			var lbl = (matches==1)? this.getLocale('single_match'): this.getLocale('matches');
			labeledXpaths.push({
				order: matches,
				label: matches + ' ' + lbl,
				value: xpaths[i]
			});
		}
	};
	labeledXpaths.sort(function compare(a,b) {
		if (a.order < b.order) return -1;
		else if (a.order > b.order) return 1;
		else return 0;
	});

	return labeledXpaths;
};
AbstractCollector.prototype.getMatchedElementsQuantity = function(xpath){

	var elems = this.xpathEngine.getElementsByXpath(xpath, this.target.dom);
	return (elems && elems.length && elems.length > 0)? elems.length : 0;
};
AbstractCollector.prototype.renderMenuIfApplicable = function(target, ui){

	var applies = this.analyzeDomElement(target);
	if(applies) {
		this.setTarget(target);
		this.renderMenuItemFrom(ui);		
	}
}
AbstractCollector.prototype.renderMenuItem = function(man, data){
	var collector = this;
	man.createChildContextMenu({
		id: data.id, 
		label: data.label,
		menu: data.menu,
		doc: data.doc,
		callback: function(){
			man.onceInSidebar(function(e){
				man.currentCollector = collector;
				data.callback(e);
			});
		}
	});
};
AbstractCollector.prototype.analyzeDomElement = function(target){};
AbstractCollector.prototype.loadMaterializableOptions = function(doc){}
AbstractCollector.prototype.getMaterializable = function(ui){};
AbstractCollector.prototype.updateUiData = function(data, ui){};









// +++++++++++++++++++++++++++++++++++
// +++++ XPATH BASED COLLECTORS  +++++
// +++++++++++++++++++++++++++++++++++

function XpathBasedCollector (lang){
	AbstractCollector.call(this, lang); 
	this.locale.en['from_ui_element']='from UI element';
	this.locale.es['from_ui_element']='a partir del elemento';
	this.locale.fr['from_ui_element']="à partir de l'élément";
}
XpathBasedCollector.prototype = new AbstractCollector();
XpathBasedCollector.prototype.analyzeDomElement = function(target){
	return true; //There is always a DOM element
}

function XBCTemplateCollector(lang){
	XpathBasedCollector.call(this, lang); 
}
XBCTemplateCollector.prototype = new XpathBasedCollector();
XBCTemplateCollector.prototype.renderMenuItemFrom = function(ui){

	this.renderMenuItem( ui, {
		id: 'woa-concept-from-xpath',
		label: this.getLocale('from_ui_element'), 
		menu: ui.conceptsMenu,
		doc: utils.getMostRecentBrowserWindow().document,
		callback: function(){ui.sidebarWorker.port.emit("createCTemplate")}
	});
}
XBCTemplateCollector.prototype.getMaterializable = function(ui){

	var win = ui.getSidebarWindow();
	var document = win.document;
	console.log(this.target);
	return new InstanceObjectTemplate({
		'name': document.getElementById('edit-concept-template-name').value,
		'dbp': document.getElementById('edit-concept-template-tag').getAttribute('dbp'),
		'tag': document.getElementById('edit-concept-template-tag').value,
		'decorator': 'GenericDecorator',
		'xpath': document.getElementById('edit-concept-template-xpath').value,
		'selected': '',
		'url': this.target.dom.ownerDocument.URL,
		'imageSrc': this.target.img,
		'properties': []
	}, ui.getSidebarWindow().content); 
}
XBCTemplateCollector.prototype.loadMaterializableOptions = function(ui){

	var document = ui.getSidebarWindow().document;
	ui.focusSidebar();
	// +++++++++++++++ ENABLE TAGS FUNCTIONALITY
	
	// +++++++++++++++ HEADER 
	document.getElementById("concept-header-title").innerHTML = this.getLocale('define_a_concept');
	document.getElementById("concept-header-icon").className = "glyphicon glyphicon-plus";
	// +++++++++++++++ SELECT XPATH
	var sel = document.getElementById('edit-concept-template-xpath');
	var xpaths = this.getLabeledXPaths(this.getTargetXPaths());
	sel.innerHTML = '';
    for (var i = 0; i < xpaths.length; i++) {
		var opt = document.createElement('option');
			opt.text = xpaths[i].label; 
			opt.value = xpaths[i].value;
		sel.appendChild(opt);
	};
    sel.onchange = function(){ ui.currentWorker.port.emit('highlightInDom', this.value); }
    sel.onkeyup = function(){ ui.currentWorker.port.emit('highlightInDom', this.value); }
    // +++++++++++++++ IMAGE
    document.getElementById('concept-preview-image').src = this.target.img;
    // +++++++++++++++ SAVE BUTTON
    var col = this;

    document.getElementById('save-concept').onclick = function(evt){

    	var concept = col.getMaterializable(ui);
		var sdb = ui.getSidebarWindow().sidebar; 
		if(sdb.validateCTemplate()){
			ui.sidebarWorker.port.emit('storage.createCTemplate', JSON.stringify(concept)); 
		}
		else document.getElementById('edit-concept-template-name').focus();
	};
	document.getElementById('edit-concept-template-name').focus();
}

function XBPTemplateCollector(lang){
	XpathBasedCollector.call(this, lang); 
}
XBPTemplateCollector.prototype = new XpathBasedCollector();
XBPTemplateCollector.prototype.renderMenuItemFrom = function(ui){

	this.renderMenuItem(ui, {
		id: 'woa-property-from-xpath',
		label: this.getLocale('from_ui_element'), 
		menu: ui.propertiesMenu,
		doc: utils.getMostRecentBrowserWindow().document,
		callback: function(){ui.sidebarWorker.port.emit('createPTemplate')}
	});
}
XBPTemplateCollector.prototype.getMaterializable = function(ui){

	var win = ui.getSidebarWindow();
	var sDoc = win.document;
	console.log(this.target);
	return new IOPropertyTemplate({
		'name': sDoc.getElementById('edit-property-name').value,
		'tag': sDoc.getElementById('edit-property-tag').value,
		'dbp': sDoc.getElementById('edit-property-tag').getAttribute('dbp'),
		'xpath': sDoc.getElementById('edit-property-xpath').value,
		'selected': '',
		'url': this.target.dom.ownerDocument.URL,
		'imageSrc': this.target.img
	}, ui.getSidebarWindow().content);
}
XBPTemplateCollector.prototype.getOwnerCTemplate = function(ui){

	return ui.getSidebarWindow().document.getElementById('edit-property-owner').value;
}
XBPTemplateCollector.prototype.loadMaterializableOptions = function(ui){

	var sWin = ui.getSidebarWindow();
	ui.focusSidebar();
	// +++++++++++++++ HEADER 
	sWin.document.getElementById("property-header-title").innerHTML = this.getLocale('define_a_property');
	sWin.document.getElementById("property-header-icon").className = "glyphicon glyphicon-plus";
	ui.sidebarWorker.port.emit("loadCTemplateForPTemplateLinkage", ui.persistence.getCTemplates(), ui.currCTemplateId, false);
	// +++++++++++++++ SELECT XPATH
    // +++++++++++++++ IMAGE
    sWin.document.getElementById('property-preview-image').src = this.target.img;
    // +++++++++++++++ SAVE BUTTON
    var col = this;
    sWin.document.getElementById('save-property').onclick = function(evt){
    	var prop = col.getMaterializable(ui);
    	var owner = col.getOwnerCTemplate(ui);
		var sdb = ui.getSidebarWindow().sidebar; 

		if(sdb.validateForm('edit-property-form')){
			ui.sidebarWorker.port.emit('storage.createPTemplate', owner, JSON.stringify(prop)); 
		}
		else sWin.document.getElementById('edit-property-name').focus();
	};
	sWin.document.getElementById('exit-property').onclick = function(evt){
        ui.getSidebarWindow().sidebar.manageCTemplates();
    }
    sWin.document.getElementById('edit-property-name').focus();
}
XBPTemplateCollector.prototype.updateUiData = function(data, ui){

	var sWin = ui.getSidebarWindow();
	//Get an instancexpath, not the template one
	var sel = sWin.document.getElementById('edit-property-xpath');
	var baseNode = this.xpathEngine.getElementsByXpath(data.xpath, this.target.dom.ownerDocument);
	sel.innerHTML = '';

    if(baseNode[0]){
        //var ciXpath = this.xpathEngine.getMultipleXPaths(this.target.dom, baseNode[0],);
        //var relativePropsXpaths = this.getRelativeTargetXPaths(ciXpath);
   		var relXpaths = this.xpathEngine.getMultipleXPaths(this.target.dom, baseNode[0], true);
   		//console.log('relXpaths: ' + relXpaths);
   		
   		var baseXpaths = this.xpathEngine.getMultipleXPaths(baseNode[0], baseNode[0].ownerDocument);
   		var baseXpath = baseXpaths.sort(function (a, b) { return b.length - a.length; })[0];
   		//console.log('baseXpath: ' + baseXpath);
		var xpaths = this.getLabeledXPaths(relXpaths,baseXpath);
		//console.log(xpaths);

	    for (var i = 0; i < xpaths.length; i++) {
			var opt = sWin.document.createElement('option');
				opt.text = xpaths[i].label; 
				opt.value = xpaths[i].value;
			sel.appendChild(opt);
		};
	    sel.onchange = function(e){ ui.currentWorker.port.emit('highlightInDom', baseXpath + '/' + this.value); }
	    sel.onkeyup = function(){ ui.currentWorker.port.emit('highlightInDom', baseXpath + '/' + this.value); }
	}
}










exports.getInstances = function(lang) {
    return [ 
    	new XBCTemplateCollector(lang), //Ojo con el orden, por ahora es importante este como primero. TODO: instantiate them from "the other side" haha
    	new XBPTemplateCollector(lang)
    ];
}