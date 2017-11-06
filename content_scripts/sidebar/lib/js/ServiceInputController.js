serviceCreator.controller('ServiceInputController', function($scope, $state, ServiceService) {

    AbstractController.call(this, $scope, $state);
    $scope.service = { 
      input: {
        selector:"",
        preview: ""
      }
    };

    $scope.loadDataModel = function() {
      ServiceService.getService().then(function(service) {
        $scope.service.input.selector = service.input.selector;
      }); 
    };
    $scope.saveDataModel = function() {
      ServiceService.setInput({
        selector: $scope.service.input.selector,
        preview: $scope.service.input.preview
      });
    };

    $scope.loadPrevStep = function(aState) {
      $scope.disableDomElementSelection("input");
      $state.go(aState)
    };
    $scope.loadSubformBehaviour = function() { 
      $scope.enableDomElementSelection("input", "onElementSelection", "#property-preview-image");
    };
    $scope.onElementSelection = function(data){
  		this.showPreview(data.previewSource);
      $scope.service.input.preview = data.previewSource;
  		$scope.service.input.selector = data.selectors;
  	}
  	$scope.showPreview = function(previewSource){
  		document.querySelectorAll(".hidden").forEach(function(elem){
  			elem.classList.remove("hidden");
  		});
  		document.querySelector("#property-preview-image").src = previewSource;
  	}
    $scope.areRequirementsMet = function(){
      console.log($scope.service.input.selector);
      return ($scope.service.input.selector)? true: false;
    };
    $scope.initialize();
});