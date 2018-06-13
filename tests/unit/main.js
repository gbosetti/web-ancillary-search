"use strict";

describe("h1Manager.js", function() {
  describe("browserAction", function() {
    it("should register a listener for onClicked", function() {
      sinon.assert.calledOnce(browser.browserAction.onClicked.addListener);
    });
  });
});
