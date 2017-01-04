//addon es la variable global que el SDK de Firefox pone a disposición para acceder al puerto
//addon is the global var that Firefox SDK provides for accessing the port

function SearchApiNewResultManager(lbundle) {
    this.locale = lbundle;
}
//SearchApiNewResultManager.prototype = new SidebarManager();
SearchApiNewResultManager.prototype.loadResultsTemplate = function (props) {

    this.loadPreview(props);
    addon.port.emit('loadMaterializableOptions'); 
}
SearchApiNewResultManager.prototype.loadPreview = function (imgSrc) {

    document.getElementById('concept-preview-image').src = imgSrc;
}

var sidebar;
addon.port.on("createSidebarManager", function(props) {
    
    sidebar = new SearchApiNewResultManager(props.locale); 
});
addon.port.on("createResultTemplate", function(props) {
    
    sidebar.loadResultsTemplate(props);
});