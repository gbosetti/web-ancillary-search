serviceCreator.controller('ResultsPropertiesController', function($scope, $state, ServiceService) {

    AbstractController.call(this, $scope, $state, ServiceService);
    $scope.service = { 
      results: {
        selector: '//div[1]',
        properties: {}
      }
    };
    /*
        {
          'name': 'author',
          'relativeSelector': '//a',
          'exampleValue': 'Laura Alcobe'
        }
    */
    $scope.loadDataModel = function() {
      ServiceService.getService().then(function(service) {

        $scope.service = service;
        var selector = $scope.getElementsSelector(service.results.selector.value);
        $scope.loadPropertiesIntoSidebar($scope.service.results.properties);

        $scope.enableDomElementSelection( 
          selector, 
          "onElementSelection", 
          ".well", 
          "XpathScrapper", 
          service.results.selector.value,
          false
        ).then(function(){
          $scope.highlightPropertiesInDom($scope.service.results.properties, $scope.service.results.selector.value);
        });
      }); 
    };
    $scope.loadPrevStep = function(aState) {
      if(this.areRequirementsMet()){
        $scope.saveDataModel();
        $scope.undoActionsOnDom();
        $state.go(aState);
      }
    };
    $scope.undoActionsOnDom = function(aState) {
      
      var elemsSelector = $scope.getElementsSelector($scope.service.results.selector.value);
      $scope.disableDomElementSelection(elemsSelector);
      $scope.removeFullSelectionStyle();
    };
    $scope.arePropertiesDefined = function() {

      var inputs = document.querySelectorAll("input");

      this.removeFormElementById("no_props_error");
      if (inputs == undefined || inputs.length <= 0){
        this.showErrorMessageByElems(
          "no_props_error", 
          document.querySelector(".list-group"), 
          "props_are_required");
        return false;
      };

      return true;
    };
    $scope.arePropertiesValuesDefined = function() {

      var inputs = document.querySelectorAll("input"),
          inputsAreFilled = true;

      for (var i = inputs.length - 1; i >= 0; i--) {
        if(inputs[i].value.length <= 2){
          inputsAreFilled = false;

          this.removeFormElementById(inputs[i].id + "_error");
          this.showErrorMessageByElems(
            inputs[i].id + "_error", 
            inputs[i], 
            "this_field_is_required");
        } else {
          // I don't know why I can not access the elem from the abstract class behaviour. So...
          this.removeFormElementById(inputs[i].id + "_error");
        }
      }

      return inputsAreFilled;
    };
    $scope.areRequirementsMet = function() {
      
      return (this.arePropertiesDefined() && this.arePropertiesValuesDefined());
    };
    $scope.highlightPropertiesInDom = function(properties, containerSelector) {

      Object.keys(properties).forEach(function(key) {   
          //console.log("highlighting: ", key, properties[key].relativeSelector); 
          $scope.highlightPropertyInDom(properties[key].relativeSelector, containerSelector);
      });
    };
    $scope.getElementsSelector = function(selector) {

      return selector + "//*"; //( selector.length-3, selector.length == "[1]")? selector + "//*": selector + "[1]//*";
    };
    $scope.onElementSelection = function(data) { //selector exampleValue (will have also a name)
      
      var prop = {
        "name": "",
        "exampleValue": data.exampleValue.length > 35? data.exampleValue.substring(0, 35) + "..." : data.exampleValue,
        "relativeSelector": data.selectors[Object.keys(data.selectors)[0]][0]
      };

      var propControl = this.addPropertyToSidebar(prop);
      propControl.querySelector("input").focus();

      this.highlightPropertyInDom(prop.relativeSelector, $scope.service.results.selector.value);
      this.removeFormElementById("no_props_error");
    };
    $scope.saveDataModel = function() {

      $scope.service.results.properties = $scope.getUserEditedProperties();
      ServiceService.setProperties($scope.service.results.properties).then(function(){
        ServiceService.updateServices();
      });
    };
    $scope.getUserEditedProperties = function() { 
      var props = {}, propsElems = document.querySelectorAll(".list-group-item");

      for (var i = propsElems.length - 1; i >= 0; i--) {

        var prop = propsElems[i].querySelector("button").prop; 
            prop.name = propsElems[i].querySelector("input").value;

        props[prop.name] = prop;
      };

      return props;
    };
    $scope.loadPropertiesIntoSidebar = function(properties) { 
      Object.keys(properties).forEach(function(key) {  
        $scope.addPropertyToSidebar(properties[key]);
      });  
    };
    $scope.highlightPropertyInDom = function(relativeSelector, refElemSelector) { 
      
      browser.runtime.sendMessage({ 
        "call": "selectMatchingElements",
        "args": { 
          "selector": relativeSelector, 
          "scrapper": "XpathScrapper", 
          "refElemSelector": refElemSelector
        }
      });
    };
    $scope.addPropertyToSidebar = function(prop) { 
      var property = document.createElement("div");
          property.className = "list-group-item";

      var closebutton = document.createElement("button");
          closebutton.className = "list-item-close-button";
          closebutton.innerHTML = "<span class='glyphicon glyphicon-remove'></span>";
          closebutton.prop = prop;
          closebutton.onclick = function(){
            //$scope.removeProperty(this.prop);
            this.parentElement.remove();
          };
          property.appendChild(closebutton);

      var propNameGroup = document.createElement("div");
          propNameGroup.className = "form-group";
          property.appendChild(propNameGroup);

      var propNameLabel = document.createElement("label");
          propNameLabel.innerHTML = browser.i18n.getMessage("property_name");
          propNameGroup.appendChild(propNameLabel);

      var propNameInput = document.createElement("input");
          propNameInput.setAttribute("type", "text");
          propNameInput.className = "form-control resultProperty";
          propNameInput.id = Date.now(); //for the validation
          propNameInput.value = prop.name;
          propNameGroup.appendChild(propNameInput);
          /*$(propNameInput).rules('add', {
              "minlength": 2,
              "required": true
          });*/

      var propValue = document.createElement("i");
          //propValue.className = "list-group-item-text small";
          propValue.innerHTML = browser.i18n.getMessage("example_value") + ": " + prop.exampleValue; //$scope.listProperties();
          property.appendChild(propValue);

      document.querySelector("#properties").appendChild(property);
      return property; 
    };
    $scope.initialize();
});