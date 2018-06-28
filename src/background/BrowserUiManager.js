class BrowserUiManager {
  constructor() {
    this.browserActionsClicks = {};
    //this.mainMenu = this.createExtensionMainMenu(); No tiene sentido porque después te lo mueve como quiere
    this.templatesCreator = new TemplatesCreator();
    this.searchTool = new SearchTool();
    this.listenForTabChanges();
  }

  onVisualizationLoaded(data) {
    const self = this;

    return new Promise((resolve, reject) => {
      self.executeOnCurrentTab(tab => {
        self.searchTool.onVisualizationLoaded(tab).then(retData => {
          retData.domId = data.domId;
          resolve(retData);
        });
      });
    });
  }

  listenForTabChanges() {
    // TODO, FIXME
    /*var me = this;
    this.listenForExternalRetrieval = false;

    browser.tabs.onUpdated.addListener(function handleUpdated(tabId, changeInfo, tabInfo) {

      if(tabInfo.status == "complete"){

        if(me.currentQuerySpec && me.currentQuerySpec.tabId && me.listenForExternalRetrieval){
          me.currentQuerySpec = undefined;
          me.listenForExternalRetrieval = undefined;
          me.presentResultsFromQueriedUrl(tabInfo.url, tabInfo.id);
        }
      }
    });*/
  }

  onElementSelection(data) {
    this.templatesCreator.onElementSelection(data);
  }

  onTriggerSelection(data) {
    this.templatesCreator.onTriggerSelection(data);
  }

  /* onPropsSelection(data) {
    this.templatesCreator.onPropsSelection(data);
  } */

  onResultsContainerSelection(data) {
    this.templatesCreator.onResultsContainerSelection(data);
  }

  populateApisMenu(data) {
    this.searchTool.createContextMenus();
  }

  selectMatchingElements(data) {
    const self = this;

    this.executeOnCurrentTab(tab => {
      self.templatesCreator.selectMatchingElements(tab, data);
    });
  }

  removeFullSelectionStyle(data) {
    const self = this;

    this.executeOnCurrentTab(tab => {
      self.templatesCreator.removeFullSelectionStyle(tab);
    });
  }

  onFrameReadyForLoadingUrl() {
    this.templatesCreator.onFrameReadyForLoadingUrl();
  }

  onSidebarClosed(data) {
    const self = this;

    this.executeOnCurrentTab(tab => {
      self.templatesCreator.onSidebarClosed(tab);
    });
  }

  toggleSidebar() {
    this.templatesCreator.toggleSidebar();
  }

  closeSidebar() {
    this.templatesCreator.closeSidebar();
  }

  loadInputControlSelection(data) {
    this.templatesCreator.loadInputControlSelection(data);
  }

  adaptPlaceholder(data) {
    const self = this;

    this.executeOnCurrentTab(tab => {
      self.templatesCreator.adaptPlaceholder(tab, data);
    });
  }

  getCurrentUrl(data) {
    const self = this;

    return new Promise((resolve, reject) => {
      self.executeOnCurrentTab(tab => resolve(tab.url));
    });
  }

  externalResourcesIframeIsLoaded() {
    //TODO: move this behaviour to the searchTool class

    this.listenForExternalRetrieval = true;
    browser.tabs.sendMessage(this.currentQuerySpec.tabId, {
      call: "extractFromUrl",
      args: this.currentQuerySpec
    });
  }

  presentResultsFromQueriedUrl(data, tabId) {
    //TODO: move this behaviour to the searchTool class

    browser.tabs.remove(tabId);
    return new Promise((resolve, reject) => {
      me.executeOnCurrentTab(function(tab) {
        resolve(data);
      });
    });
  }

  getBrowserActionClicksInTab(tabId) {
    return this.browserActionsClicks[tabId] ?
      this.browserActionsClicks[tabId] :
      0;
  }

  increaseBrowserActionClicksInTab(tabId) {
    this.browserActionsClicks[tabId] = this.getBrowserActionClicksInTab(tabId) + 1;
  }

  presentResults(args) {
    return this.searchTool.presentResults(args.results);
  }

  loadDocumentIntoResultsFrame(data) {
    this.searchTool.loadDocumentIntoResultsFrame(data);
  }

  disableBrowserAction(tab) {
    this.changeBrowserActionIcon({
        16: "icons/logo-disabled-16.png",
        64: "icons/logo-disabled-64.png"
      },
      tab.id, "✗", "gray");

    this.templatesCreator.disableHarvesting(tab);
  }

  enableElementSelection(data) {
    const self = this;

    this.executeOnCurrentTab(tab => {
      self.templatesCreator.enableElementSelection(tab, data);
    });
  }

  disableElementSelection(data) {
    const self = this;

    this.executeOnCurrentTab(tab => {
      self.templatesCreator.disableElementSelection(tab, data.selector);
    });
  }

  enableBrowserAction(tab) {
    this.changeBrowserActionIcon({
        16: "icons/logo-disabled-16.png",
        64: "icons/logo-disabled-64.png"
      },
      tab.id, "✓", "#60DA11");
  }

  openSidebar() {}

  changeBrowserActionIcon(icons, tabId, badgeText, badgeColor) {
    browser.browserAction.setIcon({
      path: icons,
      tabId: tabId
    });

    browser.browserAction.setBadgeText({
      text: badgeText
    });
    browser.browserAction.setBadgeBackgroundColor({
      color: badgeColor
    });

    this.increaseBrowserActionClicksInTab(tabId);
  }

  updateBrowserActionIconByClicks() {
    const self = this;

    this.executeOnCurrentTab(currentTab => {
      if (self.getBrowserActionClicksInTab(tab.id) % 2 == 0) {
        self.enableBrowserAction(tab);
        return;
      }

      self.disableBrowserAction(tab);
    })
  }

  highlightInDom(data) {
    const self = this;

    this.executeOnCurrentTab(tab => {
      self.templatesCreator.highlightMatchingElements(tab, data);
    })
  }

  loadDataForConceptDefinition() {
    this.templatesCreator.loadDataForConceptDefinition();
  }

  setContextualizedElement(extractedData) {
    this.templatesCreator.setContextualizedElement(extractedData);
  }

  executeOnCurrentTab(callback) {
    try {
      browser.tabs.query({
        active: true,
        currentWindow: true
      }).then((tabs) => callback(tabs[0]));
    } catch (e) {
      console.log(err);
    }
  }

  newDocumentWasLoaded(data) {
    return this.searchTool.newDocumentWasLoaded(data);
  }

  startListeningForUrls() {
    return this.searchTool.startListeningForUrls();
  }

  setSearchListeningStatus(data) {
    return this.searchTool.setSearchListeningStatus(data.status);
  }
}
