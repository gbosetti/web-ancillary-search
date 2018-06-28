class LocalStorage extends Storage {
  errorHandler(err) {
    if (err) {
      throw err;
    }
  }

  clear() {
    return browser.storage.local.clear()
      .catch(this.errorHandler);
  }

  get(key) {
    return browser.storage.local.get(key)
      .catch(this.errorHandler);
  }

  set(key, data) {
    return browser.storage.local.set({
      [key]: data
    }).catch(this.errorHandler);
  }

  remove(key) {
    return browser.storage.local.remove(key)
      .catch(this.errorHandler);
  }
}
