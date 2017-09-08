function Sidebar(){
	this.createUI();
	this.state = new ClosedSidebar();
}
Sidebar.prototype.toggle = function() {
	// body...
};
Sidebar.prototype.open = function() {

};
Sidebar.prototype.close = function() {
	// body...
};
Sidebar.prototype.createUI = function() {

	var container = this.createContainer();
	document.body.appendChild(container);
};
Sidebar.prototype.createContainer = function() {
	
	var container = document.createElement("div");
		container.style.position = "fixed";
		container.style.top = "20px";
		container.style.right = "35px";
		container.style.bottom = "20px";
		container.style.margin = "0px";
		container.style.padding = "0px";
		container.style.zIndex = "99999999";
		container.style.boxShadow = "3px 3px 20px rgba(0, 0, 0, 0.3)";
		container.style.background = "rgb(246, 246, 246) none repeat scroll 0% 0%";

	return container;
};



function SidebarStatus(){}
function OpenSidebar(){
	SidebarStatus.call(this)
}
function ClosedSidebar(){
	SidebarStatus.call(this)
}