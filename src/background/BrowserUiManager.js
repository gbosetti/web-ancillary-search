class BrowserUiManager {
  constructor() {
    this.browserActionsClicks = {};
    //this.mainMenu = this.createExtensionMainMenu(); No tiene sentido porque después te lo mueve como quiere
    this.templatesCreator = new TemplatesCreator();
    this.searchTool = new SearchTool();
    this.listenForTabChanges();
  }

  onVisualizationLoaded(data) {
    return new Promise((resolve, reject) => {
      this.executeOnCurrentTab(tab => {
        this.searchTool.onVisualizationLoaded(tab).then(retData => {
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
    this.executeOnCurrentTab(tab => {
      this.templatesCreator.selectMatchingElements(tab, data);
    });
  }

  removeFullSelectionStyle(data) {
    this.executeOnCurrentTab(tab => {
      this.templatesCreator.removeFullSelectionStyle(tab);
    });
  }

  onFrameReadyForLoadingUrl() {
    this.templatesCreator.onFrameReadyForLoadingUrl();
  }

  onSidebarClosed(data) {
    this.executeOnCurrentTab(tab => {
      this.templatesCreator.onSidebarClosed(tab);
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
    this.executeOnCurrentTab(tab => {
      this.templatesCreator.adaptPlaceholder(tab, data);
    });
  }

  getCurrentUrl(data) {
    return new Promise((resolve, reject) => {
      this.executeOnCurrentTab(tab => resolve(tab.url));
    });
  }

  getServices(data) {
    return this.templatesCreator.getServices();
  }

  setServices(data) {
    return this.templatesCreator.setServices(data);
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
      this.executeOnCurrentTab(function(tab) {
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
    this.executeOnCurrentTab(tab => {
      this.templatesCreator.enableElementSelection(tab, data);
    });
  }

  enableFullPathElementSelection(data) {
    this.executeOnCurrentTab(tab => {
      this.templatesCreator.enableFullPathElementSelection(tab, data);
    });
  }

  enableMultipleRefElementSelection(data) {
    this.executeOnCurrentTab(tab => {
      this.templatesCreator.enableMultipleRefElementSelection(tab, data);
    });
  }

  disableElementSelection(data) {
    this.executeOnCurrentTab(tab => {
      this.templatesCreator.disableElementSelection(tab, data.selector);
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
    this.executeOnCurrentTab(currentTab => {
      if (this.getBrowserActionClicksInTab(tab.id) % 2 == 0) {
        this.enableBrowserAction(tab);
        return;
      }

      this.disableBrowserAction(tab);
    })
  }

  highlightInDom(data) {
    this.executeOnCurrentTab(tab => {
      this.templatesCreator.highlightMatchingElements(tab, data);
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
