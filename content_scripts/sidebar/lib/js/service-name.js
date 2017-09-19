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