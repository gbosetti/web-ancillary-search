serviceCreator.controller('ResultsPropertiesController', function($scope, $state, ServiceService) {

    AbstractController.call(this, $scope, $state);
    $scope.service = { 
      properties: {
        title: {
          'name': 'title',
          'relativeSelector': '//a',
          'exampleValue': 'La casa de los conejos'
        },
        authors: {
          'name': 'author',
          'relativeSelector': '//a',
          'exampleValue': 'Laura Alcoba'
        }
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

        if(service)
          $scope.service.properties = service.results.properties;
        
        $scope.loadPropertiesIntoUI($scope.service.properties);
      }); 
    };
    $scope.saveDataModel = function() {
      //ServiceService.setResultsName($scope.service.name);
    };
    $scope.areRequirementsMet = function() {
      return true;
    }
    $scope.loadPropertiesIntoUI = function(properties) { 
      Object.keys(properties).forEach(function(key) {    
        $scope.loadPropertyIntoUI(properties[key]);
      });  
    };
    $scope.removeProperty = function(prop) { 
      
    };
    $scope.loadPropertyIntoUI = function(prop) { 
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
    };
    $scope.initialize();
});