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

  let sectorNodes = {}; // Store sector nodes
  let attendeeClusters = {}; // Store attendee clusters based on shared sector membership
  let links = []; // Store links between sectors and clusters

  // Step 1: Process each attendee and their sectors
  Object.keys(attendees).forEach((attendeeId) => {
    const sectors = attendees[attendeeId]; // List of sectors this attendee belongs to

    // Iterate over sectors the attendee belongs to
    Object.values(sectors).forEach((sector) => {
      if (!sector || sector === "Undefined") {
        return; // Skip undefined or irrelevant sectors
      }

      // Create a sector node if it doesn't exist yet
      if (!sectorNodes[sector]) {
        sectorNodes[sector] = {
          id: sector,
          name: sector,
          count: 0,
          attendees: new Set(),
        };
      }

      // Add attendee to this sector's node
      sectorNodes[sector].attendees.add(attendeeId);
      sectorNodes[sector].count++;
    });
  });

  // Step 2: Create meaningful attendee clusters based on shared sectors
  let attendeeClustersData = {}; // Track attendee clusters
  Object.keys(attendees).forEach((attendeeId) => {
    const sectors = attendees[attendeeId];
    let clusterKey = Object.values(sectors).sort().join("-"); // Create a unique key based on sector combination

    if (!attendeeClustersData[clusterKey]) {
      attendeeClustersData[clusterKey] = {
        attendees: new Set(),
        sectors: new Set(Object.values(sectors)),
      };
    }

    attendeeClustersData[clusterKey].attendees.add(attendeeId);
  });

  // Step 3: Create nodes for sectors and meaningful attendee clusters
  let nodes = [];
  let sectorNodeMap = {};

  // Create sector nodes
  Object.values(sectorNodes).forEach((sectorNode) => {
    nodes.push({
      id: sectorNode.id,
      name: sectorNode.name,
      group: "sector",
      count: sectorNode.count,
    });
    sectorNodeMap[sectorNode.id] = sectorNode;
  });

  // Create meaningful attendee cluster nodes
  let attendeeClusterNodes = Object.keys(attendeeClustersData).map(
    (clusterKey) => {
      let clusterData = attendeeClustersData[clusterKey];
      return {
        id: clusterKey,
        name: `Cluster: ${clusterKey}`,
        group: "attendeeCluster",
        count: clusterData.attendees.size,
        sectors: Array.from(clusterData.sectors),
      };
    }
  );

  // Add attendee clusters to the nodes array
  nodes = nodes.concat(attendeeClusterNodes);

  // Step 4: Create links between sector nodes and meaningful attendee clusters
  Object.keys(attendeeClustersData).forEach((clusterKey) => {
    const cluster = attendeeClustersData[clusterKey];

    // For each attendee cluster, link to sectors that share them
    cluster.sectors.forEach((sector) => {
      links.push({
        source: sector,
        target: clusterKey,
      });
    });
  });

  // Step 5: Setup the D3 force simulation
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
    .scaleExtent([0.1, 5]) // Min and max zoom scale
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
        .distance(150)
    ) // Increased link distance for better spacing
    .force("charge", d3.forceManyBody().strength(-500)) // Repulsion force for nodes
    .force("center", d3.forceCenter(width / 2, height / 2)) // Center the graph
    .force("collide", d3.forceCollide(40)); // Prevent nodes from overlapping

  // Step 6: Create the links (edges) between sectors and attendee clusters
  const link = graphGroup
    .append("g")
    .selectAll(".link")
    .data(links)
    .enter()
    .append("line")
    .attr("class", "link")
    .attr("stroke-width", 2)
    .attr("stroke-opacity", 0.6);

  // Step 7: Create the sector and attendee cluster nodes
  const node = graphGroup
    .selectAll(".node")
    .data(nodes)
    .enter()
    .append("g")
    .attr("class", "node")
    .call(
      d3.drag().on("start", dragstart).on("drag", dragged).on("end", dragend)
    );

  // Add circles for sector and attendee cluster nodes (larger for more attendees)
  node
    .append("circle")
    .attr("r", (d) =>
      d.group === "attendeeCluster"
        ? 20 + Math.sqrt(d.count) * 8
        : 20 + Math.sqrt(d.count) * 5
    ) // Larger for attendee clusters
    .attr("fill", (d) =>
      d.group === "attendeeCluster" ? "#1f77b4" : "#ff7f0e"
    );

  // Add labels for sector and attendee cluster nodes
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

  // Step 8: Define the tick function for simulation
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
