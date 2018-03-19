serviceCreator.controller('ResultsSelectionController', function($scope, $state, ServiceService) {

    AbstractController.call(this, $scope, $state, ServiceService);

    $scope.service = { 
      	results: {
          name: undefined,
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
        $scope.service.results.name = service.results.name;

        $scope.enableDomElementSelection("li, tr, div:not(#andes-sidebar)", "onElementSelection", ".well");

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
    $scope.getValidationRules = function() {
      return {  
        "rules": {
            "results_tag": {
              "minlength": 2,
              "required": true
            }
        },
        "messages": {
          results_tag: browser.i18n.getMessage("this_field_is_required")
        },
        "errorPlacement": function(error, element) {
           error.appendTo('#results_tag_container');
        }
      };
    }
    $scope.areRequirementsMet = function(){
      
      return ($("form").valid() && $scope.service.results.selector)? true:false;
    };
    $scope.saveDataModel = function() {
    	//Splitted because there are other properties of "Results" managed by other controllers
    	ServiceService.setResultsSelector($scope.service.results.selector);	
		  //ServiceService.setResultsPreview($scope.service.results.preview);	
      ServiceService.setResultsName($scope.service.results.name).then(function(){
        ServiceService.updateServices();
      });
    };
    $scope.undoActionsOnDom = function() {
    	$scope.removeFullSelectionStyle();
		  $scope.disableDomElementSelection("li, tr, div:not(#andes-sidebar)");
    };
  $scope.onElementSelection = function(data){

  	$scope.showAllHiddenElements();
    $scope.focusElement("#results_tag");

  	//$scope.service.results.preview = data.previewSource;
	  //$scope.loadPreview("#result-preview-image", data.previewSource);

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
          "args": { "selector": select.value }
        });
		}
	};
    $scope.initialize();
});