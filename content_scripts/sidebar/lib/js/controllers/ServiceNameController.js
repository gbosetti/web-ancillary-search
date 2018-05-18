serviceCreator.controller('ServiceNameController', function($scope, $state, ServiceService) {
  AbstractController.call(this, $scope, $state, ServiceService);

  $scope.service = {
    name: "",
    url: undefined
  };

  $scope.initialName;

  $scope.loadDataModel = function() {
    ServiceService.getService().then(function(service) {
      if (service) {
        $scope.service.name = service.name;
        $scope.initialName = service.name;
      }
    });

    browser.runtime.sendMessage({call: "getCurrentUrl"}).then(url => {
      console.log(url);
      $scope.service.url = url;
    });
  };

  $scope.saveFullDataWithCurrentKey = function() {

    ServiceService.setCurrentServiceKey($scope.service.name);
    ServiceService.setName($scope.service.name).then(function() {
      ServiceService.updateServices();
      browser.runtime.sendMessage({call: "populateApisMenu"});
    });
    ServiceService.setUrl($scope.service.url);
  };

  $scope.saveDataModel = function() {

    if ($scope.service.name == undefined || $scope.service.name.trim() == '')
      return;

    if ($scope.initialName != undefined && $scope.initialName != $scope.service.name) {
      //update name
      ServiceService.updateServiceKey($scope.initialName, $scope.service.name).then(function() {
        $scope.saveFullDataWithCurrentKey();
      });
    } else
      $scope.saveFullDataWithCurrentKey();
    }
  ;
  $scope.saveUrl = function() {
    ServiceService.setUrl($scope.service.url);
  };

  $scope.getValidationRules = function() {
    return {
      "rules": {
        "search_service_name": {
          "minlength": 2,
          "required": true
        }
      },
      "messages": {
        search_service_name: browser.i18n.getMessage("this_field_is_required")
      }
    };
  }
  $scope.loadSubformBehaviour = function() {

    $scope.callPlaceholderNameAdaptation();
    $scope.focusElement("#search_service_name");
  };

  $scope.callPlaceholderNameAdaptation = function() {
    //The only way I ound to communicate the iframe content to the outside
    browser.runtime.sendMessage({
      call: "adaptPlaceholder",
      args: {
        scoped: "#search_service_name",
        callback: 'adaptPlaceholderExample'
      }
    });
  };

  $scope.adaptPlaceholderExample = function(data) {
    document.querySelector("#search_service_name").setAttribute("placeholder", document.querySelector("#search_service_name").getAttribute("placeholder") + " " + data.domainName);
  };

  $scope.removeErrorMessages = function() {
    $scope.hideErrorMessage("nameAlreadyExistsError");
  };

  $scope.loadNextStep = function(nextState) {
    if ($scope.areRequirementsMet()) {
      ServiceService.uniqueNameService($scope.service.name).then(function(nameAlreadyExists) {

        if (!nameAlreadyExists) {

          $scope.saveDataModel();
          $scope.undoActionsOnDom();
          ServiceService.setBuildingStrategy("ExistingServiceEdition"); //Since the service is created, and the user may go forwards and back to this form ans he needs the new strategy to check for the uniqueName
          $state.go(nextState);
        } else {
          $scope.showErrorMessage("nameAlreadyExistsError", "#search_service_name", "service_name_already_exists");
          $scope.focusElement("#search_service_name");
        };
      });
    };
  };

  $scope.initialize();
});
