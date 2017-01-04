$(document).ready(function() {

  /*render: function(data, type, row) {
        return decodeURIComponent(escape(data));
    }*/

  var myTable = $('#results').DataTable({
    pagingType: "simple",
    data: window.ancillaryDataSet,
    columns: window.ancillaryColDefs,
    pageLength: 5,
    info: false,
    dom: 'Brtip',        // Bfrtip -> the f enables the search
          select: 'single',
          responsive: true,
          altEditor: false,     // Enable altEditor
          buttons: []
  });
});
