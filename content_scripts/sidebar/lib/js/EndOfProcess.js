serviceCreator.controller('EndOfProcess', function($scope, $state, ServiceService) {

    AbstractController.call(this, $scope, $state, ServiceService);

    $scope.loadSubformBehaviour = function() { 

      ServiceService.updateServices();
    };
    $scope.finishServiceDefinition = function(){
    	
    	return browser.runtime.sendMessage({ "call": "closeSidebar" });
    };

    $scope.initialize();
});