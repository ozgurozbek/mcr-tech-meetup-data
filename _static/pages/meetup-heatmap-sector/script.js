let heat;
let locations;
let layerGroup;
let sectorsArr;

window.addEventListener("load",() => {
    $.getJSON("../../data/eventLatLongTimelineSectors.json", init);
});

function init(data) {
  sectorList = data;
  sectorsArr = Object.keys(sectorList["sectorList"]);
  const select = document.getElementById("sectors");

  for (var i = 0; i < sectorsArr.length; i++) {
    const opt = document.createElement('option');
    opt.textContent = sectorsArr[i];
    opt.value = sectorsArr[i];
    select.appendChild(opt);
  }

  var map = L.map("map").setView([53.479159, -2.242726], 15);

  L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
    maxZoom: 18,
  }).addTo(map);

  layerGroup = L.layerGroup().addTo(map);
  heat = L.heatLayer(sectorList["locations"], { radiusVal, blurVal });
  document.getElementById("eventsCount").innerText = `Events: ${sectorList["locations"].length}`;
  heat.addTo(layerGroup);
}

function getSectorCoords(sector) {
  let sectorListCategorized = [];
  const sectorData = sectorList["sectorList"][sector];
  if (sectorData) {
      sectorListCategorized.push(sectorData.primary || []);
      sectorListCategorized.push(sectorData.secondary || []);
      sectorListCategorized.push(sectorData.tertiary || []);
  } else {
      console.error(`Sector "${sector}" not found in sectorList.`);
  }
  console.log("sectorListCategorized: ", sectorListCategorized);
  return sectorListCategorized;
}

function updateSector(val) {
  // console.log("updating sector")
  layerGroup.clearLayers();
  let data = getSectorCoords(val);
  // console.log("sectorsArr:", sectorsArr);
  // console.log("val:", val);
  // console.log("data:", data);
  document.getElementById("sectors").value = val;
  
  let heat1 = L.heatLayer(data[0], {max: 1.0});
  let heat2 = L.heatLayer(data[1], {max: 0.8});
  let heat3 = L.heatLayer(data[2], {max: 0.6});
  
  document.getElementById("eventsCount").innerText = `Events: ${data[0].length+data[1].length+data[2].length}`;
  heat1.addTo(layerGroup);
  heat2.addTo(layerGroup);
  heat3.addTo(layerGroup);
}