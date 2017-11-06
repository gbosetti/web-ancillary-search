function AbstractController ($scope, $state) {

    $scope.fileDescription = "default file, please override in subclass";
    $scope.triggablesSelector = "input, button, a, img:not(#andes-close-button):not(#andes-reposition-button)";

    $scope.localize = function() {
      var elemsToTranslate = document.querySelectorAll("[i18n-data]");
      if(elemsToTranslate.length > 0)
        elemsToTranslate.forEach(function(elem){
          var label = elem.getAttribute("i18n-data");
          var targetAttr = elem.getAttribute("i18n-target-attr") || "innerHTML";
          elem[targetAttr] = browser.i18n.getMessage(label);
      });
    };
    $scope.loadDataModel = function() {};
    $scope.saveDataModel = function() {};
    $scope.areRequirementsMet = function(){
      return true;
    };
    $scope.focusElement = function(selector) {
        document.querySelector(selector).focus();
    };
    $scope.loadValidationRules = function() {};
    $scope.loadSubformBehaviour = function() {};
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
    $scope.createPreviewControl = function(previewElemId, localizedDescriptionId){

      var formGroup = document.createElement("div");
        formGroup.setAttribute("id", previewElemId);
        formGroup.setAttribute("class", "form-group hidden");

      var label = document.createElement("label");
        label.innerHTML = browser.i18n.getMessage(localizedDescriptionId);
        formGroup.appendChild(label);

      var imgContainer = document.createElement("div");
      var previewImage = document.createElement("img");
        previewImage.setAttribute("id", previewElemId + "-img");
        previewImage.setAttribute("class", "image-preview");
        previewImage.setAttribute("src", "lib/img/no-preview.png");
      imgContainer.appendChild(previewImage);
      formGroup.appendChild(imgContainer);
      
      return formGroup;
    };
    $scope.showFormElement = function(selector){
      var elem = document.querySelector(selector);
      elem.display = "";
      if(elem.classList.contains("hidden")) elem.classList.remove("hidden");
    };
    $scope.hideFormElement = function(selector){
      document.querySelector(selector).display = "none";
    };
    $scope.loadPreview = function(selector, src){
      document.querySelector(selector).src = src;
    };
    $scope.removeFullSelectionStyle = function(){
      browser.runtime.sendMessage({ "call": "removeFullSelectionStyle" });
    };
    $scope.loadPrevStep = function(aState) {
      $state.go(aState)
    };
    $scope.loadNextStep = function(nextState) {

      if($scope.areRequirementsMet()){
        $scope.saveDataModel();
        $state.go(nextState);
      }
    };
    $scope.initialize = function() { //Do not call this methid from the constructor --> Loading error.

      $scope.loadValidationRules();
      $scope.loadSubformBehaviour();
      $scope.localize();
      $scope.loadDataModel();
    };
}