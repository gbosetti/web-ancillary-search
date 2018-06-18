class ClickBasedTrigger extends TriggerMechanism {
  constructor(client, props) {
    super(client, props);

    this.selector = undefined;
    this.preview = undefined;
  }

  getProperties() {
    return {
      className: this.constructor.name,
      selector: this.selector,
      preview: this.preview
    };
  }

  loadParamsConfigControls() {
    this.client.enableDomElementSelection(
      this.client.triggablesSelector,
      "onTriggerSelection",
      ".container"
    );

    this.client.addParamsConfigurationControls(this.client.createPreviewControl(
      "user-selected-trigger-element",
      "selected_trigger_control",
      this.preview
    ));
  }

  loadSubformBehaviour() {
    if (this.preview) {
      this.client.showAllHiddenElements();
      return;
    }

    this.client.hideFormElement("#trigger_mechanism_params_area");
    this.client.hideFormElement(".next");
  }

  undoActionsOnDom() {
    this.client.disableDomElementSelection(this.client.triggablesSelector);
  }

  getMissingRequirementLocalizedId() {
    return "click_on_trigger_error";
  }

  areRequirementsMet() {
    return !!(this.selector);
  }

  onTriggerSelection(data) {
    this.client.showAllHiddenElements();
    this.client.loadPreview("#user-selected-trigger-element-img", data.previewSource);
    this.selector = data.selectors["1"][0];
    this.preview = data.previewSource;
    this.removeErrorMessage();
  }
}
