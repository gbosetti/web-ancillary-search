function AbstractController ($scope, $state) {
    $scope.localize = function() {
      var elemsToTranslate = document.querySelectorAll("[i18n-data]");
      if(elemsToTranslate.length > 0)
        elemsToTranslate.forEach(function(elem){
          var label = elem.getAttribute("i18n-data");
          var targetAttr = elem.getAttribute("i18n-target-attr") || "innerHTML";
          elem[targetAttr] = browser.i18n.getMessage(label);
      });
    };
    $scope.focusElement = function(selector) {
        document.querySelector(selector).focus();
    };
    $scope.loadValidationRules = function() {};
    $scope.loadSubformBehaviour = function() {};
    $scope.initialize = function() { //Do not call this methid from the constructor --> Loading error.

      $scope.loadValidationRules();
      $scope.loadSubformBehaviour();
      $scope.localize();
    };
    $scope.enableDomElementSelection = function(controlsSelector, callbackMessage, scoped) {
      browser.runtime.sendMessage({ 
        "call": "enableElementSelection",
        "args": {
          targetElementSelector: controlsSelector,
          onElementSelection: callbackMessage,
          scoped: scoped
        }
      });
    };
    $scope.disableDomElementSelection = function(selector) {
      browser.runtime.sendMessage({ 
        "call": "disableElementSelection",
        "args": { "selector": selector }
      });
    };
}