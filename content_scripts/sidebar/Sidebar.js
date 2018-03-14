function Sidebar(){
	this.widget;
	this.createUI();
	this.displayStatus = new ClosedSidebar(this);
	this.positioningStatus = new RightSidedBar(this);
	//this.open();
}
Sidebar.prototype.toggle = function() { 
	this.displayStatus.toggle();
};
Sidebar.prototype.open = function() {
	this.displayStatus.open();
};
Sidebar.prototype.close = function() {
	this.displayStatus.close();
};
Sidebar.prototype.toggleSide = function() {
	this.positioningStatus.toggleSide();
};
Sidebar.prototype.getIframe = function() {
	return this.widget.children[1];
};
Sidebar.prototype.loadUrl = function(data) {

	this.getIframe().src = data.url;
	/*var me = this;
	this.getIframe().onload = function(){
		me.localize(this.contentWindow.document);
		me.loadContentScripts(data.filePaths, this.contentWindow.document);
	};*/
};
Sidebar.prototype.loadContentScripts = function(filePaths, doc) {
	
	new ContentResourcesLoader().syncLoadScripts(filePaths, doc);
};
Sidebar.prototype.moveLeft = function() {
	
	this.widget.style.right = "";
	this.widget.children[0].style.right = "";

	this.widget.style.left = "10px";
	this.widget.children[0].style.left = "5px";

	this.repositionButton.style.transform = "";
	this.widget.children[0].insertBefore(this.closeButton, this.repositionButton);
};
Sidebar.prototype.moveRight = function() {
	
	this.widget.style.left = "";
	this.widget.children[0].style.left = "";

	this.widget.style.right = "10px";
	this.widget.children[0].style.right = "5px";

	this.repositionButton.style.transform = "rotate(180deg)";
	this.widget.children[0].insertBefore(this.repositionButton, this.closeButton);
};
Sidebar.prototype.createUI = function(filePaths) {

	var fragment = document.createDocumentFragment(); //for performance
	this.widget = this.createContainer();
	this.widget.appendChild(this.createSidebarControls());

	var me = this;
	var frame = this.createIframe();
	this.widget.appendChild(frame);

	fragment.appendChild(this.widget);
	document.body.appendChild(fragment);
};
Sidebar.prototype.createContainer = function() {
	
	var container = document.createElement("div");
		container.id = this.toolAcronym() + "-sidebar";
		container.style.background = "white";
		container.style.position = "fixed";
		container.style.top = "10px";
		container.style.left = "10px";
		container.style.bottom = "10px";
		container.style.margin = "0px";
		container.style.padding = "0px";
		container.style.zIndex = "99999999";
		container.style.boxShadow = "3px 3px 20px rgba(0, 0, 0, 0.3)";
		container.style.width = "300px";
		container.style.margin = "1px solid gray";
	return container;
};
Sidebar.prototype.toolAcronym = function() {
	return "andes";
}
Sidebar.prototype.createToggleSideButton = function() {

	var sidebar = this;
	var btn = document.createElement("img");
		btn.id = this.toolAcronym() + "-reposition-button";
		btn.setAttribute("src", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4QsBEQ0AduqD+QAABTdJREFUSMeNll9oU1sWxn8nOSe9QZtkYloFFSYPap3WokKMIr1Ie5EZhOb2ZaR9EeSCb1cw7+XSFx8LFXxQRH3TgQa1yMxLUqzSxpSondIp5dKSQiwdW0+Sqa1Nztln3ZckpP4bN3zncM5e6/v22nvtvbbG15sGaMVisaepqalL1/Uzbrf7L5qm7RWR/yql/mPb9lS5XH4eCASSgFTxXU0D3IVC4Wel1Ix8R1NKzRQKhZ8Bd9X/M8JPv3XLsv6p63oPwOzsLNPT08zOzpLL5VhbW2PPnj2Ew2E6OzuJRCIcO3YMANu2k4Zh/A2wG6PSviDwUtf1E/l8nsePH/PkyRNKpRJutxsRwbbtuoOIEAwG6e3tJRaLceDAAWzbfm0YRrRRSGsUqFQq/zIMo3tubo67d+8yMTGB4zhomlaH4ziICCI7p//cuXNcvnyZ9vZ2LMtKeTyev9aEXFUb18rKSq9hGN35fJ579+6RyWRwu93Yto1lWTtQqVRQSuE4Th2pVIo7d+6Qz+cxDKN7ZWWlF3BRfWiAHgqFfhMRHjx4wIsXL7Btm83NTSzLolwuc+jQIW7evMnTp0+5ffs2nZ2dbG9vY1kWSimUUiSTSUZHRwEIhUK/ATqguQBtcXHxJ8MwOjKZDGNjY1iWRbFYxLbtOt68ecPDhw8plUpEo1GuXbvGmTNnKJfL2LaN4zgopUgkEszMzGAYRsfi4uJPNRG3z+f70bZtkskk79+/58OHD1iWxfb2dl2kUqnw6NEjRkZGyOVyHD9+nCtXrnDixAksy8K2bZRSvHv3jsnJSQB8Pt+PgNsFuL1eb3Rzc5PXr1/XHWpOjdNRqVQYGxtjeHiYhYUFotEo8Xics2fP1m2UUmSzWQC8Xm8UcOuAy+PxtJmmyfLycn1BA4EAfX19eDyeeiY5jlPPplKpBEA0GkXTNGqDFBHm5+cBaGpqagNcOuDSdT0kIpimWRdpbW3l6tWr+P3+/3tEnDp1ilgsxvT0NACrq6sA6LoeqoloSql1n8+3t7m5mfX19brh8PDwjkhqb03TOH/+PJFIBIBMJsPo6ChKKQBaW1trJ8A6oOmAbG1t/b579+69bW1tTExMALC+vs6tW7dQSn22+S5evIjP5wMgnU5z48YNMplMvf/w4cMAbG1t/V7bjI5pmlld14lEIjsW8Eu7+8KFC8TjcY4cOUI6neb69eukUqkdfidPngTANM0s4LgAJ5fLTQF0dXURDAZ3ODQK9PX1EY/HCYfDvHr1ipGREaampuqZqJQiGAzS1dUFQJXXATCAlo2NjQURkaGhIQkGg5+hp6dHnj17JsvLy/L8+XOJxWJftBsaGhIRkY2NjQWgpcqPC2geHx//RURkaWlJBgYGxO/370AoFJKOjo46Pu33+/0yMDAgS0tLIiIyPj7+C9BcO780oAloNU1zUkQkm81Kf3+/NDc3fzf6+/slm82KiIhpmpNAa5W3Xk7cwC7gYKlUmq9FNDg4KOFwWHbt2vVVhMNhGRwcrEdQKpXmgYNVPvdn9QTwAn9aW1v7RygUOgXw8uVLUqkU6XSaubk5VldX2bdvH+3t7Zw+fZru7m6i0Wgt7TMtLS1/BwrAx08rZE3IAHzAwUQi8WuhUFj8nhpfKBQWE4nEr9UIfFUe7Zs1HvBUw/Xdv3+/5+jRo6f379/fGQgE/uz1egMfP34sFovF3Nu3b/89Pz+fvnTpUhL4H7AJVL5V4xv/uRrEfqiiqWGEAlhAGdiuokbufGmKvnnvqi6euyrsahBxqlBVfPXe9QdGK3hHsO4WQAAAAABJRU5ErkJggg==");
		btn.style.zIndex = "999999999"; 
		btn.style.cursor = "pointer";
		btn.addEventListener('click', function() {
			sidebar.toggleSide();
		}, false);

	return btn;
}
Sidebar.prototype.createCloseButton = function() {
	var btn = document.createElement("img");
		btn.id = this.toolAcronym() + "-close-button";
		btn.setAttribute("src", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyRpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoTWFjaW50b3NoKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDoxNDMxM0JBQUFCRTUxMUUyODZCQ0IyQzQxNEVBNDQ0NyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDozNEI0Q0E1NkFDMDExMUUyODZCQ0IyQzQxNEVBNDQ0NyI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjE0MzEzQkE4QUJFNTExRTI4NkJDQjJDNDE0RUE0NDQ3IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjE0MzEzQkE5QUJFNTExRTI4NkJDQjJDNDE0RUE0NDQ3Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+VICatgAAA6dJREFUeNqcVktLW1EQnjxMKqkhVdMKWogKUmsNVLCmixSJXVgXsauCIAguXBb8A1JcKd26VXBbUNBNu9AgFKJWpSRqQy2RgA+sBhMrVZOY3M53ODdc85DUgUnOnTPzfec5c3RUXHTQeDzeZTab3Uaj8aXBYHiq0+keKYryO51O/7i+vl5OJBJfbTbbIvsqUksSgBtisdhbBgooJQj84I84GZ8HmPttTKVSn3nkXTBsbm7S2toaBYNB2t3dpWg0StXV1dTQ0EBOp5Pa29uptbVVBPPMFsvKyt6gqZ2VrgDBKhM839/fp7m5OZqfn6fT09Oi066srCSv10u9vb1UV1cHou9M1KEl0mkJksnkF3bwbG9v09TUFC0tLZW6xNTZ2UmDg4PU0tJCPFCfyWTqVon00kd/eHjoBQFmMDk5ST6fjzKZTMkKf8QhHjjAAy7JHzELXucPMMzMzNDCwgLxZv63Ig7xEIlnBL4gCYfDr5n9WSAQoNnZ2bxRjo2NFRx9ITvigQM84KokBqvV+grsfr+fjo+Pb4xufHycenp6aGtr64Yd37CjX2tHPHAgEtcgSMrLy3EaaGNjI28JhoeHs5sbCoWEDf+qoD83BjgQiStI9Hyjn2hBcrWxsTELurOzk23DXshfHYTE1WPT7/OljYNRDSomkUgk23Y4HEX9OP0Q7weaaU5DNrHxfIGisFRVVRU9OVoClbCYL3BkBoiqG69cXFz8grGpqangKdrb28uC19bWZtuwF/IHDkTiisuY4bQhdqqtrS1vVBMTE1nQmpoaYcO/KujPjQEOROJmBAlPfRlGt9stcpE2YGhoSJx9u91+w45v2NGvtSMeOHJJgZtBu4zVfn5+/hNpe3R0VGHHOyviIcADLvAxExynq/X19Y9g7O/vp+7u7julFcQhHiLxriS+yF1m1oe8hn6Mgi+T0tfXp1RUVJSs8EccBDjAk7jZcoKKZmF9fHZ2FoIjFyhlZGREqa+vVywWS1FFP/zgD0E8cCSeIa+eIBOwPjg5OfnEWfQFOlZXV0UaX1lZIdSZo6MjcbpQN1wuF3k8HuroEFkJVfMbH4h33IyxXuZWSJUIh8CKkfDJec91O1xKjYcf/OUMrBJHd2uNZzXJ6Vqnp6e7mpubXXwJnfwqcXDSs11eXvIjJh45ODgIcp5aGRgYwGvlD+tf1uRtNV5r02vI7kk1a0YIgBRrQp6gKw14ptAS3frukptnkMR6DUlGalpq0XfXPwEGAC/2hSkSgXukAAAAAElFTkSuQmCC");
		btn.style.zIndex = "999999999"; 
		btn.style.cursor = "pointer";
		btn.addEventListener('click', function() {
			sidebar.close();
		}, false);
	return btn;
}
Sidebar.prototype.createSidebarControls = function() {

	var sidebar = this;
	var controls = document.createElement("div");
		controls.style.position = "fixed"; 
		controls.style.zIndex = "999999999"; 
		controls.style.left = "5px"; 
		controls.style.top = "5px"; 

	this.closeButton = this.createCloseButton();
	this.repositionButton = this.createToggleSideButton();

	controls.appendChild(this.closeButton);
	controls.appendChild(this.repositionButton);

	return controls;
}
Sidebar.prototype.localize = function(doc) {

	var elemsToTranslate = doc.querySelectorAll("[i18n-data]");
	if(elemsToTranslate.length == 0)
		return;

	elemsToTranslate.forEach(function(elem){
		var label = elem.getAttribute("i18n-data");
		var targetAttr = elem.getAttribute("i18n-target-attr") || "innerHTML";
		elem[targetAttr] = browser.i18n.getMessage(label);
	});
}
Sidebar.prototype.createIframe = function() {
	
	var frame = document.createElement("iframe");
		frame.id = this.toolAcronym() + "-sidebar-frame";
		frame.style.margin = "0px";
		frame.style.border = "0px";
		frame.style.position = "absolute";
		frame.style.top = "0";
		frame.style.bottom = "0";
		frame.style.left = "0";
		frame.style.right = "0";
		frame.style.height = "100%";
		frame.style.width = "100%";
		frame.style.padding = "0px";

	return frame;
};


// RENDERING SIDE STATUS

function PositioningStatus(context){
	this.sidebar = context;
}

function LeftSidedBar(context){
	PositioningStatus.call(this, context);
	this.sidebar = context;
	this.toggleSide = function(){
		context.moveRight();
		context.positioningStatus = new RightSidedBar(context);
	};
}

function RightSidedBar(context){
	PositioningStatus.call(this, context);
	this.sidebar = context;
	this.toggleSide = function(){
		context.moveLeft();
		context.positioningStatus = new LeftSidedBar(context);
	};
	context.moveRight();
}




// OPEN CLOSE STATUS

function SidebarStatus(context){
	this.sidebar = context;
	this.open = function(){ };
	this.close = function(){};
}

function OpenSidebar(context){

	SidebarStatus.call(this, context);
	this.close = function() {
		context.widget.style.display = "none";
		context.displayStatus = new ClosedSidebar(context);
		browser.runtime.sendMessage({ call: "onSidebarClosed" });
	};
	this.toggle = function() {
		this.close();
	};
}

function ClosedSidebar(context){
	SidebarStatus.call(this, context);
	this.open = function() {
		this.sidebar.widget.style.display = "";
		browser.runtime.sendMessage({ call: "onFrameReadyForLoadingUrl" });

		context.displayStatus = new OpenSidebar(context);
	};
	this.toggle = function() {
		this.open();
	};
}

/////////////////////////////////////////////
var sidebar = new Sidebar();
browser.runtime.onMessage.addListener(function callSidebarActions(request, sender, sendResponse) {

	console.log(request.call + " from Sidebar.js");
	if(sidebar[request.call]) {
		sidebar[request.call](request.args);
	}
});