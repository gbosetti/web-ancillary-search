serviceCreator.controller('ServiceResultsSelectionController', function($scope, $state) {

    AbstractController.call(this, $scope, $state);

    $scope.userDefInputXpath;

    $scope.loadPrevStep = function() {
    	$scope.disableDomElementSelection("input");
        $state.go('ServiceTrigger');
    };
    $scope.loadNextStep = function() {

		if($scope.areRequirementsMet()){

			$scope.removeFullSelectionStyle();
			$scope.disableDomElementSelection("tr, div:not(#andes-sidebar)"); // calls disableElementSelection

			$state.go('ServiceResultsNaming');
    	}
    };
    $scope.loadSubformBehaviour = function() { 
      $scope.enableDomElementSelection("tr, div:not(#andes-sidebar)", "onResultsContainerSelection", ".well");
    };
    $scope.onElementSelection = function(data){
		$scope.showPreview(data.previewSource);
		$scope.inputSelectors = data.selectors;
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
			browser.runtime.sendMessage({ 
	    		"call": "selectMatchingElements",
	    		"args": { "selector": this.value }
	    	});
		}
	};
    $scope.initialize();
});