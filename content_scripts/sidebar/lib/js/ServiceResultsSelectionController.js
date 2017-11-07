serviceCreator.controller('ServiceResultsSelectionController', function($scope, $state, ServiceService) {

    AbstractController.call(this, $scope, $state);

    $scope.service = { 
      	results: {
	        selector: undefined,
	        preview: undefined  
	    }
    };
    $scope.availableSelectors;

    $scope.loadDataModel = function() {
      ServiceService.getService().then(function(service) {
      	
      	$scope.service.results.selector = service.results.selector;
      	$scope.service.results.preview = service.results.preview;
      }); 
    };
    $scope.saveDataModel = function() {
    	//Splitted because there are other properties of "Results" managed by other controllers
    	ServiceService.setResultsSelector($scope.service.results.selector);	
		ServiceService.setResultsPreview($scope.service.results.preview);	
    };
    $scope.undoActionsOnDom = function() {
    	$scope.removeFullSelectionStyle();
		$scope.disableDomElementSelection("tr, div:not(#andes-sidebar)");
    };
    $scope.loadSubformBehaviour = function() { 
      $scope.enableDomElementSelection("tr, div:not(#andes-sidebar)", "onResultsContainerSelection", ".well");
    };
    $scope.onElementSelection = function(data){
    	$scope.service.results.preview = data.previewSource;
		$scope.showPreview(data.previewSource);
		$scope.availableSelectors = data.selectors;
	}
	$scope.showPreview = function(previewSource){
		document.querySelectorAll(".hidden").forEach(function(elem){
			elem.classList.remove("hidden");
		});
		document.querySelector("#property-preview-image").src = previewSource;
	}
	$scope.onResultsContainerSelection = function(data){

		$scope.showFormElement("#preview_group");
		$scope.showFormElement("#selector_group");
		
		$scope.loadPreview("#result-preview-image", data.previewSource);
		$scope.fillOccurrencesSelector(data.selectors);
		document.querySelector("#result-selector").onchange();
	};
	$scope.fillOccurrencesSelector = function(selectors){

		var selector = document.querySelector("#result-selector");
			selector.innerHTML = "";

		Object.keys(selectors).forEach(function(key) {

			var elemsBySelectorLabel = key > 1? browser.i18n.getMessage("occurrences") : browser.i18n.getMessage("occurrence");
			var opt = document.createElement("option");
				opt.value = selectors[key][0];
				opt.text = key + " " + elemsBySelectorLabel;
			selector.add(opt); 
		});

		selector.onchange = function(){
			$scope.service.results.selector = this.value;
			browser.runtime.sendMessage({ 
	    		"call": "selectMatchingElements",
	    		"args": { "selector": this.value }
	    	});
		}
	};
    $scope.initialize();
});