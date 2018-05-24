document.addEventListener("DOMContentLoaded", function restoreOptions() {
  
  document.querySelector("option[value=auto]").text = browser.i18n.getMessage("default");
  console.log(document.querySelector("#save"));
  document.querySelector("#save").innerHTML = browser.i18n.getMessage("save");
  
  browser.storage.local.get("lang").then(function setCurrentChoice(result) {
    document.querySelector("#lang").value = result.lang || "auto";
  });

  document.querySelector("form").addEventListener("submit", function saveOptions(e) {
    e.preventDefault();
    browser.storage.local.set({
      lang: document.querySelector("#lang").value
    });
  });
});