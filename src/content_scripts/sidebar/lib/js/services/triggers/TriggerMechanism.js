class TriggerMechanism {
  constructor(client, props) {
    this.client = client;
    this.loadProperties(props);
  }

  loadProperties(data) {
    if (!data) {
      return;
    }

    const self = this;
    Object.keys(data).forEach(key => {
      self[key] = data[key]
    });
  }

  loadParamsConfigControls() {}

  loadSubformBehaviour() {}

  getProperties() {
    return {};
  }

  undoActionsOnDom() {}

  areRequirementsMet() {
    return false;
  }

  showMissingRequirementMessage() {
    if (!this.client.hasErrorMessage("strategy-error")) { // Avoiding extras
      this.client.showErrorMessage(
        "strategy-error",
        "#trigger_mechanism_params_area",
        this.getMissingRequirementLocalizedId()
      );
    }
  }

  getMissingRequirementLocalizedId() {
    return "default_missing_requirement";
  }

  removeErrorMessage() {
    if (this.client.hasErrorMessage("strategy-error")) {
      this.client.removeErrorMessage("strategy-error");
    }
  }

  onTriggerSelection(data) {
    console.log("default onTriggerSelection");
  }
}
