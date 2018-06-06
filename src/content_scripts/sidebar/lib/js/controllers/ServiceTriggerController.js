serviceCreator.controller('ServiceTriggerController', function($scope, $state, ServiceService) {
  AbstractController.call(this, $scope, $state, ServiceService);

  $scope.service = {
    trigger: {
      strategy: new UnsetTrigger($scope)
    }
  };

  $scope.loadDataModel = function() {
    ServiceService.getService().then(function(service) {

      $scope.associateTriggeringStrategiesBehaviour(service.trigger.strategy);
    });
  };

  $scope.saveDataModel = function() {
    ServiceService.setTrigger({"strategy": $scope.service.trigger.strategy.getProperties()});
  };

  $scope.loadValidationRules = function() {};

  $scope.undoActionsOnDom = function() {
    $scope.service.trigger.strategy.undoActionsOnDom();
  };

  $scope.loadSubformBehaviour = function() {
    //mowing this to loadDataModel because some of the UI depend on the strategy
  };

  $scope.onTriggerSelection = function(data) {
    $scope.service.trigger.strategy.onTriggerSelection(data);
  }
  $scope.showMissingRequirementMessage = function() {
    $scope.service.trigger.strategy.showMissingRequirementMessage();
  };

  $scope.areRequirementsMet = function() {
    return $scope.service.trigger.strategy.areRequirementsMet();
  };

  $scope.associateTriggeringStrategiesBehaviour = function(strategy) {
    document.querySelector('#trigger_mechanism').value = strategy.className;
    document.querySelector('#trigger_mechanism').onchange = function() {
      $scope.clearTriggeringStrategyParamsArea();
      $scope.service.trigger.strategy.undoActionsOnDom();
      /* TODO window not contain class names */
      $scope.service.trigger.strategy = new window[this.value]($scope, strategy || {});
      $scope.service.trigger.strategy.loadParamsConfigControls();
      $scope.service.trigger.strategy.loadSubformBehaviour();
    };

    document.querySelector('#trigger_mechanism').onchange();
  };

  $scope.clearTriggeringStrategyParamsArea = function() {
    document.querySelector("#trigger_mechanism_params_area").innerHTML = "";
  };

  $scope.addParamsConfigurationControls = function(controls) {
    document.querySelector("#trigger_mechanism_params_area").appendChild(controls);
  };

  $scope.isElementSelected = function(elemType) {
    return ($scope.service.userDefInputXpath)
      ? true
      : false;
  };

  $scope.initialize();
});
