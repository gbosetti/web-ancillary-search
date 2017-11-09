serviceCreator.controller('ServiceResultsSelectionController', function($scope, $state, ServiceService) {

    AbstractController.call(this, $scope, $state);

    $scope.service = { 
      	results: {
	        selector: {
	        	label: undefined,
	        	value: undefined
	        },
	        preview: undefined  
	    }
    };

    $scope.loadDataModel = function() {
      ServiceService.getService().then(function(service) {
      	$scope.service.results.selector = service.results.selector;
      	$scope.service.results.preview = service.results.preview;

      	if($scope.service.results.selector){

      		var availableSelectors = {};
      		availableSelectors[service.results.selector.label] = [service.results.selector.value];

      		$scope.onElementSelection({
      			"previewSource": service.results.preview,
      			"selectors": availableSelectors
      		});
      	}
      }); 
    };
    $scope.areRequirementsMet = function(){
      return ($scope.service.results.selector)? true:false;
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
      $scope.enableDomElementSelection("tr, div:not(#andes-sidebar)", "onElementSelection", ".well");
    };
    $scope.onElementSelection = function(data){

    	$scope.showFormElement("#preview_group");
		$scope.showFormElement("#selector_group");

    	$scope.service.results.preview = data.previewSource;
		$scope.loadPreview("#result-preview-image", data.previewSource);

		$scope.fillOccurrencesSelector(data.selectors);
		document.querySelector("#result-selector").onchange();
	}
	$scope.fillOccurrencesSelector = function(selectors){

		var select = document.querySelector("#result-selector");
			select.innerHTML = "";

		Object.keys(selectors).forEach(function(key) {

			var elemsBySelectorLabel = key > 1? browser.i18n.getMessage("occurrences") : browser.i18n.getMessage("occurrence");
			var opt = document.createElement("option");
				opt.setAttribute("andes-occurrences", key);
				opt.value = selectors[key][0];
				opt.text = key + " " + elemsBySelectorLabel;
			select.add(opt); 
		});

		select.onchange = function(){

			$scope.service.results.selector = { label: this.options[this.selectedIndex].getAttribute("andes-occurrences"), value: this.value};
			browser.runtime.sendMessage({ 
	    		"call": "selectMatchingElements",
	    		"args": { "selector": this.value }
	    	});
		}
	};
    $scope.initialize();
});