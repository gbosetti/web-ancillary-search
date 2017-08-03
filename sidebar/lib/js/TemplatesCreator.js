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
	return this.filesManager.getFile(specData.templateName, callback);
};
