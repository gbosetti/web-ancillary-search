// ==UserScript==
// @name        extractor
// @namespace   gbosetti at LIFIA
// @include     http://dblp.uni-trier.de/search/publ?q=*
// @version     1
// @grant       none
// ==/UserScript==

window.onload = function() { try{
  
	//WRAPPERS FOR DOMELEMENTS-----------------------------------------------------------------

	class DomElemWrapper{ 
		constructor(elem) {
			this.domElem = elem;
		}
		static getTags(){};
		static properForTagName(tagName) { 
			return (this.getTags().indexOf(tagName.toLowerCase()) != -1) 
		};
	}
	class ImgWrapper extends DomElemWrapper { 
		static getTags(){ return ["img"] };
		getValue() {
			return this.getBase64Image(this.domElem);
		}
		getBase64Image(img) {
			try{
			    var canvas = document.createElement("canvas");
				    canvas.width = img.width;
				    canvas.height = img.height;
			    var ctx = canvas.getContext("2d");
			    ctx.drawImage(img, 0, 0);

			    return canvas.toDataURL("image/png");
			}catch(err){return undefined}
		}
	}
	class TextBasedWrapper extends DomElemWrapper{ 
		
		static getTags(){ return ["span", "label", "p"] };
		getValue() {
			return (this.domElem)? this.domElem.textContent : undefined;
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

	    var console = element.ownerDocument.defaultView.console; //.log("********************************", element, parent);
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
	            element.ownerDocument.defaultView.console.log(err);
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
	    //console.info(xPaths);
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
	   
	    var xpe = new aNode.defaultView.XPathEvaluator();
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
	            if (sibling.nodeType == 10){ //element.ownerDocument.defaultView.Node.DOCUMENT_TYPE_NODE
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
	            if (sibling.nodeType == 10) //element.ownerDocument.defaultView.Node.DOCUMENT_TYPE_NODE
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


















	//EXTRACTOR-----------------------------------------------------------------
	//--------------------------------------------------------------------------

	function IOExtractor(){

		this.domElementWrappers = [ ImgWrapper, TextBasedWrapper ];
		this.xpathManager = new XPathInterpreter();
	}
	IOExtractor.prototype.extractAsString = function(spec) {
		return JSON.stringify(this.extract(spec),null, 2);
	}
	IOExtractor.prototype.extract = function(spec) {

		var ios=[], domElems = this.xpathManager.getElementsByXpath(spec.xpath, document);
		for (var i = domElems.length - 1; i >= 0; i--) {
			console.log("PARENT: ", domElems[i]);
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
	IOExtractor.prototype.applyProperWrapper = function(domElem) {

		var tagName = (domElem)? domElem.tagName: "";
		var wrapperClass = this.getMatchingWrapper(tagName);
		var wrapped = new wrapperClass(domElem);
		return wrapped;
	}
	IOExtractor.prototype.getProperties = function(specs, parentDomElem) {

		var properties = [];
		var parentXpath = this.xpathManager.getBetterPath(parentDomElem);

		for (var i = specs.length - 1; i >= 0; i--) {

			//console.log("xpath: ", parentXpath + specs[i].xpath);
			var propDomElem = specs[i].extractor.extract(parentXpath + specs[i].xpath); 
			//console.log("prop: ", propDomElem);
			var wrapped = this.applyProperWrapper(propDomElem);

			properties.push({
				name: specs[i].name,
				value: wrapped.getValue()
			});
		}
		return properties;
	}
	IOExtractor.prototype.saveIntoFile = function(filename, textContent) {

		var pom = document.createElement('a');
	        pom.setAttribute('href', 'data:text/xml;charset=utf-8,' + 
	        	unsafeWindow.encodeURIComponent(textContent));
	        pom.setAttribute('download', filename);

	    var event = document.createEvent('MouseEvents');
	    event.initEvent('click', true, true);
	    pom.dispatchEvent(event);
	}
	IOExtractor.prototype.extractIntoFile = function(filename, spec) {

		this.saveIntoFile(filename, this.extractAsString(spec));
	}
	IOExtractor.prototype.extractDataForDatatableIntoFile = function(filename, spec) {

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
		var content = JSON.stringify(dataset,null, 2);

		this.saveIntoFile(filename, content);
		return content;
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
		constructor(elem) {
			this.xpathManager = new XPathInterpreter();
		}
		extract(){};
	}
	class SingleNodeExtractor extends DomElemExtractor { 
		extract(xpath) {
			return this.xpathManager.getElementByXPath(xpath,document);
		};
	}
	class MultipleNodesExtractor extends DomElemExtractor { 
		extract(xpath) {
			var elems = this.xpathManager.getElementsByXpath(xpath,document);
			var container = document.createElement("div");
			for (var i = elems.length - 1; i >= 0; i--) {
				container.appendChild(elems[i]);
				if(i > 0) container.appendChild(document.createTextNode(", "));
			}
			//console.log(container);
			return container;
		};
	}

	//EXTRACTING FROM THE SITE -----------------------------------------------------------------
	var cfg = {
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
	};
  
	setTimeout(function(){ 
		try{
	  var extractor = new IOExtractor();
		//extractor.extractIntoFile("results.json", cfg);
		extractor.extractDataForDatatableIntoFile("processed-data-for-datatable.json", cfg);
		}catch(err){console.log(err)}
	}, 3000);
	
	
}catch(err){console.log(err)}}