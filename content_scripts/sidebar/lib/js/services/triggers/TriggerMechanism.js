function TriggerMechanism(client, props) {
  this.loadProperties = function(data) {
    if (data) {
      var me = this;
      Object.keys(data).forEach(function(key) {
        me[key] = data[key];
      });
    }
  }

  this.loadParamsConfigControls = function() {};

  this.loadSubformBehaviour = function() {};

  this.getProperties = function() {
    return {};
  };

  this.undoActionsOnDom = function() {};

  this.areRequirementsMet = function() {
    return false;
  };

  this.showMissingRequirementMessage = function() {
    if (!client.hasErrorMessage("strategy-error")) { //Avoiding extras
      client.showErrorMessage("strategy-error", "#trigger_mechanism_params_area", this.getMissingRequirementLocalizedId());
    }
  };

  this.getMissingRequirementLocalizedId = function() {
    return "default_missing_requirement"
  };

  this.removeErrorMessage = function() {
    if (client.hasErrorMessage("strategy-error")) {
      client.removeErrorMessage("strategy-error");
    }
  };

  this.onTriggerSelection = function(data) {
    console.log("default onTriggerSelection");
  };

  this.loadProperties(props);
}
