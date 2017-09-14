function Sidebar(){
	this.createUI();
	this.status = new OpenSidebar(this);
}
Sidebar.prototype.toggle = function() { 
	this.status.toggle();
};
Sidebar.prototype.open = function() {
	this.status.open();
};
Sidebar.prototype.close = function() {
	this.status.close();
};
Sidebar.prototype.createUI = function() {

	var fragment = document.createDocumentFragment(); //for performance
	this.widget = this.createContainer();
	this.widget.appendChild(this.createCloseButton());
	this.widget.appendChild(this.createIframe());

	fragment.appendChild(this.widget);
	document.body.appendChild(fragment);
	//document.body.appendChild(this.widget);
};
Sidebar.prototype.createContainer = function() {
	
	var container = document.createElement("div");
		container.id = this.toolAcronym() + "-sidebar";
		container.style.background = "white";
		container.style.position = "fixed";
		container.style.top = "10px";
		container.style.right = "10px";
		container.style.bottom = "10px";
		container.style.margin = "0px";
		container.style.padding = "0px";
		container.style.zIndex = "99999999";
		container.style.boxShadow = "3px 3px 20px rgba(0, 0, 0, 0.3)";
	return container;
};
Sidebar.prototype.toolAcronym = function() {
	return "andes";
}
Sidebar.prototype.createCloseButton = function() {

	var sidebar = this;
	var btn = document.createElement("img");
		btn.id = this.toolAcronym() + "-close-button";
		btn.setAttribute("src", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyRpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoTWFjaW50b3NoKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDoxNDMxM0JBQUFCRTUxMUUyODZCQ0IyQzQxNEVBNDQ0NyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDozNEI0Q0E1NkFDMDExMUUyODZCQ0IyQzQxNEVBNDQ0NyI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjE0MzEzQkE4QUJFNTExRTI4NkJDQjJDNDE0RUE0NDQ3IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjE0MzEzQkE5QUJFNTExRTI4NkJDQjJDNDE0RUE0NDQ3Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+VICatgAAA6dJREFUeNqcVktLW1EQnjxMKqkhVdMKWogKUmsNVLCmixSJXVgXsauCIAguXBb8A1JcKd26VXBbUNBNu9AgFKJWpSRqQy2RgA+sBhMrVZOY3M53ODdc85DUgUnOnTPzfec5c3RUXHTQeDzeZTab3Uaj8aXBYHiq0+keKYryO51O/7i+vl5OJBJfbTbbIvsqUksSgBtisdhbBgooJQj84I84GZ8HmPttTKVSn3nkXTBsbm7S2toaBYNB2t3dpWg0StXV1dTQ0EBOp5Pa29uptbVVBPPMFsvKyt6gqZ2VrgDBKhM839/fp7m5OZqfn6fT09Oi066srCSv10u9vb1UV1cHou9M1KEl0mkJksnkF3bwbG9v09TUFC0tLZW6xNTZ2UmDg4PU0tJCPFCfyWTqVon00kd/eHjoBQFmMDk5ST6fjzKZTMkKf8QhHjjAAy7JHzELXucPMMzMzNDCwgLxZv63Ig7xEIlnBL4gCYfDr5n9WSAQoNnZ2bxRjo2NFRx9ITvigQM84KokBqvV+grsfr+fjo+Pb4xufHycenp6aGtr64Yd37CjX2tHPHAgEtcgSMrLy3EaaGNjI28JhoeHs5sbCoWEDf+qoD83BjgQiStI9Hyjn2hBcrWxsTELurOzk23DXshfHYTE1WPT7/OljYNRDSomkUgk23Y4HEX9OP0Q7weaaU5DNrHxfIGisFRVVRU9OVoClbCYL3BkBoiqG69cXFz8grGpqangKdrb28uC19bWZtuwF/IHDkTiisuY4bQhdqqtrS1vVBMTE1nQmpoaYcO/KujPjQEOROJmBAlPfRlGt9stcpE2YGhoSJx9u91+w45v2NGvtSMeOHJJgZtBu4zVfn5+/hNpe3R0VGHHOyviIcADLvAxExynq/X19Y9g7O/vp+7u7julFcQhHiLxriS+yF1m1oe8hn6Mgi+T0tfXp1RUVJSs8EccBDjAk7jZcoKKZmF9fHZ2FoIjFyhlZGREqa+vVywWS1FFP/zgD0E8cCSeIa+eIBOwPjg5OfnEWfQFOlZXV0UaX1lZIdSZo6MjcbpQN1wuF3k8HuroEFkJVfMbH4h33IyxXuZWSJUIh8CKkfDJec91O1xKjYcf/OUMrBJHd2uNZzXJ6Vqnp6e7mpubXXwJnfwqcXDSs11eXvIjJh45ODgIcp5aGRgYwGvlD+tf1uRtNV5r02vI7kk1a0YIgBRrQp6gKw14ptAS3frukptnkMR6DUlGalpq0XfXPwEGAC/2hSkSgXukAAAAAElFTkSuQmCC");
		btn.style.position = "fixed"; 
		btn.style.right = "5px"; 
		btn.style.top = "5px"; 
		btn.style.zIndex = "999999999"; 
		btn.style.cursor = "pointer";
		btn.addEventListener('click', function() {
			sidebar.close();
		}, false);

	return btn;
}
Sidebar.prototype.createIframe = function() {
	
	var frame = document.createElement("iframe");
		frame.style.top = "0px";
		frame.style.right = "0px";
		frame.style.bottom = "0px";
		frame.style.margin = "0px";
		frame.style.padding = "0px";

	return frame;
};
Sidebar.prototype.create = function() {
	
	var container = document.createElement("div");
		container.style.position = "fixed";
		container.style.top = "10px";
		container.style.right = "10px";
		container.style.bottom = "10px";
		container.style.margin = "0px";
		container.style.padding = "0px";
		container.style.zIndex = "99999999";
		container.style.boxShadow = "3px 3px 20px rgba(0, 0, 0, 0.3)";
		container.style.background = "white";

	return container;
};

function SidebarStatus(context){
	this.sidebar = context;
	this.open = function(){};
	this.close = function(){};
}

function OpenSidebar(context){

	SidebarStatus.call(this, context);
	this.close = function() {
		context.widget.style.display = "none";
		context.status = new ClosedSidebar(context);
		console.log(context.status);
	};
	this.toggle = function() {
		console.log("toggle from open");
		this.close();
	};
}

function ClosedSidebar(context){
	SidebarStatus.call(this, context);
	this.open = function() {
		this.sidebar.widget.style.display = "";
		context.status = new OpenSidebar(context);
	};
	this.toggle = function() {
		console.log("toggle from close");
		this.open();
	};
}


/////////////////////////////////////////////
var sidebar = new Sidebar();
browser.runtime.onMessage.addListener(function callSidebarActions(request, sender, sendResponse) {

	console.log("calling " + request.call + " (content_scripts/sidebar.js)");
	sidebar[request.call](request.args);
});