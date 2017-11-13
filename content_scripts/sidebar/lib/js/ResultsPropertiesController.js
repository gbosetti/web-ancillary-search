serviceCreator.controller('ResultsPropertiesController', function($scope, $state, ServiceService) {

    AbstractController.call(this, $scope, $state);
    $scope.service = { 
      results: {
        properties: {}
      }
    };
    /*
        {
          'name': 'title',
          'relativeSelector': '//a'
        }
    */
    $scope.loadDataModel = function() {
      ServiceService.getService().then(function(service) {

        if(service){
          $scope.service.results.properties = service.results.properties;
        } 

        var selector = $scope.getElementsSelector(service.results.selector.value);
        $scope.loadPropertiesIntoSidebar($scope.service.results.properties);
        
        console.log("enableDomElementSelection", service.results.selector.value);
        $scope.enableDomElementSelection( selector, "onElementSelection", ".well", "XpathScrapper", service.results.selector.value); //".//html[1]/body[1]/div[6]/div[3]/div[10]/div[1]/div[2]/div[1]/div[2]/div[2]/div[1]/div[1]/div[1]/div[1]/div[1]/div[2]/div[1]/div
      }); 
    };
    $scope.getElementsSelector = function(selector) {

      return selector + "//*"; //( selector.length-3, selector.length == "[1]")? selector + "//*": selector + "[1]//*";
    };
    $scope.onElementSelection = function(data) { //selector exampleValue (will have also a name)
      
      data.name = "";
      data.exampleValue = data.exampleValue.length > 35? data.exampleValue.substring(0, 35) + "..." : data.exampleValue;

      var propControl = this.addPropertyToSidebar(data);
          propControl.querySelector("input").focus();
    };
    $scope.saveDataModel = function() {
      //ServiceService.setResultsName($scope.service.name);
    };
    $scope.areRequirementsMet = function() {
      return true;
    }
    $scope.loadPropertiesIntoSidebar = function(properties) { 
      Object.keys(properties).forEach(function(key) {    
        $scope.addPropertyToSidebar(properties[key]);
      });  
    };
    $scope.removeProperty = function(prop) { 
      
    };
    $scope.addPropertyToSidebar = function(prop) { 
      var property = document.createElement("div");
          property.className = "list-group-item";

      var closebutton = document.createElement("button");
          closebutton.className = "list-item-close-button";
          closebutton.innerHTML = "<span class='glyphicon glyphicon-remove'></span>";
          closebutton.prop = prop;
          closebutton.onclick = function(){
            $scope.removeProperty(this.prop);
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
          propNameInput.className = "form-control";
          propNameInput.value = prop.name;
          propNameGroup.appendChild(propNameInput);

      var propValue = document.createElement("i");
          //propValue.className = "list-group-item-text small";
          propValue.innerHTML = browser.i18n.getMessage("example_value") + ": " + prop.exampleValue; //$scope.listProperties();
          property.appendChild(propValue);

      document.querySelector("#properties").appendChild(property);
      return property; 
    };
    $scope.initialize();
});