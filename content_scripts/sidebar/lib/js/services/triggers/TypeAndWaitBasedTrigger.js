function TypeAndWaitBasedTrigger(client, data) {
  TriggerMechanism.call(this, client, data);

  this.loadParamsConfigControls = function() {
    client.addParamsConfigurationControls(document.createTextNode("TypeAndWaitBasedTrigger"));
  }

  this.getProperties = function() {
    return {
      className: this.constructor.name,
    };
  };

  this.loadSubformBehaviour = function() {
    client.showAllHiddenElements();
  };

  this.areRequirementsMet = function() {
    return true;
  };

  this.onTriggerSelection = function(data) {
    client.showAllHiddenElements();
    this.removeErrorMessage();
  };
}
