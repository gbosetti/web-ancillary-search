var serviceCreator = angular.module("ServiceCreator", ['ui.router']);

serviceCreator.config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.when("", "/ServiceName");

    $stateProvider
        .state("ServiceName", {
            url: "/ServiceName",
            templateUrl: "service-name-definition.html",
            controller: 'ServiceNameController'
        })
        .state("ServiceInput", {
            url: "/ServiceInput",
            templateUrl: "service-input.html"
        })
        .state("ServiceTrigger", {
            url: "/ServiceTrigger",
            templateUrl: "service-trigger.html"
        }); 
});

browser.runtime.onMessage.addListener(function callServiceNameActions(request, sender, sendResponse) {

  if(request.args){
    console.log(request);
    var controller = angular.element(document.querySelector(request.args.scoped)).scope();
    if(controller[request.call]){
      controller[request.call](request.args);
    }
  }
});

