window.addEventListener("load",() => {
    $.getJSON("../../data/coreStats.json", renderChart);
});

function renderChart(coreStats) {
    google.charts.load('current', {'packages':['corechart']});
    google.charts.setOnLoadCallback(drawVisualization);

    function drawVisualization() {
      let data = google.visualization.arrayToDataTable([
        ["Year", "Active Groups", "Events", "RSVPs (100's)", "Venues", "Attendees (100's)"]
      ].concat(coreStats.years.map(y => [y.year.toString(), y.data.activeGroups, y.data.events, y.data.rsvps / 100, y.data.venues, y.data.attendees / 100])));

      let options = {
        title : 'CompiledMCR Data: Yearly Statistics Combo Chart',
        // vAxis: {title: 'Count'},
        // hAxis: {title: 'Year'},
        seriesType: 'bars',
        // series: {5: {type: 'line'}}
      };

      let chart = new google.visualization.ComboChart(document.getElementById('chart'));
      chart.draw(data, options);
    }
}