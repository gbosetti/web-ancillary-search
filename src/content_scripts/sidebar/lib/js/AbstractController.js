function AbstractController($scope, $state, ServiceService) {
  $scope.fileDescription = "default file, please override in subclass";
  $scope.triggablesSelector = "input, button, a, img:not(#andes-close-button):not(#andes-reposition-button)";

  $scope.localize = function() {
    const elemsToTranslate = document.querySelectorAll("[i18n-data]");
    if (elemsToTranslate.length > 0) {
      elemsToTranslate.forEach(function(elem) {
        const label = elem.getAttribute("i18n-data");
        const targetAttr = elem.getAttribute("i18n-target-attr") || "innerHTML";
        elem[targetAttr] = browser.i18n.getMessage(label);
      });
    }
  };

  $scope.loadDataModel = function() {};

  $scope.saveDataModel = function() {};

  $scope.loadValidationRules = function() {
    if (this.getValidationRules()) {
      $('form').validate(this.getValidationRules());
    }
  };

  $scope.getValidationRules = function() {};

  $scope.evaluateValidationRules = function() {
    const rules = this.getValidationRules();
    if (rules) {
      return $("form").valid();
    }

    return false;
  };

  $scope.areRequirementsMet = function() {
    return this.evaluateValidationRules();
  };

  $scope.focusElement = function(selector) {
    document.querySelector(selector).focus();
  };

  $scope.loadSubformBehaviour = function() {};

  $scope.enableDomElementSelection = function(
    controlsSelector, callbackMessage, scoped, 
    scrapperClass, refElemSelector, removeStyleOnSelection, 
    generateRelativeSelector, generatesSingleElemSelectors, justFullPaths) {

    console.log("just full llega", justFullPaths);
    removeStyleOnSelection = (removeStyleOnSelection == undefined)? true: removeStyleOnSelection;
    generatesSingleElemSelectors = (generatesSingleElemSelectors == undefined)? false: generatesSingleElemSelectors;
    justFullPaths = (justFullPaths == undefined)? false: justFullPaths;

    console.log("just full", justFullPaths);


    return browser.runtime.sendMessage({
      call: "enableElementSelection",
      args: {
        "targetElementSelector": controlsSelector,
        "onElementSelection": callbackMessage,
        "scoped": scoped,
        "scrapperClass": scrapperClass || "QuerySelectorScrapper",
        "refElemSelector": refElemSelector || undefined,
        "removeStyleOnSelection": removeStyleOnSelection,
        "generateRelativeSelector": generateRelativeSelector || false,
        "generatesSingleElemSelectors": generatesSingleElemSelectors,
        "justFullPaths": justFullPaths
      }
    });
  };

  $scope.disableDomElementSelection = function(selector) {
    browser.runtime.sendMessage({
      "call": "disableElementSelection",
      "args": {
        "selector": selector
      }
    });
  };

  $scope.createPreviewControl = function(previewElemId, localizedDescriptionId, source) {
    const formGroup = document.createElement("div");
    formGroup.setAttribute("id", previewElemId);
    formGroup.setAttribute("class", "form-group hidden");

    const label = document.createElement("label");
    label.innerHTML = browser.i18n.getMessage(localizedDescriptionId);
    formGroup.appendChild(label);

    const imgContainer = document.createElement("div");
    imgContainer.className = "preview-container";

    const previewImage = document.createElement("img");
    previewImage.setAttribute("id", previewElemId + "-img");
    previewImage.setAttribute("class", "image-preview");
    previewImage.setAttribute("src", source || "lib/img/no-preview.png");

    imgContainer.appendChild(previewImage);
    formGroup.appendChild(imgContainer);

    return formGroup;
  };

  $scope.showFormElement = function(selector) {
    const elem = document.querySelector(selector);
    elem.style.display = "";

    if (elem.classList.contains("hidden")) {
      elem.classList.remove("hidden");
    }
  };

  $scope.showAllHiddenElements = function() {
    document.querySelectorAll(".hidden").forEach(function(elem) {
      elem.classList.remove("hidden");
      elem.style.display = '';
    });
  };

  $scope.hideFormElement = function(selector) {
    document.querySelector(selector).style.display = "none";
  };

  $scope.loadPreview = function(selector, src) {
    document.querySelector(selector).src = src;
  };

  $scope.removeFullSelectionStyle = function() {
    browser.runtime.sendMessage({"call": "removeFullSelectionStyle"});
  };

  $scope.undoActionsOnDom = function(aState) {};

  $scope.loadPrevStep = function(aState) {
    $scope.saveDataModel();
    $scope.undoActionsOnDom();
    $state.go(aState)
  };

  $scope.loadNextStep = function(nextState) {
    if ($scope.areRequirementsMet()) {
      $scope.saveDataModel();
      $scope.undoActionsOnDom();
      $state.go(nextState);
      ServiceService.updateServices();
    }
  };

  $scope.initialize = function() { //Do not call this methid from the constructor --> Loading error.
    document.body.scrollTop = document.documentElement.scrollTop = 0;
    $scope.loadDataModel();
    $scope.loadValidationRules();
    $scope.loadSubformBehaviour();
    $scope.localize();
  };

  $scope.showErrorMessageByElems = function(id, referenceNode, localizationString) {
    const formGroup = document.createElement("div");
    formGroup.setAttribute("class", "form-group");
    formGroup.setAttribute("id", id);

    const label = document.createElement("label");
    label.setAttribute("class", "error");
    label.innerHTML = browser.i18n.getMessage(localizationString);

    formGroup.appendChild(label);

    referenceNode.parentElement.insertBefore(formGroup, referenceNode.nextSibling);
    referenceNode.focus();
  };

  $scope.showErrorMessage = function(id, afterPositionSelector, localizationString) {
    this.showErrorMessageByElems(id, document.querySelector(afterPositionSelector), localizationString);
  };

  $scope.hideErrorMessage = function(id) {
    $scope.removeFormElement("#" + id);
  };

  $scope.hasErrorMessage = function(id) {
    return (document.querySelector("#" + id))
      ? true
      : false;
  };

  $scope.removeFormElementById = function(id) {
    const errorElem = document.getElementById(id);
    if (errorElem) {
      errorElem.remove();
    }
  };

  $scope.removeFormElement = function(selector) {
    if (document.querySelector(selector)) {
      document.querySelector(selector).remove();
    }
  };

  $scope.unselectAllRadios = function() {
    document.querySelectorAll(".list-group-item").forEach(function(option) {
      if (option.classList != undefined && option.classList.contains("active-item")) {
        option.classList.remove("active-item");
      }
    });
  };
}
