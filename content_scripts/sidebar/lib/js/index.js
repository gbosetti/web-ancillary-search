var serviceCreator = angular.module("ServiceCreator", ['ui.router']);

serviceCreator.config(function ($stateProvider, $urlRouterProvider, $compileProvider) {
    $urlRouterProvider.when("", "/ExistingServiceCheck");

    $stateProvider
        .state("ExistingServiceCheck", {
            url: "/ExistingServiceCheck",
            templateUrl: "existing-service-ckecking.html"
        })
        .state("ServiceName", {
            url: "/ServiceName",
            templateUrl: "service-name.html"
        })
        .state("ServiceInput", {
            url: "/ServiceInput",
            templateUrl: "service-input.html"
        })
        .state("ServiceTrigger", {
            url: "/ServiceTrigger",
            templateUrl: "service-trigger.html"
        })
        .state("ServiceResultsSelection", {
            url: "/ServiceResultsSelection",
            templateUrl: "service-results-selection.html"
        })
        .state("ResultsProperties", {
            url: "/ResultsProperties",
            templateUrl: "results-properties.html"
        })
        .state("ServiceMoreResults", {
            url: "/ServiceMoreResults",
            templateUrl: "service-more-results-strategies.html"
        })
        .state("ServiceMoreResultsSelection", {
            url: "/ServiceMoreResultsSelection",
            templateUrl: "service-more-results-selection.html"
        });


        $compileProvider.imgSrcSanitizationWhitelist(
            /^\s*(https?|ftp|file|chrome-extension|moz-extension):|data:image\//
        );
        $compileProvider.aHrefSanitizationWhitelist(
            /^\s*(https?|ftp|mailto|file|chrome-extension|moz-extension):/
        );
});

browser.runtime.onMessage.addListener(function callServiceNameActions(request, sender, sendResponse) {

  if(request.args){
    //console.log(request);
    var controller = angular.element(document.querySelector(request.args.scoped)).scope();
    if(controller[request.call]){
      controller[request.call](request.args);
    }
  }
});