// ==UserScript==
// @name        pagina12extractor
// @namespace   gbosetti at LIFIA
// @include     https://www.pagina12.com.ar/buscar?q=prat+gay
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
			return this.domElem.textContent;
		}
	}

	//EXTRACTOR-----------------------------------------------------------------

	function IOExtractor(){

		this.domElementWrappers = [ ImgWrapper, TextBasedWrapper ];
	}
	IOExtractor.prototype.getXPath = function(element, parent){

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
	            var oldElem2 = this.getPath(oldElem);
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
	IOExtractor.prototype.getPath = function(element, parent){
	    if (element && element.id){
	        return ['.//'+ element.nodeName.toLowerCase() +'[@id="' + element.id + '"]']; 
	    }else{
	        return; 
	    }
	};
	IOExtractor.prototype.getElementIdXPath = function(element){
	    if (element && element.id){
	        return './/'+ element.nodeName.toLowerCase() +'[@id="' + element.id + '"]'; 
	    }else{
	        return null; //Siempre que no encontremos el Xpath devolvamos null.
	    }
	};
	IOExtractor.prototype.getDomElementsByXpath = function(xpath, node) {
	    
	    var doc = (node && node.ownerDocument)? node.ownerDocument : node;
	    var results = doc.evaluate( xpath, doc, null, 4, null ); //4 = UNORDERED_NODE_ITERATOR_TYPE

	    var nodes = [], res = results.iterateNext(), i=0;
	    while (res) {
	        nodes.push(res);
	        res = results.iterateNext();
	    }
	    return nodes;
	};
	IOExtractor.prototype.getDomElementByXpath = function(xpath, node) {
	    
	    var doc = (node && node.ownerDocument)? node.ownerDocument : node;
	    return doc.evaluate( xpath, doc, null, 9, null).singleNodeValue; 
	};
	IOExtractor.prototype.extractAsString = function(spec) {
		return JSON.stringify(this.extract(spec),null, 2);
	}
	IOExtractor.prototype.extract = function(spec) {

		var ios=[], domElems = this.getDomElementsByXpath(spec.xpath, document);

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
	IOExtractor.prototype.applyProperWrapper = function(domElem) {

		var wrapperClass = this.getMatchingWrapper(domElem.tagName);
		var wrapped = new wrapperClass(domElem);
		return wrapped;
	}
	IOExtractor.prototype.getProperties = function(specs, parentDomElem) {

		var properties = [];
		var parentXpath = this.getXPath(parentDomElem);

		for (var i = specs.length - 1; i >= 0; i--) {

			var propDomElem = this.getDomElementByXpath(parentXpath + specs[i].xpath,document);
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

	//EXTRACTING FROM PáGINA 12-----------------------------------------------------------------
	var cfg = {
		name: 'Página 12 news',
		xpath:'//*[contains(@class, "article-box--with-image")]',
		properties:[
			{
				name:'title',
				xpath:'//h2/a'
			},
			{
				name:'description',
				xpath:'//div[2]/div/a'
			},
			{
				name:'image',
				xpath:'//img[3]'
			}
		]
	};

	var extractor = new IOExtractor();
		extractor.extractIntoFile("results.json", cfg);
		extractor.extractDataForDatatableIntoFile("processed-data-for-datatable.json", cfg);

}catch(err){console.log(err)}}