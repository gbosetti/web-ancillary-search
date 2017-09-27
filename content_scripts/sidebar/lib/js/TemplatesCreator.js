function TemplatesCreator(filesManager){
	//console.log(filesManager);
	this.filesManager = filesManager;
}
TemplatesCreator.prototype.getCurrentSpec = function(callback) {

	return this.getSpec({
		templateName: document.domain,
		url: window.location.href
	}, callback);
};
TemplatesCreator.prototype.getSpec = function(specData, callback) {
	//console.log(this.filesManager); 
	//TODO: we should return a wrapped file, an instance of TemplateSpec, not the file itself
	return this.filesManager.getFile(specData.templateName, callback);
};
