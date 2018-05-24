const serviceCreator = angular.module("ServiceCreator", ['ui.router']);

serviceCreator.config(function($stateProvider, $urlRouterProvider, $compileProvider) {
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
    .state("ResultsSelection", {
      url: "/ResultsSelection",
      templateUrl: "service-results-selection.html"
    })
    .state("ResultsProperties", {
      url: "/ResultsProperties",
      templateUrl: "results-properties.html"
    })
    .state("ServiceMoreResults", {
      url: "/ServiceMoreResults",
      templateUrl: "more-results-strategies.html"
    })
    .state("MoreResultsOnClick", {
      url: "/MoreResultsOnClick",
      templateUrl: "more-results-on-click.html"
    })
    .state("SortersSelection", {
      url: "/SortersSelection",
      templateUrl: "sorters-selection.html"
    })
    .state("FiltersMechanism", {
      url: "/FiltersMechanism",
      templateUrl: "filters-selection.html"
    })
    .state("EndOfProcess", {
      url: "/EndOfProcess",
      templateUrl: "end-of-process.html"
    });

  $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|file|chrome-extension|moz-extension):|data:image\//);
  $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|chrome-extension|moz-extension):/);
});

browser.runtime.onMessage.addListener(function callServiceNameActions(request, sender) {
  if (!request.args) {
    return;
  }

  const controller = angular.element(document.querySelector(request.args.scoped)).scope();

  if (controller != undefined && controller[request.call]) {
    if (sender.url == undefined) { //tHIS IS TRICKY BUT THE BROWSER IS SENDING THE MESSAGE TWICE, THE SAME CALL BUT WITH NO URL
      console.log("\n\n\n" + request.call + " from index.js (sidebar)", sender);
      controller[request.call](request.args);
    }
  }
});
