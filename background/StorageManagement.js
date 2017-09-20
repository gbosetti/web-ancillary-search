function FilesManager(){
	this.getFile = function(spec) {};
};

function StorageFilesManager(){

	//if(_instance) 			//Singleton
	//	return _instance; 	//Singleton
	//_instance = this;		//Singleton

	FilesManager.call(this);
	this.currentFile;
	/*this.getFileAsync = function(key, callback) { //PUBLIC

		var me = this;
		browser.storage.local.get(key).then((files) => {

			if(files[0]){
				callback(new StorageFile(files[0], me));
			}
			else {
				me.createFileWithData({"key": key});
			}

			console.log(this.currentFile);
  		this.currentFile = new StorageFile(files[0]);
  		callback(this.currentFile);
  		});
    };*/
    this.createFileWithData = function(data) {

    	this.currentFile = new StorageFile(data);
		browser.storage.local.set(this.currentFile); //.then(function(){ callback(fileToSave); }); 
		return this.currentFile;
    };
};

function File(data){
	for (var key in data) {
		this[key] = data[key]
	}
}

function StorageFile(data){
	File.call(this, data);
}