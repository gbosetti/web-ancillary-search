$(document).ready(function() {

  var dataSet = [
  [
    "Rapid Development of Web Applications that use Tilting Interactions in Single and Multi-Device Scenarios.",
    "Moira C. Norrie, Linda Di Geronimo",
    "2016",
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAUElEQVQ4jWNgoAWISS/4jw2TZAAxYqMG4NCIK8SJio3I1Fz7mPSC/5GpufakyBFUSFAzurOQNeDSjKIHm79gGnHZTNAAQgDDAHIwqZbSBgAAdeuBkboGlxYAAAAASUVORK5CYII=",
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABvklEQVQ4jY2SMWsVURCFJxGMkgRUTCEkXWxsRKzEwlcFXmFI4SVv75kHb9/uzuDi3RlsjIURsbBRtLEJgkHkaREJqFjZKDY2CgkI/gl/g0VMeAHFveW58517zmWIWp6Qp7lYWsHqN5Gnc0Q00ZalUNSLEPvE0tyJlQ8g9iHTdLUtPxHVbqGy9X0BxY3LUNsIIRxvZyDNXWiT9oVekS5AfHOp359uEb84BfFNFv8ZB83ZTOR0rJpHEFsjoslDL6FM8+OxsipdgfpXiL+A2BrEPrL426j+JIR65oDs5fUCqz2D2gbE3kBtFWr3IL4TxQL9+fHl4XA25GnuUMRuN01B7GEmvrI8HM6Gol5ksR8stsUiZ9p1VBt1u2nqoErlt1Gma/+FiYhWBn6CxbZRpnkiohDCEYi95qqx8bnOYHDsXx6T0CZB/QvEHkDtHavtsto3iD1eHabzUBtB/TPURjFeP/lXEy69g8ruQ42X+v3pXl4vQPw91H5FbSSEeoZLzyC+06oaEVEsm4sQ+z6uQe05l95pbcBqu+Mai21l6pdap2CxbVZ/GcXC3kbaq9Yw0d7yZNrkUHvKpWchhKPj978Bc/+ppeV6VSIAAAAASUVORK5CYII="
  ],
  [
    "CTAT: Tilt-and-Tap Across Devices.",
    "Moira C. Norrie, Can Tuerk, Abhimanyu Patel, Maria Husmann, Linda Di Geronimo",
    "2016",
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAUElEQVQ4jWNgoAWISS/4jw2TZAAxYqMG4NCIK8SJio3I1Fz7mPSC/5GpufakyBFUSFAzurOQNeDSjKIHm79gGnHZTNAAQgDDAHIwqZbSBgAAdeuBkboGlxYAAAAASUVORK5CYII=",
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABvklEQVQ4jY2SMWsVURCFJxGMkgRUTCEkXWxsRKzEwlcFXmFI4SVv75kHb9/uzuDi3RlsjIURsbBRtLEJgkHkaREJqFjZKDY2CgkI/gl/g0VMeAHFveW58517zmWIWp6Qp7lYWsHqN5Gnc0Q00ZalUNSLEPvE0tyJlQ8g9iHTdLUtPxHVbqGy9X0BxY3LUNsIIRxvZyDNXWiT9oVekS5AfHOp359uEb84BfFNFv8ZB83ZTOR0rJpHEFsjoslDL6FM8+OxsipdgfpXiL+A2BrEPrL426j+JIR65oDs5fUCqz2D2gbE3kBtFWr3IL4TxQL9+fHl4XA25GnuUMRuN01B7GEmvrI8HM6Gol5ksR8stsUiZ9p1VBt1u2nqoErlt1Gma/+FiYhWBn6CxbZRpnkiohDCEYi95qqx8bnOYHDsXx6T0CZB/QvEHkDtHavtsto3iD1eHabzUBtB/TPURjFeP/lXEy69g8ruQ42X+v3pXl4vQPw91H5FbSSEeoZLzyC+06oaEVEsm4sQ+z6uQe05l95pbcBqu+Mai21l6pdap2CxbVZ/GcXC3kbaq9Yw0d7yZNrkUHvKpWchhKPj978Bc/+ppeV6VSIAAAAASUVORK5CYII="
  ],
  [
    "XD-Bike: A Cross-Device Repository of Mountain Biking Routes.",
    "Moira C. Norrie, Linda Di Geronimo, Maria Husmann",
    "2016",
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAUElEQVQ4jWNgoAWISS/4jw2TZAAxYqMG4NCIK8SJio3I1Fz7mPSC/5GpufakyBFUSFAzurOQNeDSjKIHm79gGnHZTNAAQgDDAHIwqZbSBgAAdeuBkboGlxYAAAAASUVORK5CYII=",
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABvklEQVQ4jY2SMWsVURCFJxGMkgRUTCEkXWxsRKzEwlcFXmFI4SVv75kHb9/uzuDi3RlsjIURsbBRtLEJgkHkaREJqFjZKDY2CgkI/gl/g0VMeAHFveW58517zmWIWp6Qp7lYWsHqN5Gnc0Q00ZalUNSLEPvE0tyJlQ8g9iHTdLUtPxHVbqGy9X0BxY3LUNsIIRxvZyDNXWiT9oVekS5AfHOp359uEb84BfFNFv8ZB83ZTOR0rJpHEFsjoslDL6FM8+OxsipdgfpXiL+A2BrEPrL426j+JIR65oDs5fUCqz2D2gbE3kBtFWr3IL4TxQL9+fHl4XA25GnuUMRuN01B7GEmvrI8HM6Gol5ksR8stsUiZ9p1VBt1u2nqoErlt1Gma/+FiYhWBn6CxbZRpnkiohDCEYi95qqx8bnOYHDsXx6T0CZB/QvEHkDtHavtsto3iD1eHabzUBtB/TPURjFeP/lXEy69g8ruQ42X+v3pXl4vQPw91H5FbSSEeoZLzyC+06oaEVEsm4sQ+z6uQe05l95pbcBqu+Mai21l6pdap2CxbVZ/GcXC3kbaq9Yw0d7yZNrkUHvKpWchhKPj978Bc/+ppeV6VSIAAAAASUVORK5CYII="
  ],
  [
    "Surveying personal device ecosystems with cross-device applications in mind.",
    "Moira C. Norrie, Maria Husmann, Linda Di Geronimo",
    "2016",
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAUElEQVQ4jWNgoAWISS/4jw2TZAAxYqMG4NCIK8SJio3I1Fz7mPSC/5GpufakyBFUSFAzurOQNeDSjKIHm79gGnHZTNAAQgDDAHIwqZbSBgAAdeuBkboGlxYAAAAASUVORK5CYII=",
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABvklEQVQ4jY2SMWsVURCFJxGMkgRUTCEkXWxsRKzEwlcFXmFI4SVv75kHb9/uzuDi3RlsjIURsbBRtLEJgkHkaREJqFjZKDY2CgkI/gl/g0VMeAHFveW58517zmWIWp6Qp7lYWsHqN5Gnc0Q00ZalUNSLEPvE0tyJlQ8g9iHTdLUtPxHVbqGy9X0BxY3LUNsIIRxvZyDNXWiT9oVekS5AfHOp359uEb84BfFNFv8ZB83ZTOR0rJpHEFsjoslDL6FM8+OxsipdgfpXiL+A2BrEPrL426j+JIR65oDs5fUCqz2D2gbE3kBtFWr3IL4TxQL9+fHl4XA25GnuUMRuN01B7GEmvrI8HM6Gol5ksR8stsUiZ9p1VBt1u2nqoErlt1Gma/+FiYhWBn6CxbZRpnkiohDCEYi95qqx8bnOYHDsXx6T0CZB/QvEHkDtHavtsto3iD1eHabzUBtB/TPURjFeP/lXEy69g8ruQ42X+v3pXl4vQPw91H5FbSSEeoZLzyC+06oaEVEsm4sQ+z6uQe05l95pbcBqu+Mai21l6pdap2CxbVZ/GcXC3kbaq9Yw0d7yZNrkUHvKpWchhKPj978Bc/+ppeV6VSIAAAAASUVORK5CYII="
  ],
  [
    "Mixing and Mashing Website Themes.",
    "Moira C. Norrie, Michael Nebeling, Alfonso Murolo, Linda Di Geronimo",
    "2015",
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAUElEQVQ4jWNgoAWISS/4jw2TZAAxYqMG4NCIK8SJio3I1Fz7mPSC/5GpufakyBFUSFAzurOQNeDSjKIHm79gGnHZTNAAQgDDAHIwqZbSBgAAdeuBkboGlxYAAAAASUVORK5CYII=",
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABvklEQVQ4jY2SMWsVURCFJxGMkgRUTCEkXWxsRKzEwlcFXmFI4SVv75kHb9/uzuDi3RlsjIURsbBRtLEJgkHkaREJqFjZKDY2CgkI/gl/g0VMeAHFveW58517zmWIWp6Qp7lYWsHqN5Gnc0Q00ZalUNSLEPvE0tyJlQ8g9iHTdLUtPxHVbqGy9X0BxY3LUNsIIRxvZyDNXWiT9oVekS5AfHOp359uEb84BfFNFv8ZB83ZTOR0rJpHEFsjoslDL6FM8+OxsipdgfpXiL+A2BrEPrL426j+JIR65oDs5fUCqz2D2gbE3kBtFWr3IL4TxQL9+fHl4XA25GnuUMRuN01B7GEmvrI8HM6Gol5ksR8stsUiZ9p1VBt1u2nqoErlt1Gma/+FiYhWBn6CxbZRpnkiohDCEYi95qqx8bnOYHDsXx6T0CZB/QvEHkDtHavtsto3iD1eHabzUBtB/TPURjFeP/lXEy69g8ruQ42X+v3pXl4vQPw91H5FbSSEeoZLzyC+06oaEVEsm4sQ+z6uQe05l95pbcBqu+Mai21l6pdap2CxbVZ/GcXC3kbaq9Yw0d7yZNrkUHvKpWchhKPj978Bc/+ppeV6VSIAAAAASUVORK5CYII="
  ],
  [
    "Tilt-and-Tap: Framework to Support Motion-Based Web Interaction Techniques.",
    "Moira C. Norrie, Ersan Aras, Linda Di Geronimo",
    "2015",
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAUElEQVQ4jWNgoAWISS/4jw2TZAAxYqMG4NCIK8SJio3I1Fz7mPSC/5GpufakyBFUSFAzurOQNeDSjKIHm79gGnHZTNAAQgDDAHIwqZbSBgAAdeuBkboGlxYAAAAASUVORK5CYII=",
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABvklEQVQ4jY2SMWsVURCFJxGMkgRUTCEkXWxsRKzEwlcFXmFI4SVv75kHb9/uzuDi3RlsjIURsbBRtLEJgkHkaREJqFjZKDY2CgkI/gl/g0VMeAHFveW58517zmWIWp6Qp7lYWsHqN5Gnc0Q00ZalUNSLEPvE0tyJlQ8g9iHTdLUtPxHVbqGy9X0BxY3LUNsIIRxvZyDNXWiT9oVekS5AfHOp359uEb84BfFNFv8ZB83ZTOR0rJpHEFsjoslDL6FM8+OxsipdgfpXiL+A2BrEPrL426j+JIR65oDs5fUCqz2D2gbE3kBtFWr3IL4TxQL9+fHl4XA25GnuUMRuN01B7GEmvrI8HM6Gol5ksR8stsUiZ9p1VBt1u2nqoErlt1Gma/+FiYhWBn6CxbZRpnkiohDCEYi95qqx8bnOYHDsXx6T0CZB/QvEHkDtHavtsto3iD1eHabzUBtB/TPURjFeP/lXEy69g8ruQ42X+v3pXl4vQPw91H5FbSSEeoZLzyC+06oaEVEsm4sQ+z6uQe05l95pbcBqu+Mai21l6pdap2CxbVZ/GcXC3kbaq9Yw0d7yZNrkUHvKpWchhKPj978Bc/+ppeV6VSIAAAAASUVORK5CYII="
  ],
  [
    "The Forgotten Many? A Survey of Modern Web Development Practices.",
    "Michael Nebeling, Alfonso Murolo, Linda Di Geronimo, Moira C. Norrie",
    "2014",
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAUElEQVQ4jWNgoAWISS/4jw2TZAAxYqMG4NCIK8SJio3I1Fz7mPSC/5GpufakyBFUSFAzurOQNeDSjKIHm79gGnHZTNAAQgDDAHIwqZbSBgAAdeuBkboGlxYAAAAASUVORK5CYII=",
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABvklEQVQ4jY2SMWsVURCFJxGMkgRUTCEkXWxsRKzEwlcFXmFI4SVv75kHb9/uzuDi3RlsjIURsbBRtLEJgkHkaREJqFjZKDY2CgkI/gl/g0VMeAHFveW58517zmWIWp6Qp7lYWsHqN5Gnc0Q00ZalUNSLEPvE0tyJlQ8g9iHTdLUtPxHVbqGy9X0BxY3LUNsIIRxvZyDNXWiT9oVekS5AfHOp359uEb84BfFNFv8ZB83ZTOR0rJpHEFsjoslDL6FM8+OxsipdgfpXiL+A2BrEPrL426j+JIR65oDs5fUCqz2D2gbE3kBtFWr3IL4TxQL9+fHl4XA25GnuUMRuN01B7GEmvrI8HM6Gol5ksR8stsUiZ9p1VBt1u2nqoErlt1Gma/+FiYhWBn6CxbZRpnkiohDCEYi95qqx8bnOYHDsXx6T0CZB/QvEHkDtHavtsto3iD1eHabzUBtB/TPURjFeP/lXEy69g8ruQ42X+v3pXl4vQPw91H5FbSSEeoZLzyC+06oaEVEsm4sQ+z6uQe05l95pbcBqu+Mai21l6pdap2CxbVZ/GcXC3kbaq9Yw0d7yZNrkUHvKpWchhKPj978Bc/+ppeV6VSIAAAAASUVORK5CYII="
  ],
  [
    "X-Themes: Supporting Design-by-Example.",
    "Alfonso Murolo, Linda Di Geronimo, Michael Nebeling, Moira C. Norrie",
    "2014",
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAUElEQVQ4jWNgoAWISS/4jw2TZAAxYqMG4NCIK8SJio3I1Fz7mPSC/5GpufakyBFUSFAzurOQNeDSjKIHm79gGnHZTNAAQgDDAHIwqZbSBgAAdeuBkboGlxYAAAAASUVORK5CYII=",
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABvklEQVQ4jY2SMWsVURCFJxGMkgRUTCEkXWxsRKzEwlcFXmFI4SVv75kHb9/uzuDi3RlsjIURsbBRtLEJgkHkaREJqFjZKDY2CgkI/gl/g0VMeAHFveW58517zmWIWp6Qp7lYWsHqN5Gnc0Q00ZalUNSLEPvE0tyJlQ8g9iHTdLUtPxHVbqGy9X0BxY3LUNsIIRxvZyDNXWiT9oVekS5AfHOp359uEb84BfFNFv8ZB83ZTOR0rJpHEFsjoslDL6FM8+OxsipdgfpXiL+A2BrEPrL426j+JIR65oDs5fUCqz2D2gbE3kBtFWr3IL4TxQL9+fHl4XA25GnuUMRuN01B7GEmvrI8HM6Gol5ksR8stsUiZ9p1VBt1u2nqoErlt1Gma/+FiYhWBn6CxbZRpnkiohDCEYi95qqx8bnOYHDsXx6T0CZB/QvEHkDtHavtsto3iD1eHabzUBtB/TPURjFeP/lXEy69g8ruQ42X+v3pXl4vQPw91H5FbSSEeoZLzyC+06oaEVEsm4sQ+z6uQe05l95pbcBqu+Mai21l6pdap2CxbVZ/GcXC3kbaq9Yw0d7yZNrkUHvKpWchhKPj978Bc/+ppeV6VSIAAAAASUVORK5CYII="
  ],
  [
    "A Parallel Genetic Algorithm Based on Hadoop MapReduce for the Automatic Generation of JUnit Test Suites.",
    "Federica Sarro, Alfonso Murolo, Filomena Ferrucci, Linda Di Geronimo",
    "2012",
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAUElEQVQ4jWNgoAWISS/4jw2TZAAxYqMG4NCIK8SJio3I1Fz7mPSC/5GpufakyBFUSFAzurOQNeDSjKIHm79gGnHZTNAAQgDDAHIwqZbSBgAAdeuBkboGlxYAAAAASUVORK5CYII=",
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABvklEQVQ4jY2SMWsVURCFJxGMkgRUTCEkXWxsRKzEwlcFXmFI4SVv75kHb9/uzuDi3RlsjIURsbBRtLEJgkHkaREJqFjZKDY2CgkI/gl/g0VMeAHFveW58517zmWIWp6Qp7lYWsHqN5Gnc0Q00ZalUNSLEPvE0tyJlQ8g9iHTdLUtPxHVbqGy9X0BxY3LUNsIIRxvZyDNXWiT9oVekS5AfHOp359uEb84BfFNFv8ZB83ZTOR0rJpHEFsjoslDL6FM8+OxsipdgfpXiL+A2BrEPrL426j+JIR65oDs5fUCqz2D2gbE3kBtFWr3IL4TxQL9+fHl4XA25GnuUMRuN01B7GEmvrI8HM6Gol5ksR8stsUiZ9p1VBt1u2nqoErlt1Gma/+FiYhWBn6CxbZRpnkiohDCEYi95qqx8bnOYHDsXx6T0CZB/QvEHkDtHavtsto3iD1eHabzUBtB/TPURjFeP/lXEy69g8ruQ42X+v3pXl4vQPw91H5FbSSEeoZLzyC+06oaEVEsm4sQ+z6uQe05l95pbcBqu+Mai21l6pdap2CxbVZ/GcXC3kbaq9Yw0d7yZNrkUHvKpWchhKPj978Bc/+ppeV6VSIAAAAASUVORK5CYII="
  ]
];
	
var renderImage = function(data, type, row) {
    if(data != null)
      return "<img src='"+data+"'/>";
    return "<img src='data:image/png;base64,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'/>";
}
var columnDefs = [{
	title: "Title",
	responsivePriority: 1
}, {
	title: "Authors",
	responsivePriority: 2
}, 
{
	title: "Year",
	responsivePriority: 3,
	className: "tablet-l desktop"
},
{
	title: "Export",
	render: renderImage,
	responsivePriority: 4,
	className: "tablet-l desktop"
},{
	title: "Share",
	orderable: false,
	render: renderImage,
	responsivePriority: 4,
	className: "tablet-l desktop"
}];

  /*render: function(data, type, row) {
        return decodeURIComponent(escape(data));
    }*/

  var myTable;

  myTable = $('#results').DataTable({
    pagingType: "simple",
    data: dataSet,
    columns: columnDefs,
    pageLength: 5,
    info: false,
    dom: 'Brtip',        // Bfrtip -> the f enables the search
          select: 'single',
          responsive: true,
          altEditor: false,     // Enable altEditor
          buttons: []
  });


});
