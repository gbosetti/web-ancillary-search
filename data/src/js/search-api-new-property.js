//addon es la variable global que el SDK de Firefox pone a disposición para acceder al puerto
//addon is the global var that Firefox SDK provides for accessing the port

function SearchApiNewPropertyManager(lbundle) {
    this.locale = lbundle;
}
//SearchApiNewPropertyManager.prototype = new SidebarManager();
SearchApiNewPropertyManager.prototype.loadResultsTemplate = function (props) {

    this.loadPreview(props);
    addon.port.emit('loadMaterializableOptions'); 
}
SearchApiNewPropertyManager.prototype.loadPreview = function (imgSrc) {

    document.getElementById('property-preview-image').src = imgSrc;
}

var sidebar;
addon.port.on("createSidebarManager", function(props) {
    
    sidebar = new SearchApiNewPropertyManager(props.locale); 
});
addon.port.on("createPropertyTemplate", function(props) {
    
    sidebar.loadResultsTemplate(props);
});