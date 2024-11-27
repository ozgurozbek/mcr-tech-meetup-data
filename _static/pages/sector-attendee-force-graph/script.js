window.addEventListener("load", () => {
  $.getJSON("../../data/attendeeSectorForce.json", init);
});

function init(attendees) {
  if (
    !attendees ||
    typeof attendees !== "object" ||
    Object.keys(attendees).length === 0
  ) {
    console.error("Invalid or empty data:", attendees);
    return;
  }

  let sectorNodes = {}; // Store sector nodes (clustered attendees per sector)
  let links = []; // Store links between sector nodes

  // Step 1: Process each attendee and their sectors
  Object.keys(attendees).forEach((attendeeId) => {
    const sectors = attendees[attendeeId]; // List of sectors this attendee belongs to

    // Iterate over sectors the attendee belongs to
    Object.values(sectors).forEach((sector) => {
      // Skip undefined or "Undefined" sectors
      if (!sector || sector === "Undefined") {
        return;
      }

      // Create a sector node if it doesn't exist yet
      if (!sectorNodes[sector]) {
        sectorNodes[sector] = {
          id: sector,
          name: sector,
          attendees: new Set(), // Set to avoid duplicate attendees in the same sector
          count: 0,
        };
      }

      // Add attendee to this sector's node (avoid duplicates)
      sectorNodes[sector].attendees.add(attendeeId);
      sectorNodes[sector].count++; // Increase count for this sector
    });
  });

  // Step 2: Create a list of sector nodes
  let nodes = Object.values(sectorNodes).map((sectorNode) => ({
    id: sectorNode.id,
    name: sectorNode.name,
    group: "sector",
    count: sectorNode.count,
  }));

  // Step 3: Create links between sectors that share attendees
  Object.keys(sectorNodes).forEach((sectorKey) => {
    const sectorNode = sectorNodes[sectorKey];
    // Link sector to other sectors that share at least one attendee
    Object.keys(sectorNodes).forEach((otherSectorKey) => {
      if (sectorKey !== otherSectorKey) {
        const otherSectorNode = sectorNodes[otherSectorKey];
        // Find the intersection of attendees between these two sectors
        const sharedAttendees = [...sectorNode.attendees].filter((attendee) =>
          otherSectorNode.attendees.has(attendee)
        );

        // If there's a common attendee, create a link with weight based on the number of shared attendees
        if (sharedAttendees.length > 0) {
          links.push({
            source: sectorNode.id,
            target: otherSectorNode.id,
            weight: sharedAttendees.length, // Set the link weight to the number of shared attendees
          });
        }
      }
    });
  });

  // Step 4: Setup the D3 force simulation
  const width = window.innerWidth;
  const height = window.innerHeight;

  const svg = d3
    .select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  const graphGroup = svg.append("g");

  // Zoom and pan behavior
  const zoom = d3
    .zoom()
    .scaleExtent([0.05, 5]) // Min and max zoom scale
    .on("zoom", function (event) {
      graphGroup.attr("transform", event.transform);
    });
  svg.call(zoom);

  // Create the force simulation
  const simulation = d3
    .forceSimulation(nodes)
    .force(
      "link",
      d3
        .forceLink(links)
        .id((d) => d.id)
        .distance(4000)
    )
    .force("charge", d3.forceManyBody().strength(-1000))
    .force("center", d3.forceCenter(width / 2, height / 2))
    .force("collide", d3.forceCollide(1500)); // Prevent nodes from overlapping

  // Step 5: Create the links (edges) between sectors
  const link = graphGroup
    .append("g")
    .selectAll(".link")
    .data(links)
    .enter()
    .append("line")
    .attr("class", "link")
    .attr("stroke-width", (d) => {
      const weight = d.weight; // Get the weight from the link (number of shared attendees)
      return Math.max(weight / 16, 1); // Ensure a minimum stroke width of 1, increase based on sqrt weight
    })
    .attr("stroke-opacity", 0.6);

  // Step 6: Create the sector nodes
  const node = graphGroup
    .selectAll(".node")
    .data(nodes)
    .enter()
    .append("g")
    .attr("class", "node")
    .call(
      d3.drag().on("start", dragstart).on("drag", dragged).on("end", dragend)
    );

  // Add circles for sector nodes (larger for more attendees)
  node
    .append("circle")
    .attr("r", (d) => 20 + Math.sqrt(d.count) * 5) // Increase size based on the number of attendees
    .attr("fill", "#ff7f0e");

  // Add labels for sector nodes
  node
    .append("text")
    .attr("dx", 30)
    .attr("dy", 5)
    .text((d) => d.name);

  // Tooltip for nodes
  const tooltip = d3.select("body").append("div").attr("class", "tooltip");

  node
    .on("mouseover", function (event, d) {
      tooltip
        .style("visibility", "visible")
        .text(d.name + " (" + d.count + " attendees)");
    })
    .on("mousemove", function (event) {
      tooltip
        .style("top", event.pageY + 10 + "px")
        .style("left", event.pageX + 10 + "px");
    })
    .on("mouseout", function () {
      tooltip.style("visibility", "hidden");
    });

  // Step 7: Define the tick function for simulation
  simulation.on("tick", () => {
    link
      .attr("x1", (d) => d.source.x)
      .attr("y1", (d) => d.source.y)
      .attr("x2", (d) => d.target.x)
      .attr("y2", (d) => d.target.y);

    node.attr("transform", (d) => `translate(${d.x},${d.y})`);
  });

  // Drag functions
  function dragstart(event, d) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  function dragged(event, d) {
    d.fx = event.x;
    d.fy = event.y;
  }

  function dragend(event, d) {
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }
}
