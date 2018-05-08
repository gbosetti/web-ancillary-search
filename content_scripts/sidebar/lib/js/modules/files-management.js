/* NOT BEING USED - THERE IS A SIMILAR CLASS AT BACKGROUND/STORAGEMANAGEMENT.JS THAT CAN BE REUSED

	function FilesManager(){
		this.getFile = function(spec) {};
	};

	function StorageFilesManager(){
		FilesManager.call(this);
		this.getFile = function(key, callback) { // name at	

			var me = this;
			this.getFileAsync(key, function(file){
				
				if(file)
					callback(new StorageFile(file, me));
				else{
					var fileToSave = {"key": key};
					me.setFileAsync(fileToSave, function(savedFile){
						callback(new StorageFile(savedFile, me));	
					});
				}
			});
		};
		this.setFileAsync = function(fileToSave, callback) {

			browser.storage.local.set(fileToSave).then(function(){
	          	callback(fileToSave);
	        }); 
	    };
		this.getFileAsync = function(key, callback) {
			browser.storage.local.get(key).then((files) => {
      			//console.log("from promise"); ok
          		callback(files[0]);
      		});
	    };
	};



	function File(){
		this.saveName = function() {}
	};

	function StorageFile(wrapee, filesManager){
		
		File.call(this);

		this.file = wrapee;
		this.filesManager = filesManager;

		this.saveName = function(name) {

			//This is a problem. I sthere a way for easily adding a new "file"?
			this.file.name = name;
			this.filesManager.setFileAsync(this.file, function(file){
				console.log("saved file from file", file);
			});
		};
		this.saveXpath = function(xpath) {

			//This is a problem. I sthere a way for easily adding a new "file"?
			this.file.xpath = xpath;
			this.filesManager.setFileAsync(this.file, function(file){
				console.log("saved file from file", file);
			});
		};
		this.getName = function(name) {

			return this.file.name;
		};
		this.getXpath = function(name) {

			return this.file.xpath;
		};
	};*/