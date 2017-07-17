window.addEventListener("load", (e) => {

	console.log(e.target); //is the sidebar doc!!

    var sendingMessage = browser.runtime.sendMessage({
        text: "hola!" 

    }).then((result) => {
      console.log("result", result);
    });
});