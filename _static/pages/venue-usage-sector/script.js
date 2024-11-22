window.addEventListener("load", () => {
  // Load the JSON data and render the chart once it's loaded
  $.getJSON("../../data/venuesSectors.json", (venueUsage) => {
    drawTitleSubtitle(venueUsage);
  });
});

// Load Google Charts library with required packages
google.charts.load("current", { packages: ["corechart", "bar"] });

// Main chart rendering function
function drawTitleSubtitle(venueUsage) {
  // Format data for Google Charts
  const formatEventsBySector = (data) => {
    const result = [["Sector", "Online Events", "In Person Events"]];

    for (const [sector, locations] of Object.entries(data)) {
      let onlineEvents = 0;
      let inPersonEvents = 0;

      for (const [location, count] of Object.entries(locations)) {
        if (location.toLowerCase().includes("online event") || location.toLowerCase().includes("online via zoom")) {
          onlineEvents += count;
        } else {
          inPersonEvents += count;
        }
      }

      result.push([sector, onlineEvents, inPersonEvents]);
    }

    return result;
  };

  // Use the formatter to process the data
  const formattedData = formatEventsBySector(venueUsage);

  // Convert formatted data to a DataTable for Google Charts
  const data = google.visualization.arrayToDataTable(formattedData);

  // Chart options
  const materialOptions = {
    chart: {
      title: "In-Person / Online Events Based on Sectors",
      subtitle: "Data visualization of events by sector and type",
    },
    hAxis: {
      title: "Number of Events",
      minValue: 0,
    },
    vAxis: {
      title: "Sectors",
    },
    bars: "horizontal", // Display bars horizontally
    legend: { position: "top", alignment: "center" }, // Place the legend on top
  };

  // Draw the chart in the specified div
  const materialChart = new google.charts.Bar(document.getElementById("chart_div"));
  materialChart.draw(data, google.charts.Bar.convertOptions(materialOptions));
}
