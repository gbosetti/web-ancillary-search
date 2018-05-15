function EnterBasedTrigger(client, data) {
  TriggerMechanism.call(this, client, data);

  this.loadParamsConfigControls = function() {
    console.log("EnterBasedTrigger loadParamsConfigControls");
    console.log(client);
    client.addParamsConfigurationControls(document.createTextNode("EnterBasedTrigger"));
  }

  this.getProperties = function() {
    console.log("EnterBasedTrigger getProperties");
    return {
      className: this.constructor.name,
    };
  };

  this.loadSubformBehaviour = function() {
    console.log("EnterBasedTrigger loadSubformBehaviour");
    client.showAllHiddenElements();
  };

  this.areRequirementsMet = function() {
    console.log("EnterBasedTrigger areRequirementsMet");
    return true;
  };

  this.onTriggerSelection = function(data) {
    console.log("EnterBasedTrigger onTriggerSelection");
    client.showAllHiddenElements();
    this.removeErrorMessage();
  };
}
