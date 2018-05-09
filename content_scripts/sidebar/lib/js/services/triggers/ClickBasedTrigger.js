function ClickBasedTrigger(client, props) {
  this.selector = undefined;
  this.preview = undefined;

  TriggerMechanism.call(this, client, props);

  this.getProperties = function() {
    return {"className": this.constructor.name, "selector": this.selector, "preview": this.preview};
  };

  this.loadParamsConfigControls = function() {
    client.enableDomElementSelection(client.triggablesSelector, "onTriggerSelection", ".container");
    const preview = client.createPreviewControl("user-selected-trigger-element", "selected_trigger_control", this.preview);
    client.addParamsConfigurationControls(preview);
  };

  this.loadSubformBehaviour = function() {
    if (this.preview) {
      client.showAllHiddenElements();
    } else {
      client.hideFormElement("#trigger_mechanism_params_area");
      client.hideFormElement(".next");
    }
  };

  this.undoActionsOnDom = function() {
    client.disableDomElementSelection(client.triggablesSelector);
  };

  this.getMissingRequirementLocalizedId = function() {
    return "click_on_trigger_error"
  };

  this.areRequirementsMet = function() {
    return (this.selector)
      ? true
      : false;
  };

  this.onTriggerSelection = function(data) {
    client.showAllHiddenElements();
    client.loadPreview("#user-selected-trigger-element-img", data.previewSource);
    this.selector = data.selectors["1"][0];
    this.preview = data.previewSource;
    this.removeErrorMessage();
  };
}
