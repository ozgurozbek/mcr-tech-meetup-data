let rsvpBreakdown;

window.addEventListener("load",() => {
    $.getJSON("../../data/rsvpBreakdown.json", renderChart);
});

function renderChart(data) {
    rsvpBreakdown = data;
    google.charts.load('current', {'packages':['treemap']});
    google.charts.setOnLoadCallback(drawChart);
}


function drawChart() {
  var data = new google.visualization.DataTable();
  data.addColumn('string', 'ID');
  data.addColumn('string', 'Parent');
  data.addColumn('number', 'RSVPs');
  data.addRows(rsvpBreakdown);

  var tree = new google.visualization.TreeMap(document.getElementById('chart_div'));

  var options = { // For v49 or before
    highlightOnMouseOver: true,
    maxDepth: 1,
    maxPostDepth: 2,
    minHighlightColor: '#8c6bb1',
    midHighlightColor: '#9ebcda',
    maxHighlightColor: '#edf8fb',
    minColor: '#009688',
    midColor: '#f7f7f7',
    maxColor: '#ee8100',
    headerHeight: 15,
    showScale: true,
    height: 1000,
    useWeightedAverageForAggregation: true
  };

  var optionsV50 = { // For v50+
    enableHighlight: true,
    maxDepth: 1,
    maxPostDepth: 2,
    minHighlightColor: '#8c6bb1',
    midHighlightColor: '#9ebcda',
    maxHighlightColor: '#edf8fb',
    minColor: '#009688',
    midColor: '#f7f7f7',
    maxColor: '#ee8100',
    headerHeight: 15,
    showScale: true,
    height: 1000,
    useWeightedAverageForAggregation: true,
    // Use click to highlight and double-click to drill down.
    eventsConfig: {
      highlight: ['click'],
      unhighlight: ['mouseout'],
      rollup: ['contextmenu'],
      drilldown: ['dblclick'],
    }
  };

    tree.draw(data, options);
    // Please uncomment the following line for v50+.
    // tree.draw(data, optionsV50);

}