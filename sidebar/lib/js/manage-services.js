window.addEventListener("load", (e) => {
	document.querySelector("#define-new-service").addEventListener("click", function(evt){

		//No usar window.open porque lso bloqueadores previenen que se ejecute
		evt.preventDefault();
		browser.sidebarAction.setPanel({ 
		   panel: browser.extension.getURL("/sidebar/concept-definition.html")   
		}); 
	});
});