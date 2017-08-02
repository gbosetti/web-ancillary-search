document.addEventListener("DOMContentLoaded", function(event) {

	console.log("ready");
 console.log(window); //window no tiene el $
 console.log(event);

 console.log(this);
 console.log(document);

 $('#input-control').bootstrapToggle();

});

	
