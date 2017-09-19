$('form').validate({    
    rules: {
        search_service_name: {
            minlength: 2,
            required: true
        }
    }
});
document.querySelector(".next > button").onclick = function(){   
    if($("form").valid())
        alert("impec!");
}
document.querySelector("#search_service_name").setAttribute(
	"placeholder", 
	document.querySelector("#search_service_name").getAttribute("placeholder") + " Amazon"
	//window.parent.window.location.host <- no permissions
);

//The only way I ound to communicate the iframe content to the outside
browser.runtime.sendMessage({
	call: "loadXpaths",
	args: {
		name: "hola"
	}
});