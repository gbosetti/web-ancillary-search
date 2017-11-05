serviceCreator.controller('ServiceInputController', function($scope, $state) {

    AbstractController.call(this, $scope, $state);
    $scope.loadValidationRules = function() {
      $('form').validate({  "rules": {
          "search_service_name": {
              "minlength": 2,
              "required": true
          }
      }});
    }
    $scope.loadNextNavigationButton = function() {

      if($("form").valid($state)){
        $state.go('ServiceInput')
      }
    };
    //$scope.callPlaceholderNameAdaptation();
    //$scope.loadValidationRules();
    $scope.localize();
});


/*function ServiceInputUI(){

	UI.call(this);

	this.fileDescription = " service-input.js";
	this.inputSelectors;
	var me = this;

	this.loadSubformBehaviour = function() {
		this.enableDomElementSelection("input", "onElementSelection");
	};
	this.onElementSelection = function(data){

		this.showPreview();
		this.loadPreview("#property-preview-image", data.previewSource);
		this.inputSelectors = data.selectors;
	}
	this.showPreview = function(data){
		document.querySelectorAll(".hidden").forEach(function(elem){
			elem.classList.remove("hidden");
		});
	}
	this.loadPrevNavigationButton = function() {

		document.querySelector(".prev > button").onclick = function(){   

    		
	    	me.loadUrlAtSidebar({ 
        		url: "/content_scripts/sidebar/service-name.html",
        		filePaths: [
        			"/content_scripts/sidebar/lib/js/ui-commons.js",
					"/content_scripts/sidebar/lib/js/service-name.js"
				] 
        	});
		};
	};
	this.loadNextNavigationButton = function() {

		document.querySelector(".next > button").onclick = function(){   

			if(me.inputSelectors){
				me.disableRuntimeListeners();
    			me.disableDomElementSelection("input");
    			
		    	me.loadUrlAtSidebar({ 
	        		url: "/content_scripts/sidebar/service-trigger.html",
	        		filePaths: [
	        			"/content_scripts/sidebar/lib/js/ui-commons.js",
						"/content_scripts/sidebar/lib/js/service-trigger.js"
					] 
	        	});
		    } 
		};
	};
};


var serviceInput = new ServiceInputUI();
	serviceInput.initialize({ //otherwise, if the browser is a collaborator, the class can not be clonned
		"enableRuntimeListeners": function () {
			 browser.runtime.onMessage.addListener(serviceInput.callServiceInputUIActions) 
		},
		"disableRuntimeListeners": function() {
			browser.runtime.onMessage.removeListener(serviceInput.callServiceInputUIActions);
		}
	}); //It is necessary to be called from outside*/