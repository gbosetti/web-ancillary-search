function EnterBasedTrigger(client, data) {
  TriggerMechanism.call(this, client, data);

  this.loadParamsConfigControls = function() {
    console.log(client);
    client.addParamsConfigurationControls(document.createTextNode("EnterBasedTrigger"));

  }

  this.getProperties = function() {
    return {
      className: this.constructor.name
    };
  };

  this.loadSubformBehaviour = function() {
    client.showAllHiddenElements();
  };

  this.getMissingRequirementLocalizedId = function() {
    return "enter_on_trigger_error"
  };

  this.areRequirementsMet = function() {
    return (this.selector)
      ? true
      : false;
  };

  this.onTriggerSelection = function(data) {
    client.showAllHiddenElements();
    this.removeErrorMessage();
  };
}
