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
}