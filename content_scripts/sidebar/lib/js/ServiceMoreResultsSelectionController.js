serviceCreator.controller('ServiceMoreResultsSelectionController', function($scope, $state) {

	$scope.inputSelectors;

    AbstractController.call(this, $scope, $state);

    $scope.loadPrevStep = function() {
    	$scope.disableDomElementSelection("input");
        $state.go('ServiceName')
    };
    $scope.loadNextStep = function() {
      if($scope.inputSelectors){
        $state.go('ServiceTrigger')
      }
    };
    $scope.loadSubformBehaviour = function() { 
      $scope.enableDomElementSelection("input", "onElementSelection", "#property-preview-image");
    };
    $scope.onElementSelection = function(data){
		this.showPreview(data.previewSource);
		this.inputSelectors = data.selectors;
	}
	$scope.showPreview = function(previewSource){
		document.querySelectorAll(".hidden").forEach(function(elem){
			elem.classList.remove("hidden");
		});
		document.querySelector("#property-preview-image").src = previewSource;
	}
    $scope.initialize();
});