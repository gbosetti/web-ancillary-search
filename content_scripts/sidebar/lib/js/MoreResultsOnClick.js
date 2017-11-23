serviceCreator.controller('MoreResultsOnClick', function($scope, $state, ServiceService) {

    AbstractController.call(this, $scope, $state, ServiceService);
    $scope.service = {
      "moreResults": {
        "props": {
          "selector":undefined,
          "preview": 'lib/img/no-preview.png'
        }
      }
    };
    $scope.loadDataModel = function() {
      ServiceService.getService().then(function(service) {
        if(service.moreResults.props)
          $scope.service.moreResults.props = service.moreResults.props;
      }); 
    };
    $scope.saveDataModel = function() {
      ServiceService.setMoreResultsExtraProps($scope.service.moreResults.props);
    };
    $scope.undoActionsOnDom = function(aState) {
      $scope.disableDomElementSelection($scope.triggablesSelector);
    };
    $scope.loadSubformBehaviour = function() { 
      $scope.enableDomElementSelection($scope.triggablesSelector, "onElementSelection", "#property-preview-image");
    };
    $scope.onElementSelection = function(data){

  		this.showPreview(data.previewSource);
      $scope.showAllHiddenElements();

      $scope.service.moreResults.props.preview = data.previewSource;
  		$scope.service.moreResults.props.selector = data.selectors["1"][0];
  	};
  	$scope.showPreview = function(previewSource){
      $scope.showFormElement("#property-preview-image");
  		document.querySelector("#property-preview-image").src = previewSource;
  	};
    $scope.areRequirementsMet = function(){
      return ($scope.service.moreResults.props.selector)? true: false;
    };
    $scope.initialize();
});