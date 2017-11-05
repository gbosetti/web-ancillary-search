var serviceCreator = angular.module("ServiceCreator", ['ui.router']);

serviceCreator.config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.when("", "/ServiceNameDefinition");

    $stateProvider
        .state("ServiceNameDefinition", {
            url: "/ServiceNameDefinition",
            templateUrl: "service-name-definition.html",
            controller: 'ServiceNameController'
        })
        .state("ServiceInput", {
            url: "/ServiceInput",
            templateUrl: "service-input.html"
        });   
});

browser.runtime.onMessage.addListener(function callServiceNameActions(request, sender, sendResponse) {

  if(request.args){
    var controller = angular.element(document.querySelector(request.args.scoped)).scope();
    if(controller[request.call]){
      controller[request.call](request.args);
    }
  }
});

