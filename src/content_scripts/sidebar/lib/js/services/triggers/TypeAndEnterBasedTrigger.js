class TypeAndEnterBasedTrigger extends TriggerMechanism {
  loadParamsConfigControls() {
    this.client.addParamsConfigurationControls(document.createTextNode("TypeAndEnterBasedTrigger"));
  }

  getProperties() {
    return {
      className: this.constructor.name,
    };
  }

  loadSubformBehaviour() {
    this.client.showAllHiddenElements();
  }

  areRequirementsMet() {
    return true;
  }

  onTriggerSelection(data) {
    this.client.showAllHiddenElements();
    this.removeErrorMessage();
  }
}
