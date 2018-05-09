function TypeAndWaitBasedTrigger(client, data) {
  TriggerMechanism.call(this, client, data);

  this.loadParamsConfigControls = function() {
    client.addParamsConfigurationControls(document.createTextNode("TypeAndWaitBasedTrigger"));
  }
}
