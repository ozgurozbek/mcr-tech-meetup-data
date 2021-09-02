window.addEventListener("load",() => {
  $.getJSON("../../data/venueUsage.json", renderChart);
});

function renderChart(venueUsage) {
let queryString = window.location.search, urlParams = new URLSearchParams(queryString), count = urlParams.get('venues');

if (count != null) {
  let filterTo = parseInt(count);
  venueUsage = venueUsage.map(month => month.slice(0, filterTo + 1));
}

google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(drawChart);

function drawChart() {
  var data = google.visualization.arrayToDataTable(venueUsage);

  var options = {
    title: 'Venue Attendees / Month',
    curveType: 'function'
  };

  var chart = new google.visualization.LineChart(document.getElementById('chart'));

  chart.draw(data, options);
}
}